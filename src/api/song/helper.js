const pool = require('../../database');
const setError = require('../../exception/errorSetter');

const songHelper = {
  async checkSongInDB(songId) {
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [songId],
    };
    const result = await pool.query(query);
    if (result.rows.length === 0) {
      throw setError.NotFound('Song Not Found');
    }
  },

  async validateSongById(songId) {
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [songId],
    };
    const result = await pool.query(query);
    if (result.rows.length === 0) {
      throw setError.BadRequest('Song Not Found');
    }
  },
};

module.exports = songHelper;
