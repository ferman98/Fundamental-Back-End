const routes = require('../api/playlistSong/routes');

const playlistSongPlugin = {
  name: 'playlistSong',
  version: '1.0.0',
  register: async (server) => {
    server.route(routes);
  },
};

module.exports = playlistSongPlugin;
