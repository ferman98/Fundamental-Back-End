const redis = require('redis');

const cacheServices = {
  client: redis.createClient({
    host: process.env.REDIS_SERVER,
  }),

  init() {
    cacheServices.client.on('error', (error) => {
      throw error;
    });
  },

  set(key, value, expirationInSecond = 3600) {
    const { client } = cacheServices;
    return new Promise((resolve, reject) => {
      client.set(key, value, 'EX', expirationInSecond, (error, ok) => {
        if (error) {
          return reject(error);
        }
        return resolve(ok);
      });
    });
  },

  get(key) {
    return new Promise((resolve, reject) => {
      const { client } = cacheServices;
      client.get(key, (error, reply) => {
        if (error) {
          return reject(error);
        }
        if (reply === null) {
          return reject(new Error('Cache tidak ditemukan'));
        }
        return resolve(reply.toString());
      });
    });
  },

  delete(key) {
    return new Promise((resolve, reject) => {
      const { client } = cacheServices;
      client.del(key, (error, count) => {
        if (error) {
          return reject(error);
        }
        return resolve(count);
      });
    });
  },
};

module.exports = cacheServices;
