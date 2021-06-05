const { nanoid } = require('nanoid');
const songSchema = require('../../validator/songSchema');
const pool = require('../../database');
const OpenMusicErrorHandling = require('../../exception/OpenMusicErrorHandling');
const songHelper = require('./helper');

const songHandler = {
  async getAllSongs(req, h) {
    try {
      const result = await pool.query('SELECT id, title, performer FROM songs');
      const response = h.response({
        status: 'success',
        data: {
          songs: result.rows,
        },
      });
      response.code(200);
      return response;
    } catch (e) {
      throw OpenMusicErrorHandling(e.message, 404);
    }
  },

  async getSongById(req, h) {
    const { songId } = req.params;

    const result = await pool.query(`SELECT * FROM songs WHERE id = '${songId}'`);
    if (result.rows.length === 0) {
      throw OpenMusicErrorHandling('Data Not Found', 404);
    }
    try {
      const {
        // eslint-disable-next-line camelcase
        id, title, year, performer, genre, duration, date_insert, date_update,
      } = result.rows[0];

      const response = h.response({
        status: 'success',
        data: {
          song: {
            id,
            title,
            year,
            performer,
            genre,
            duration,
            insertedAt: date_insert,
            updatedAt: date_update,
          },
        },
      });
      response.code(200);
      return response;
    } catch (e) {
      throw OpenMusicErrorHandling(e.message, 404);
    }
  },

  async addSong(req, h) {
    const validationResult = songSchema.validate(req.payload);
    if (validationResult.error) {
      throw OpenMusicErrorHandling(validationResult.error.message, 400);
    }

    try {
      const id = `song-${nanoid(16)}`;
      const insertedAt = new Date().toISOString();
      const updatedAt = new Date().toISOString();
      const {
        title,
        year,
        performer,
        genre,
        duration,
      } = req.payload;

      const result = await pool.query(`INSERT INTO songs(id, title, year, performer, genre, duration, date_insert, date_update) VALUES('${id}', '${title}', '${year}', '${performer}', '${genre}', '${duration}', '${insertedAt}', '${updatedAt}') RETURNING id`);

      const response = h.response({
        status: 'success',
        message: 'Lagu berhasil ditambahkan',
        data: {
          songId: result.rows[0].id,
        },
      });
      response.code(201);
      return response;
    } catch (e) {
      throw OpenMusicErrorHandling(e.message, 404);
    }
  },

  async updateSong(req, h) {
    const { songId } = req.params;
    const validationResult = songSchema.validate(req.payload);
    if (validationResult.error) {
      throw OpenMusicErrorHandling(validationResult.error.message, 400);
    }
    songHelper.validateSongById(songId);
    try {
      const updatedAt = new Date().toISOString();
      const {
        title,
        year,
        performer,
        genre,
        duration,
      } = req.payload;

      await pool.query(`UPDATE songs SET title = '${title}', year = '${year}', performer = '${performer}', genre = '${genre}', duration = '${duration}', date_update = '${updatedAt}' WHERE id = '${songId}'`);

      const response = h.response({
        status: 'success',
        message: 'lagu berhasil diperbarui',
      });
      response.code(200);
      return response;
    } catch (e) {
      throw OpenMusicErrorHandling(e.message, 404);
    }
  },

  async deleteSong(req, h) {
    const { songId } = req.params;
    songHelper.validateSongById(songId);
    try {
      await pool.query(`DELETE FROM songs WHERE id = '${songId}' RETURNING id`);
      const response = h.response({
        status: 'success',
        message: 'lagu berhasil dihapus',
      });
      response.code(200);
      return response;
    } catch (e) {
      throw OpenMusicErrorHandling(e.message, 404);
    }
  },
};

module.exports = songHandler;
