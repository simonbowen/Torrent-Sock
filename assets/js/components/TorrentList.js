var Vue = require('Vue'),
    TorrentItem = require('./TorrentItem.js'),
    _ = require('lodash');

var TorrentList = Vue.extend({
  template: require('../../templates/torrent-list.html'),
  name: 'torrent-list',
  components: [TorrentItem],
  data: function() {
    return {
      torrents: [

      ]
    }
  },
  ready: function() {
    // Connect to the web socket
    var socket = io.connect('http://localhost:8080');
    socket.on('torrent.update', function (data) {
      var torrentUpdate = data.torrent;

      // Find the torrent in our current list and update it
      var index = _.indexOf(this.torrents, _.find(this.torrents, {infoHash: torrentUpdate.infoHash}));
      this.torrents.splice(index, 1, torrentUpdate);

    }.bind(this));

    // Grab a list of current torrents
    this.$http({url: '/torrents', method: 'GET'}).then(function (response) {
      this.torrents = response.data;
    }).bind(this);

  }
});

module.exports = TorrentList;
