const routes = require('../api/exportPlaylist/routes');

const exportPlaylistPlugin = {
  name: 'exportPlaylist',
  version: '1.0.0',
  register: async (server) => {
    server.route(routes);
  },
};

module.exports = exportPlaylistPlugin;
