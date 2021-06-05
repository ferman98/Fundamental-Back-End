const bcrypt = require('bcrypt');
const pool = require('../../database');
const OpenMusicErrorHandling = require('../../exception/OpenMusicErrorHandling');

const userHelper = {
  async verifyUserCredential(username, password) {
    const query = {
      text: 'SELECT id, password FROM users WHERE username = $1',
      values: [username],
    };
    const result = await pool.query(query);
    if (result.rows.length === 0) {
      throw OpenMusicErrorHandling('Kredensial yang Anda berikan salah', 404);
    }

    const { id, password: hashedPassword } = result.rows[0];

    const match = await bcrypt.compare(password, hashedPassword);
    if (!match) {
      throw OpenMusicErrorHandling('Kredensial yang Anda berikan salah', 404);
    }
    return id;
  },

  async verifyNewUsername(username) {
    const query = {
      text: 'SELECT username FROM users WHERE username = $1',
      values: [username],
    };
    const result = await pool.query(query);
    if (result.rows.length > 0) {
      throw OpenMusicErrorHandling('Gagal menambahkan user. Username sudah digunakan.', 403);
    }
  },
};

module.exports = userHelper;
