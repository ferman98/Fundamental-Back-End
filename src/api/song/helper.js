const pool = require('../../database');
const OpenMusicErrorHandling = require('../../exception/OpenMusicErrorHandling');

const songHelper = {
  async validateSongById(songId) {
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [songId],
    };
    const result = await pool.query(query);
    if (result.rows.length === 0) {
      throw OpenMusicErrorHandling('Data Not Found', 403);
    }
  },
};

module.exports = songHelper;
