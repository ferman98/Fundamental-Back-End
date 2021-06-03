require('dotenv').config();

const Hapi = require('@hapi/hapi');
const routerPlugin = require('./services/plugin');

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

  await server.register({
    plugin: routerPlugin,
    options: {},
  });

  server.ext('onPreResponse', (request) => {
    const { response } = request;
    if (request.response.isBoom && response.output.payload.statusCode === 500) {
      const { error, statusCode, message } = response.output.payload;
      return {
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
