const { nanoid } = require('nanoid');
const songSchema = require('../../validator/songSchema');
const pool = require('../../database');
const OpenMusicErrorHandling = require('../../exception/OpenMusicErrorHandling');
const songHelper = require('./helper');
const setError = require('../../exception/errorSetter');

const songHandler = {
  async getAllSongs(req, h) {
    try {
      const query = {
        text: 'SELECT id, title, performer FROM songs',
      };
      const result = await pool.query(query);
      const response = h.response({
        status: 'success',
        data: {
          songs: result.rows,
        },
      });
      response.code(200);
      return response;
    } catch (e) {
      throw new OpenMusicErrorHandling(e.message, e);
    }
  },

  async getSongById(req, h) {
    try {
      const { songId } = req.params;

      const query = {
        text: 'SELECT * FROM songs WHERE id = $1',
        values: [songId],
      };
      const result = await pool.query(query);
      if (result.rows.length === 0) {
        throw setError.NotFound('Data Not Found');
      }
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
      throw new OpenMusicErrorHandling(e.message, e);
    }
  },

  async addSong(req, h) {
    try {
      const validationResult = songSchema.validate(req.payload);
      if (validationResult.error) {
        throw setError.BadRequest(validationResult.error.message);
      }

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

      const query = {
        text: 'INSERT INTO songs(id, title, year, performer, genre, duration, date_insert, date_update) VALUES($1, $2, $3, $4, $5, $6, $7, $8)',
        values: [id, title, year, performer, genre, duration, insertedAt, updatedAt],
      };
      await pool.query(query);

      const response = h.response({
        status: 'success',
        message: 'Lagu berhasil ditambahkan',
        data: {
          songId: id,
        },
      });
      response.code(201);
      return response;
    } catch (e) {
      throw new OpenMusicErrorHandling(e.message, e);
    }
  },

  async updateSong(req, h) {
    try {
      const { songId } = req.params;
      const validationResult = songSchema.validate(req.payload);
      if (validationResult.error) {
        throw setError.BadRequest(validationResult.error.message);
      }
      await songHelper.checkSongInDB(songId);
      const updatedAt = new Date().toISOString();
      const {
        title,
        year,
        performer,
        genre,
        duration,
      } = req.payload;

      const query = {
        text: 'UPDATE songs SET title = $1, year = $2, performer = $3, genre = $4, duration = $5, date_update = $6 WHERE id = $7',
        values: [title, year, performer, genre, duration, updatedAt, songId],
      };
      await pool.query(query);

      const response = h.response({
        status: 'success',
        message: 'lagu berhasil diperbarui',
      });
      response.code(200);
      return response;
    } catch (e) {
      throw new OpenMusicErrorHandling(e.message, e);
    }
  },

  async deleteSong(req, h) {
    try {
      const { songId } = req.params;
      await songHelper.checkSongInDB(songId);
      const query = {
        text: 'DELETE FROM songs WHERE id = $1',
        values: [songId],
      };
      await pool.query(query);
      const response = h.response({
        status: 'success',
        message: 'lagu berhasil dihapus',
      });
      response.code(200);
      return response;
    } catch (e) {
      throw new OpenMusicErrorHandling(e.message, e);
    }
  },
};

module.exports = songHandler;
