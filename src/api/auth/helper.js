const pool = require('../../database');
const setError = require('../../exception/errorSetter');

const authHelper = {
  async validateRefreshTokenInDB(refreshToken) {
    const query = {
      text: 'SELECT token FROM authentications WHERE token = $1',
      values: [refreshToken],
    };
    const result = await pool.query(query);
    if (result.rows.length === 0) {
      throw setError.BadRequest('Data Not Found');
    }
  },
};

module.exports = authHelper;
