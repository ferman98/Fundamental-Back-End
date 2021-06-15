const playlistHelper = require('../playlist/helper');
const collaborationsHelper = require('../collaboration/helper');
const pool = require('../../database');

const playlistSongHelper = {
  async validateOwner(playlistId, owner) {
    try {
      await playlistHelper.validatePlaylistByPlaylistIdAndUserId(playlistId, owner);
    } catch (e) {
      await collaborationsHelper.validateColaboration(playlistId, owner);
    }
  },

  async selectAllSongInPlaylist(playlistId) {
    const query = {
      text: `SELECT songs.*
      FROM songs
      LEFT JOIN playlistsongs
      ON songs.id = playlistsongs.song_id AND playlistsongs.playlist_id = $1`,
      values: [playlistId],
    };
    const result = await pool.query(query);
    return result.rows;
  },
};

module.exports = playlistSongHelper;
