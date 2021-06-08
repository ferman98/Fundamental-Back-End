const pool = require('../../database');
const setError = require('../../exception/errorSetter');

const playlistHelper = {
  async getPlaylistDataWithValidate(owner) {
    try {
      await playlistHelper.validatePlaylistByUserId(owner);
      const result = await playlistHelper.getPlaylistDataBaseOnUser(owner);
      return result;
    } catch (e) {
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
      SELECT collaborations.playlist_id AS id, playlists.name, users.username
      FROM playlists
      JOIN collaborations ON playlists.id = collaborations.playlist_id
      JOIN users ON playlists.owner = users.id
      WHERE collaborations.user_id = $1 OR playlists.owner = $1`,
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

  async validatePlaylistByIdAndOwner(id, owner) {
    const query = {
      text: 'SELECT * FROM playlists WHERE id = $1 AND owner = $2',
      values: [id, owner],
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
};

module.exports = playlistHelper;
