const pool = require('../../database');
const OpenMusicErrorHandling = require('../../exception/OpenMusicErrorHandling');

const songHelper = {
  async validateSongById(songId) {
    const result = await pool.query(`SELECT * FROM songs WHERE id = '${songId}'`);
    if (result.rows.length === 0) {
      throw OpenMusicErrorHandling('Data Not Found', 404);
    }
  },
};

module.exports = songHelper;
