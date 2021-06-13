const path = require('path');

const staticFilePlugin = {
  name: 'staticFile',
  version: '1.0.0',
  register: async (server) => {
    server.route([
      {
        method: 'GET',
        path: '/assets/{param*}',
        handler: {
          directory: {
            path: path.resolve(__dirname, '../../', 'assets'),
          },
        },
      },
    ]);
  },
};

module.exports = staticFilePlugin;
