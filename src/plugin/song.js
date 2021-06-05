const routes = require('../api/song/routes');

const songPlugin = {
  name: 'songs',
  version: '1.0.0',
  register: async (server) => {
    server.route(routes);
  },
};

module.exports = songPlugin;
