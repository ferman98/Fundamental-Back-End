const tokenManager = require('../../tokenize/TokenManager');
const pool = require('../../database');
const userHelper = require('../user/helper');
const { PostAuthenticationPayloadSchema, PutAuthenticationPayloadSchema, DeleteAuthenticationPayloadSchema } = require('../../validator/authSchema');
const OpenMusicErrorHandling = require('../../exception/OpenMusicErrorHandling');

const handler = {
  async postAuthenticationHandler(req, h) {
    try {
      const validationResult = PostAuthenticationPayloadSchema.validate(req.payload);
      if (validationResult.error) {
        throw OpenMusicErrorHandling(validationResult.error.message, 400);
      }
      const { username, password } = req.payload;
      const id = await userHelper.verifyUserCredential(username, password);
      const accessToken = tokenManager.generateAccessToken({ id });
      const refreshToken = tokenManager.generateRefreshToken({ id });

      const query = {
        text: 'INSERT INTO authentications VALUES($1)',
        values: [refreshToken],
      };
      await pool.query(query);

      const response = h.response({
        status: 'success',
        message: 'Authentication berhasil ditambahkan',
        data: {
          accessToken,
          refreshToken,
        },
      });
      response.code(201);
      return response;
    } catch (e) {
      throw OpenMusicErrorHandling(e.message, 404);
    }
  },

  async putAuthenticationHandler(req, h) {
    try {
      const validationResult = PutAuthenticationPayloadSchema.validate(req.payload);
      if (validationResult.error) {
        throw OpenMusicErrorHandling(validationResult.error.message, 400);
      }

      const { refreshToken } = req.payload;
      const { id } = tokenManager.verifyRefreshToken(refreshToken);

      const query = {
        text: 'SELECT token FROM authentications WHERE token = $1',
        values: [refreshToken],
      };
      const result = await pool.query(query);
      if (result.rows.length === 0) {
        throw OpenMusicErrorHandling('Refresh token tidak valid', 404);
      }
      const accessToken = tokenManager.generateAccessToken({ id });
      const response = h.response({
        status: 'success',
        message: 'Authentication berhasil diperbarui',
        data: {
          accessToken,
        },
      });
      response.code(200);
    } catch (e) {
      throw OpenMusicErrorHandling(e.message, 404);
    }
  },

  async deleteAuthenticationHandler(req, h) {
    try {
      const validationResult = DeleteAuthenticationPayloadSchema.validate(req.payload);
      if (validationResult.error) {
        throw OpenMusicErrorHandling(validationResult.error.message, 400);
      }

      const { refreshToken } = req.payload;

      const query = {
        text: 'DELETE FROM authentications WHERE token = $1',
        values: [refreshToken],
      };
      await pool.query(query);
      const response = h.response({
        status: 'success',
        message: 'Refresh token berhasil dihapus',
      });
      response.code(200);
    } catch (e) {
      throw OpenMusicErrorHandling(e.message, 404);
    }
  },
};

module.exports = handler;
