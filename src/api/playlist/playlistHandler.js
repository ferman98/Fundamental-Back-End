const { nanoid } = require('nanoid');
const tokenManager = require('../../tokenize/TokenManager');
const pool = require('../../database');
const { PostPlaylistPayloadSchema } = require('../../validator/playlistScheme');
const OpenMusicErrorHandling = require('../../exception/OpenMusicErrorHandling');
const setError = require('../../exception/errorSetter');
const playlistHelper = require('./helper');

const handler = {
  async postPlaylistHandler(req, h) {
    try {
      const validationResult = PostPlaylistPayloadSchema.validate(req.payload);
      if (validationResult.error) {
        throw setError.BadRequest(validationResult.error.message);
      }

      const { authorization } = req.headers;
      if (!authorization) {
        throw setError.Unauthorized('Token tidak ditemukan');
      }

      const token = authorization.replace(/^Bearer\s*/, '');
      const playlistId = `playlist-${nanoid(16)}`;
      const { name } = req.payload;
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
      throw new OpenMusicErrorHandling(e.message, e);
    }
  },

  async getPlaylistHandler(req, h) {
    try {
      const { authorization } = req.headers;
      if (!authorization) {
        throw setError.Unauthorized('Token tidak ditemukan');
      }

      const token = authorization.replace(/^Bearer\s*/, '');
      const { id: owner } = tokenManager.verifyAccessToken(token);

      const result = await playlistHelper.getPlaylistDataWithValidate(owner);
      const { length } = result.rows;
      if (length === 0) {
        throw setError.NotFound('Data Not Found');
      }
      const response = h.response({
        status: 'success',
        data: {
          playlists: result.rows,
        },
      });
      response.code(200);
      return response;
    } catch (e) {
      throw new OpenMusicErrorHandling(e.message, e);
    }
  },

  async deletePlaylistHandler(req, h) {
    try {
      const { authorization } = req.headers;
      if (!authorization) {
        throw setError.Unauthorized('Token tidak ditemukan');
      }

      const token = authorization.replace(/^Bearer\s*/, '');
      const { playlistId } = req.params;
      const { id: owner } = tokenManager.verifyAccessToken(token);

      console.log(playlistId);
      console.log(owner);
      // await playlistHelper.validatePlaylistByPlaylistIdAndUserId(playlistId, owner);
      await playlistHelper.deletPlaylistWithValidate(playlistId, owner);
      // await playlistHelper.deleteWithColaboration(playlistId, owner);
      const query = {
        text: `DELETE FROM playlists WHERE id = $1 AND owner = (
          SELECT users.id
          FROM playlists
          JOIN collaborations ON playlists.id = collaborations.playlist_id
          JOIN users ON playlists.owner = users.id
          AND collaborations.user_id = $2
        ) OR owner = $2`,
        values: [playlistId, owner],
      };
      await pool.query(query);
      const response = h.response({
        status: 'success',
        message: 'Playlist berhasil dihapus',
      });
      response.code(200);
      return response;
    } catch (e) {
      throw new OpenMusicErrorHandling(e.message, e);
    }
  },
};

module.exports = handler;
