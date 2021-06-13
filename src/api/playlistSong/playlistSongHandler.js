const { nanoid } = require('nanoid');
const pool = require('../../database');
const tokenManager = require('../../tokenize/TokenManager');
const OpenMusicErrorHandling = require('../../exception/OpenMusicErrorHandling');
const setError = require('../../exception/errorSetter');
const { PostPlaylistSongPayloadSchema } = require('../../validator/playlistScheme');
const songHelper = require('../song/helper');
const playlistSongHelper = require('./helper');
const cacheServices = require('../../redis/cacheService');

const handler = {
  async postPlaylistSongHandler(req, h) {
    try {
      const validationResult = PostPlaylistSongPayloadSchema.validate(req.payload);
      if (validationResult.error) {
        throw setError.BadRequest(validationResult.error.message);
      }

      const { authorization } = req.headers;
      if (!authorization) {
        throw setError.Unauthorized('Token tidak ditemukan');
      }

      const token = authorization.replace(/^Bearer\s*/, '');
      const { playlistId } = req.params;
      const { songId } = req.payload;
      const id = `playlistSong-${nanoid(16)}`;
      const { id: owner } = tokenManager.verifyAccessToken(token);

      await playlistSongHelper.validateOwner(playlistId, owner);
      await songHelper.validateSongById(songId);

      const query = {
        text: 'INSERT INTO playlistsongs(id, playlist_id, song_id) VALUES($1, $2, $3)',
        values: [id, playlistId, songId],
      };
      await pool.query(query);

      cacheServices.init();
      cacheServices.delete(`playlistId:${playlistId}`);

      const response = h.response({
        status: 'success',
        message: 'Lagu berhasil ditambahkan ke playlist',
      });
      response.code(201);
      return response;
    } catch (e) {
      throw new OpenMusicErrorHandling(e.message, e);
    }
  },

  async getPlaylistSongHandler(req, h) {
    try {
      const { authorization } = req.headers;
      if (!authorization) {
        throw setError.Unauthorized('Token tidak ditemukan');
      }

      const token = authorization.replace(/^Bearer\s*/, '');
      const { id: owner } = tokenManager.verifyAccessToken(token);
      const { playlistId } = req.params;

      await playlistSongHelper.validateOwner(playlistId, owner);
      try {
        cacheServices.init();
        const result = await cacheServices.get(`playlistId:${playlistId}`);
        const songs = JSON.parse(result);
        const response = h.response({
          status: 'success',
          data: {
            songs,
          },
        });
        response.code(200);
        return response;
      } catch (e) {
        try {
          const query = {
            text: `SELECT songs.id, songs.title, songs.performer
            FROM songs
            JOIN playlistsongs
            ON songs.id = playlistsongs.song_id AND playlistsongs.playlist_id = $1`,
            values: [playlistId],
          };
          const result = await pool.query(query);
          if (result.rows.length === 0) {
            throw setError.Forbidden('Data Not Found');
          }
          cacheServices.init();
          cacheServices.set(`playlistId:${playlistId}`, JSON.stringify(result.rows));
          const response = h.response({
            status: 'success',
            data: {
              songs: result.rows,
            },
          });
          response.code(200);
          return response;
        } catch (er) {
          throw new OpenMusicErrorHandling(er.message, er);
        }
      }
    } catch (e) {
      throw new OpenMusicErrorHandling(e.message, e);
    }
  },

  async deletePlaylistSongHandler(req, h) {
    try {
      const { authorization } = req.headers;
      if (!authorization) {
        throw setError.Unauthorized('Token tidak ditemukan');
      }

      const token = authorization.replace(/^Bearer\s*/, '');
      const { playlistId } = req.params;
      const { songId } = req.payload;
      const { id: owner } = tokenManager.verifyAccessToken(token);

      await playlistSongHelper.validateOwner(playlistId, owner);
      await songHelper.validateSongById(songId);

      const query = {
        text: 'DELETE FROM playlistsongs WHERE playlist_id = $1 AND song_id = $2',
        values: [playlistId, songId],
      };
      await pool.query(query);

      cacheServices.init();
      cacheServices.delete(`playlistId:${playlistId}`);

      const response = h.response({
        status: 'success',
        message: 'Lagu berhasil dihapus dari playlist',
      });
      response.code(200);
      return response;
    } catch (e) {
      throw new OpenMusicErrorHandling(e.message, e);
    }
  },
};

module.exports = handler;
