const { nanoid } = require('nanoid');
const pool = require('../../database');
const OpenMusicErrorHandling = require('../../exception/OpenMusicErrorHandling');
const { PostPlaylistSongPayloadSchema } = require('../../validator/playlistScheme');
const songHelper = require('../song/helper');

const handler = {
  async postPlaylistSongHandler(req, h) {
    try {
      const validationResult = PostPlaylistSongPayloadSchema.validate(req.payload);
      if (validationResult.error) {
        throw OpenMusicErrorHandling(validationResult.error.message, 400);
      }

      const { playlistId } = req.params;
      const { songId } = req.payload;
      const id = `playlistSong-${nanoid(16)}`;

      songHelper.validateSongById(songId);

      await pool.query(`INSERT INTO playlistsongs(id, playlist_id, song_id) VALUES('${id}', '${playlistId}', '${songId}')`);

      const response = h.response({
        status: 'success',
        message: 'Lagu berhasil ditambahkan ke playlist',
      });
      response.code(201);
      return response;
    } catch (e) {
      throw OpenMusicErrorHandling(e.message, 404);
    }
  },

  async getPlaylistSongHandler(req, h) {
    try {
      const { playlistId } = req.params;

      const result = await pool.query(`
      SELECT songs.id, songs.title, songs.performer
      FROM songs
      JOIN playlistsongs
      ON songs.id = playlistsongs.song_id AND playlistsongs.id = '${playlistId}'`);
      if (result.rows.length === 0) {
        throw OpenMusicErrorHandling('Lagu tidak ditemukan dalam playlist', 404);
      }
      const response = h.response({
        status: 'success',
        data: {
          songs: result.rows,
        },
      });
      response.code(200);
    } catch (e) {
      throw OpenMusicErrorHandling(e.message, 404);
    }
  },

  async deletePlaylistSongHandler(req, h) {
    try {
      const { playlistId } = req.params;
      const { songId } = req.payload;

      songHelper.validateSongById(songId);

      await pool.query(`DELETE FROM playlistsongs WHERE id = '${playlistId}' AND song_id = '${songId}'`);
      const response = h.response({
        status: 'success',
        message: 'Lagu berhasil dihapus dari playlist',
      });
      response.code(200);
    } catch (e) {
      throw OpenMusicErrorHandling(e.message, 404);
    }
  },
};

module.exports = handler;
