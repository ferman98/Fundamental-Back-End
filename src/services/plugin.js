const routes = require('../api/routes');

const routerPlugin = {
  name: 'router',
  version: '1.0.0',
  register: async (server) => {
    server.route(routes);
  },
};

module.exports = routerPlugin;
