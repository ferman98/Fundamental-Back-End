const { nanoid } = require('nanoid');
const pool = require('../../database');
const CollaborationSchema = require('../../validator/collaborationScheme');
const OpenMusicErrorHandling = require('../../exception/OpenMusicErrorHandling');
const playlistHelper = require('../playlist/helper');

const handler = {
  async postCollaborationsHandler(req, h) {
    try {
      const validationResult = CollaborationSchema.validate(req.payload);
      if (validationResult.error) {
        throw OpenMusicErrorHandling(validationResult.error.message, 400);
      }

      const collaborationId = `collab-${nanoid(16)}`;
      const { playlistId, userId } = req.payload;

      playlistHelper.validatePlaylistByUserId(userId);

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
      throw OpenMusicErrorHandling(e.message, 404);
    }
  },

  async deleteCollaborationsHandler(req, h) {
    try {
      const validationResult = CollaborationSchema.validate(req.payload);
      if (validationResult.error) {
        throw OpenMusicErrorHandling(validationResult.error.message, 400);
      }
      const { playlistId, userId } = req.payload;

      playlistHelper.validatePlaylistByUserId(userId);

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
    } catch (e) {
      throw OpenMusicErrorHandling(e.message, 404);
    }
  },
};

module.exports = handler;
