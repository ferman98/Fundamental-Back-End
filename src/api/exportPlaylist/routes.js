const handler = require('./exportPlaylistHandler');

const routes = [
  {
    method: 'POST',
    path: '/exports/playlists/{playlistId}',
    handler: handler.postExportPlaylistHandler,
  },
];

module.exports = routes;
