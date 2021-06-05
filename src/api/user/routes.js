const handler = require('./userHandler');

const routes = [
  {
    method: 'POST',
    path: '/users',
    handler: handler.postUserHandler,
  },
];

module.exports = routes;
