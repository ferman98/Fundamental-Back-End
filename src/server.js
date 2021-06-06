require('dotenv').config();

const Hapi = require('@hapi/hapi');
const authPlugin = require('./plugin/authentications');
const songPlugin = require('./plugin/song');
const userPlugin = require('./plugin/users');
const playlistPlugin = require('./plugin/playlist');
const playlistSongPlugin = require('./plugin/playlistSong');
const collaborationPlugin = require('./plugin/collaboration');

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register([
    {
      plugin: authPlugin,
      options: {},
    },
    {
      plugin: songPlugin,
      options: {},
    },
    {
      plugin: userPlugin,
      options: {},
    },
    {
      plugin: playlistPlugin,
      options: {},
    },
    {
      plugin: playlistSongPlugin,
      options: {},
    },
    {
      plugin: collaborationPlugin,
      options: {},
    },
  ]);

  server.ext('onPreResponse', (request) => {
    let { response } = request;
    if (request.response.isBoom && response.output.payload.statusCode === 500) {
      const { error, statusCode, message } = response.output.payload;
      response = {
        statusCode: `${statusCode} (${error})`,
        status: 'fail',
        message,
      };
    }
    return response;
  });

  await server.start();
  // eslint-disable-next-line no-console
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
