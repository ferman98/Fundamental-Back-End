const routes = require('../api/upload/routes');

const uploadPlugin = {
  name: 'upload',
  version: '1.0.0',
  register: async (server) => {
    server.route(routes);
  },
};

module.exports = uploadPlugin;
