const tokenManager = require('../../tokenize/TokenManager');
const OpenMusicErrorHandling = require('../../exception/OpenMusicErrorHandling');
const setError = require('../../exception/errorSetter');
const exportPlaylistSchema = require('../../validator/exportPlaylistScheme');
const ProducerService = require('../../rabbitmq/ProducerService');
const playlistHelper = require('../playlist/helper');

const handler = {
  async postExportPlaylistHandler(req, h) {
    try {
      const { authorization } = req.headers;
      if (!authorization) {
        throw setError.Unauthorized('Token tidak ditemukan');
      }

      const validationResult = exportPlaylistSchema.validate(req.payload);
      if (validationResult.error) {
        throw setError.BadRequest(validationResult.error.message);
      }

      const token = authorization.replace(/^Bearer\s*/, '');
      const { id: owner } = tokenManager.verifyAccessToken(token);
      const { targetEmail } = req.payload;
      const { playlistId } = req.params;

      await playlistHelper.validatePlaylistByIdAndOwner(playlistId, owner);
      const message = {
        playlistId,
        targetEmail,
      };
      await ProducerService.sendMessage('export:song-list', JSON.stringify(message));

      const response = h.response({
        status: 'success',
        message: 'Permintaan Anda sedang kami proses',
      });
      response.code(201);
      return response;
    } catch (e) {
      throw new OpenMusicErrorHandling(e.message, e);
    }
  },
};

module.exports = handler;
