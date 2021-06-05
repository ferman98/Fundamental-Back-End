const routes = require('../api/playlist/routes');

const playlistPlugin = {
  name: 'playlist',
  version: '1.0.0',
  register: async (server) => {
    server.route(routes);
  },
};

module.exports = playlistPlugin;
