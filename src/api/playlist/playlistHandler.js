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

      const query = {
        text: 'INSERT INTO playlists(id, name, owner) VALUES($1, $2, $3)',
        values: [playlistId, name, owner],
      };
      await pool.query(query);

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

      const query = {
        text: `
        SELECT playlists.id, playlists.name, users.username
        FROM playlists
        JOIN users
        ON playlist.owner = users.id AND playlist = $1`,
        values: [owner],
      };
      const result = await pool.query(query);
      if (result.rows.length === 0) {
        throw OpenMusicErrorHandling('Data Not Found', 404);
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
      const { authorization } = req.headers;
      const token = authorization.replace(/^Bearer\s*/, '');
      const { owner } = tokenManager.verifyAccessToken(token);

      const query = {
        text: 'DELETE FROM playlists WHERE id = $1 AND owner = $2',
        values: [playlistId, owner],
      };
      await pool.query(query);
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
