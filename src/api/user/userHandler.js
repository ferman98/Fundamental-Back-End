const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');
const userSchema = require('../../validator/userSchema');
const pool = require('../../database');
const OpenMusicErrorHandling = require('../../exception/OpenMusicErrorHandling');
const userHelper = require('./helper');

const userHandler = {

  async postUserHandler(req, h) {
    const validationResult = userSchema.validate(req.payload);
    if (validationResult.error) {
      throw OpenMusicErrorHandling(validationResult.error.message, 400);
    }
    try {
      const id = `user-${nanoid(16)}`;
      const { username, password, fullname } = req.payload;
      const passHash = await bcrypt.hash(password, 10);

      await userHelper.verifyNewUsername(username);

      const query = {
        text: 'INSERT INTO users(id, username, password, fullname) VALUES($1, $2, $3, $4)',
        values: [id, username, passHash, fullname],
      };
      const result = await pool.query(query);

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
