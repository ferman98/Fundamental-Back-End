const pool = require('../../database');
const setError = require('../../exception/errorSetter');

const collaborationsHelper = {
  async validateColaboration(playlistId, userId) {
    const query = {
      text: 'SELECT * FROM collaborations WHERE playlist_id = $1 AND user_id = $2',
      values: [playlistId, userId],
    };
    const result = await pool.query(query);
    if (result.rows.length === 0) {
      throw setError.Forbidden('Your request rejected when validate');
    }
  },

  async validateColaborationByIDAndPlaylistID(playlistId, userId) {
    const query = {
      text: 'SELECT * FROM collaborations WHERE playlist_id = $1 AND user_id = $2',
      values: [playlistId, userId],
    };
    const result = await pool.query(query);
    if (result.rows.length === 0) {
      throw setError.Forbidden('Your request rejected when validate');
    }
  },
};

module.exports = collaborationsHelper;
