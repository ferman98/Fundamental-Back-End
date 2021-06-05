const routes = require('../api/user/routes');

const userPlugin = {
  name: 'users',
  version: '1.0.0',
  register: async (server) => {
    server.route(routes);
  },
};

module.exports = userPlugin;
