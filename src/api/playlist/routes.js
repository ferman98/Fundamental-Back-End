const handler = require('./authPlaylist');

const routes = [
  {
    method: 'GET',
    path: '/playlists',
    handler: handler.getPlaylistHandler,
  },
  {
    method: 'POST',
    path: '/playlists',
    handler: handler.postPlaylistHandler,
  },
  {
    method: 'DELETE',
    path: '/playlists/{playlistId}',
    handler: handler.deletePlaylistHandler,
  },
];

module.exports = routes;
