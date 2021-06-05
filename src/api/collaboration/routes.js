const handler = require('./collaborationHandler');

const routes = [
  {
    method: 'POST',
    path: '/collaborations',
    handler: handler.postCollaborationsHandler,
  },
  {
    method: 'DELETE',
    path: '/collaborations',
    handler: handler.deleteCollaborationsHandler,
  },
];

module.exports = routes;
