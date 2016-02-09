var http = require('http'),
    WebTorrent = require('webtorrent'),
    express = require('express'),
    bodyParser = require('body-parser'),
    randomstring = require("randomstring"),
    _ = require('lodash'),
    fs = require('fs'),
    mkdirp = require('mkdirp'),
    path = require('path');

var client = new WebTorrent();
var token = false;

var config = {
  downloadDir: '/Users/simonbowen/Downloads'
};

var app = express();
app.use(bodyParser.json());
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(express.static('public'));

var io = require('socket.io').listen(app.listen(8080));

var serializeTorrent = function (torrent) {
  return {
    path: torrent.path,
    ratio: torrent.ratio,
    progress: torrent.progress,
    downloadSpeed: torrent.downloadSpeed,
    uploadSpeed: torrent.uploadSpeed,
    path: torrent.path,
    timeRemaining: torrent.timeRemaining,
    infoHash: torrent.infoHash
  }
};

app.get('/', function(req, res) {
  token = randomstring.generate();
  res.render('app', {token: token});
});

// Add a new torrent
app.post('/torrents', function (req, res) {
  var data = req.body;
  var torrent = client.add(data.magnet, {}, function (torrent) {
    io.emit('torrent.added', {torrent: serializeTorrent(torrent)});
  });

  // Emit socket events for torrent updates
  torrent.on('download', function (chunksize) {
    io.emit('torrent.update', {torrent: serializeTorrent(torrent)});
  });

  // Handle the torrent files when they have been completed
  torrent.on('done', function () {
    io.emit('torrent.done', {torrent: serializeTorrent(torrent)});
    torrent.files.forEach(function (file) {
      var source = file.createReadStream();
      var downloadDir = config.downloadDir + '/' + file.path;
      var downloadPath = path.dirname(downloadDir);

      mkdirp(downloadPath, function (err) {
        var destination = fs.createWriteStream(downloadPath + '/' + file.name);
        source.pipe(destination);
      });

    });
  });

});

app.get('/torrents', function (req, res) {
  var torrents = _.map(client.torrents, function (torrent) {
    return serializeTorrent(torrent);
  });

  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(torrents));
});
