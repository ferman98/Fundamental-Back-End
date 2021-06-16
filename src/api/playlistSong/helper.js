const playlistHelper = require('../playlist/helper');
const collaborationsHelper = require('../collaboration/helper');

const playlistSongHelper = {
  async validateOwner(playlistId, owner) {
    try {
      await playlistHelper.validatePlaylistByPlaylistIdAndUserId(playlistId, owner);
    } catch (e) {
      await collaborationsHelper.validateColaboration(playlistId, owner);
    }
  },
};

module.exports = playlistSongHelper;
