var Vue = require('Vue'),
    filesize = require('filesize');

var TorrentItem = Vue.extend({
  name: 'torrent-item',
  props: ['torrent'],
  template: require('../../templates/torrent-item.html'),
  ready: function() {

  },
  computed: {
    progressPercentage: function() {
      var percProgress = this.torrent.progress * 100;
      return percProgress.toFixed(2);
    },
    calculatedUploadSpeed: function() {
      return filesize(this.torrent.uploadSpeed);
    },
    calculatedDownloadSpeed: function() {
      return filesize(this.torrent.downloadSpeed);
    }
  }
});

module.exports = TorrentItem;
