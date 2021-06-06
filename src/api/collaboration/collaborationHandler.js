const { nanoid } = require('nanoid');
const pool = require('../../database');
const tokenManager = require('../../tokenize/TokenManager');
const CollaborationSchema = require('../../validator/collaborationScheme');
const OpenMusicErrorHandling = require('../../exception/OpenMusicErrorHandling');
const setError = require('../../exception/errorSetter');
const playlistHelper = require('../playlist/helper');
const playlistSongHelper = require('../playlistSong/helper');

const handler = {
  async postCollaborationsHandler(req, h) {
    try {
      const validationResult = CollaborationSchema.validate(req.payload);
      if (validationResult.error) {
        throw setError.BadRequest(validationResult.error.message);
      }
      const { authorization } = req.headers;
      if (!authorization) {
        throw setError.Unauthorized('Token tidak ditemukan');
      }

      const token = authorization.replace(/^Bearer\s*/, '');
      const collaborationId = `collab-${nanoid(16)}`;
      const { playlistId, userId } = req.payload;
      const { id: owner } = tokenManager.verifyAccessToken(token);

      await playlistSongHelper.validateOwner(playlistId, owner);
      await playlistHelper.validatePlaylistByUserId(owner);

      const query = {
        text: 'INSERT INTO collaborations(id, playlist_id, user_id) VALUES($1, $2, $3)',
        values: [collaborationId, playlistId, userId],
      };
      await pool.query(query);

      const response = h.response({
        status: 'success',
        message: 'Kolaborasi berhasil ditambahkan',
        data: {
          collaborationId,
        },
      });
      response.code(201);
      return response;
    } catch (e) {
      throw new OpenMusicErrorHandling(e.message, e);
    }
  },

  async deleteCollaborationsHandler(req, h) {
    try {
      const validationResult = CollaborationSchema.validate(req.payload);
      if (validationResult.error) {
        throw setError.BadRequest(validationResult.error.message);
      }

      const { playlistId, userId } = req.payload;
      await playlistHelper.validatePlaylistByUserId(userId);

      const query = {
        text: 'DELETE FROM playlists WHERE id = $1 AND user_id = $2',
        values: [playlistId, userId],
      };
      await pool.query(query);
      const response = h.response({
        status: 'success',
        message: 'Kolaborasi berhasil dihapus',
      });
      response.code(200);
      return response;
    } catch (e) {
      throw new OpenMusicErrorHandling(e.message, e);
    }
  },
};

module.exports = handler;
