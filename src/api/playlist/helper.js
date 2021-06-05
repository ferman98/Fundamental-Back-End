const pool = require('../../database');
const OpenMusicErrorHandling = require('../../exception/OpenMusicErrorHandling');

const playlistHelper = {
  async validatePlaylistByUserId(userId) {
    const query = {
      text: 'SELECT * FROM playlists WHERE owner = $1',
      values: [userId],
    };
    const result = await pool.query(query);
    if (result.rows.length === 0) {
      throw OpenMusicErrorHandling('Your request rejected when validate', 403);
    }
  },
  async validatePlaylistByPlaylistIdAndUserId(playlistId, userId) {
    const query = {
      text: 'SELECT * FROM playlists WHERE id = $1 AND owner = $2',
      values: [playlistId, userId],
    };
    const result = await pool.query(query);
    if (result.rows.length === 0) {
      throw OpenMusicErrorHandling('Your request rejected when validate', 403);
    }
  },
};

module.exports = playlistHelper;
