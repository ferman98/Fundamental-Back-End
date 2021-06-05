const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');
const userSchema = require('../../validator/userSchema');
const pool = require('../../database');
const OpenMusicErrorHandling = require('../../exception/OpenMusicErrorHandling');

const userHandler = {
  async verifyUserCredential(username, password) {
    const result = await pool.query(`SELECT id, password FROM users WHERE username = '${username}'`);
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
    const result = await pool.query(`SELECT username FROM users WHERE username ='${username}'`);
    if (result.rows.length > 0) {
      throw OpenMusicErrorHandling('Gagal menambahkan user. Username sudah digunakan.', 403);
    }
  },

  async postUserHandler(req, h) {
    const validationResult = userSchema.validate(req.payload);
    if (validationResult.error) {
      throw OpenMusicErrorHandling(validationResult.error.message, 400);
    }
    try {
      const id = `user-${nanoid(16)}`;
      const { username, password, fullname } = req.payload;
      const passHash = await bcrypt.hash(password, 10);

      await userHandler.verifyNewUsername(username);

      const result = await pool.query(`INSERT INTO users(id, username, password, fullname) VALUES('${id}', '${username}', '${passHash}', '${fullname}') RETURNING id`);

      const response = h.response({
        status: 'success',
        message: 'User berhasil ditambahkan',
        data: {
          userId: result.rows[0].id,
        },
      });
      response.code(201);
    } catch (e) {
      throw OpenMusicErrorHandling(e.message, 404);
    }
  },
};

module.exports = userHandler;
