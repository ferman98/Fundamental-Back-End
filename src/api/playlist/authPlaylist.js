const { nanoid } = require('nanoid');
const tokenManager = require('../../tokenize/TokenManager');
const pool = require('../../database');
const { PostPlaylistPayloadSchema } = require('../../validator/playlistScheme');
const OpenMusicErrorHandling = require('../../exception/OpenMusicErrorHandling');

const handler = {
  async postPlaylistHandler(req, h) {
    try {
      const validationResult = PostPlaylistPayloadSchema.validate(req.payload);
      if (validationResult.error) {
        throw OpenMusicErrorHandling(validationResult.error.message, 400);
      }

      const playlistId = `playlist-${nanoid(16)}`;
      const { name } = req.payload;
      const { authorization } = req.headers;

      const token = authorization.replace(/^Bearer\s*/, '');
      const { id: owner } = tokenManager.verifyAccessToken(token);

      await pool.query(`INSERT INTO playlists(id, name, owner) VALUES('${playlistId}', '${name}', '${owner}')`);

      const response = h.response({
        status: 'success',
        message: 'Playlist berhasil ditambahkan',
        data: {
          playlistId,
        },
      });
      response.code(201);
      return response;
    } catch (e) {
      throw OpenMusicErrorHandling(e.message, 404);
    }
  },

  async getPlaylistHandler(req, h) {
    try {
      const { authorization } = req.headers;

      const token = authorization.replace(/^Bearer\s*/, '');
      const { id: owner } = tokenManager.verifyAccessToken(token);

      const result = await pool.query(`SELECT * FROM playlists WHERE owner = '${owner}'`);
      if (result.rows.length === 0) {
        throw OpenMusicErrorHandling('Refresh token tidak valid', 404);
      }
      const response = h.response({
        status: 'success',
        data: {
          playlists: result.rows,
        },
      });
      response.code(201);
    } catch (e) {
      throw OpenMusicErrorHandling(e.message, 404);
    }
  },

  async deletePlaylistHandler(req, h) {
    try {
      const { playlistId } = req.params;

      await pool.query(`DELETE FROM playlists WHERE id = '${playlistId}'`);
      const response = h.response({
        status: 'success',
        message: 'Playlist berhasil dihapus',
      });
      response.code(200);
    } catch (e) {
      throw OpenMusicErrorHandling(e.message, 404);
    }
  },
};

module.exports = handler;
