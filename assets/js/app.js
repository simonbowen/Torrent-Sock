var Vue = require('Vue'),
    TorrentList = require('./components/TorrentList.js'),
    AddTorrent = require('./components/AddTorrent.js');


Vue.config.debug = true;

Vue.use(require('vue-resource'));

new Vue({
  el: '#app',
  template: require('../templates/app.html'),
  components: [TorrentList, AddTorrent]
});
