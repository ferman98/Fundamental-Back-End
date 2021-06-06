const bcrypt = require('bcrypt');
const pool = require('../../database');
const setError = require('../../exception/errorSetter');

const userHelper = {
  async verifyUserCredential(username, password) {
    const query = {
      text: 'SELECT id, password FROM users WHERE username LIKE $1',
      values: [`${username}%`],
    };
    const result = await pool.query(query);
    if (result.rows.length === 0) {
      throw setError.Unauthorized('Kredensial yang Anda berikan salah');
    }

    const { id, password: hashedPassword } = result.rows[0];

    const match = await bcrypt.compare(password, hashedPassword);
    if (!match) {
      throw setError.Unauthorized('Kredensial yang Anda berikan salah');
    }
    return id;
  },

  async verifyNewUsername(username) {
    const query = {
      text: 'SELECT username FROM users WHERE username LIKE $1',
      values: [`${username}%`],
    };
    const result = await pool.query(query);
    if (result.rows.length > 0) {
      throw setError.BadRequest('Gagal menambahkan user. Username sudah digunakan.');
    }
  },
};

module.exports = userHelper;
