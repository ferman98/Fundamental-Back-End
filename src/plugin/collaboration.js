const routes = require('../api/collaboration/routes');

const collaborationPlugin = {
  name: 'collaboration',
  version: '1.0.0',
  register: async (server) => {
    server.route(routes);
  },
};

module.exports = collaborationPlugin;
