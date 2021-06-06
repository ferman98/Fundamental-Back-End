const pool = require('../../database');
const setError = require('../../exception/errorSetter');
const collaborationsHelper = require('../collaboration/helper');

const playlistHelper = {
  async getPlaylistDataWithValidate(owner) {
    try {
      await playlistHelper.validatePlaylistByUserId(owner);
      const result = await playlistHelper.getPlaylistDataBaseOnUser(owner);
      return result;
    } catch (e) {
      await collaborationsHelper.validateColaborationByID(owner);
      const result = await playlistHelper.getPlaylistDataBaseOnCollaboration(owner);
      return result;
    }
  },
  async getPlaylistDataBaseOnUser(owner) {
    const query = {
      text: `
        SELECT playlists.id, playlists.name, users.username
        FROM playlists
        JOIN users
        ON playlists.owner = users.id AND playlists.owner = $1`,
      values: [owner],
    };
    const result = await pool.query(query);
    return result;
  },

  async getPlaylistDataBaseOnCollaboration(owner) {
    const query = {
      text: `
        SELECT playlists.id, playlists.name, users.username
        FROM playlists
        JOIN collaborations ON playlists.id = collaborations.playlist_id
        JOIN users ON playlists.owner = users.id
        AND collaborations.user_id = $1`,
      values: [owner],
    };
    const result = await pool.query(query);
    return result;
  },

  async validatePlaylistByUserId(userId) {
    const query = {
      text: 'SELECT * FROM playlists WHERE owner = $1',
      values: [userId],
    };
    const result = await pool.query(query);
    if (result.rows.length === 0) {
      throw setError.Forbidden('Your request rejected when validate');
    }
  },

  async validatePlaylistByPlaylistIdAndUserId(playlistId, userId) {
    const query = {
      text: 'SELECT * FROM playlists WHERE id = $1 AND owner = $2',
      values: [playlistId, userId],
    };
    const result = await pool.query(query);
    if (result.rows.length === 0) {
      throw setError.Forbidden('Your request rejected when validate');
    }
  },

  async deletPlaylistWithValidate(playlistId, owner) {
    try {
      await playlistHelper.validatePlaylistByUserId(owner);
      // await playlistHelper.deleteByUserId(playlistId, owner);
    } catch (e) {
      await collaborationsHelper.validateColaborationByID(owner);
      // await playlistHelper.deleteWithColaboration(playlistId, owner);
    }
  },

  async deleteByUserId(playlistId, owner) {
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 AND owner = $2',
      values: [playlistId, owner],
    };
    await pool.query(query);
  },

  async deleteWithColaboration(playlistId, owner) {
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
  },
};

module.exports = playlistHelper;
