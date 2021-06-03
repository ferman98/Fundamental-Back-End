const handler = require('./handler');

const routes = [
  {
    method: 'GET',
    path: '/songs',
    handler: handler.getAllSongs,
  },
  {
    method: 'GET',
    path: '/songs/{songId}',
    handler: handler.getSongById,
  },
  {
    method: 'POST',
    path: '/songs',
    handler: handler.addSong,
  },
  {
    method: 'PUT',
    path: '/songs/{songId}',
    handler: handler.updateSong,
  },
  {
    method: 'DELETE',
    path: '/songs/{songId}',
    handler: handler.deleteSong,
  },
];

module.exports = routes;
