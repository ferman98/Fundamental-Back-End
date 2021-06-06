/* eslint-disable quotes */
/* eslint-disable camelcase */

exports.up = (pgm) => {
  // CREATE TABLE SONG
  pgm.sql(`CREATE TABLE songs (
    id VARCHAR(50) NOT NULL ,
    title TEXT NOT NULL ,
    year INT NOT NULL ,
    performer TEXT NOT NULL ,
    genre TEXT NOT NULL ,
    duration INT NOT NULL ,
    date_insert TEXT NOT NULL ,
    date_update TEXT NOT NULL ,
    PRIMARY KEY (id))
    `);

  // CREATE TABLE USERS
  pgm.sql(`CREATE TABLE users (
    id VARCHAR(50) NOT NULL ,
    username VARCHAR(50) NOT NULL ,
    password TEXT NOT NULL ,
    fullname TEXT NOT NULL ,
    PRIMARY KEY (id))
    `);

  // CREATE TABLE AUTHENTICATIONS
  pgm.sql(`CREATE TABLE authentications (
    token TEXT NOT NULL )
    `);

  // CREATE TABLE PLAYLIST
  pgm.sql(`CREATE TABLE playlists (
    id VARCHAR(50) NOT NULL ,
    name TEXT NOT NULL ,
    owner VARCHAR(50) NOT NULL ,
    PRIMARY KEY (id))
    `);

  // CREATE TABLE PLAYLISTSONGS
  pgm.sql(`CREATE TABLE playlistsongs (
    id VARCHAR(50) NOT NULL ,
    playlist_id VARCHAR(50) NOT NULL ,
    song_id VARCHAR(50) NOT NULL ,
    PRIMARY KEY (id))
    `);

  // CREATE TABLE COLLABORATIONS
  pgm.sql(`CREATE TABLE collaborations (
    id VARCHAR(50) NOT NULL ,
    playlist_id VARCHAR(50) NOT NULL ,
    user_id VARCHAR(50) NOT NULL ,
    PRIMARY KEY (id))
    `);

  // RELASI USER DAN PLAYLISTS
  pgm.sql(`ALTER TABLE playlists ADD CONSTRAINT playlist_of_users FOREIGN KEY (owner) REFERENCES users(id) ON DELETE CASCADE ON UPDATE RESTRICT`);

  // RELASI PLAYLIST DAN PLAYLISTSSONG
  pgm.sql(`ALTER TABLE playlistsongs ADD CONSTRAINT playlistsong_of_playlist FOREIGN KEY (playlist_id) REFERENCES playlists(id) ON DELETE CASCADE ON UPDATE RESTRICT`);

  // RELASI SONG DAN PLAYLISTSSONG
  pgm.sql(`ALTER TABLE playlistsongs ADD CONSTRAINT song_in_playlistsongs FOREIGN KEY (song_id) REFERENCES songs(id) ON DELETE CASCADE ON UPDATE RESTRICT`);

  // RELASI COLLABORATION DAN USER
  pgm.sql(`ALTER TABLE collaborations ADD CONSTRAINT user_collab FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE RESTRICT`);

  // RELASI COLLABORATION DAN PLAYLIST
  pgm.sql(`ALTER TABLE collaborations ADD CONSTRAINT playlist_collab FOREIGN KEY (playlist_id) REFERENCES playlists(id) ON DELETE CASCADE ON UPDATE RESTRICT`);
};

exports.down = (pgm) => {
  pgm.sql("DROP TABLE collaborations, songs, users, authentications, playlistsongs, playlists");
};
