const playlistHelper = require('../playlist/helper');
const collaborationsHelper = require('../collaboration/helper');

const playlistSongHelper = {
  validateOwner(playlistId, owner) {
    playlistHelper(playlistId, owner);
    collaborationsHelper(playlistId, owner);
  },
};

module.exports = playlistSongHelper;
