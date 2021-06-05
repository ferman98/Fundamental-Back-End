const pool = require('../../database');
const OpenMusicErrorHandling = require('../../exception/OpenMusicErrorHandling');

const collaborationsHelper = {
  async validateColaboration(playlistId, userId) {
    const query = {
      text: 'SELECT * FROM collaborations WHERE playlist_id = $1 AND user_id = $2',
      values: [playlistId, userId],
    };
    const result = await pool.query(query);
    if (result.rows.length === 0) {
      throw OpenMusicErrorHandling('Your request rejected when validate', 403);
    }
  },
};

module.exports = collaborationsHelper;
