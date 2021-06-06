const Jwt = require('@hapi/jwt');
const OpenMusicErrorHandling = require('../exception/OpenMusicErrorHandling');

const TokenManager = {
  generateAccessToken: (payload) => Jwt.token.generate(payload, process.env.ACCESS_TOKEN_KEY),
  generateRefreshToken: (payload) => Jwt.token.generate(payload, process.env.REFRESH_TOKEN_KEY),
  verifyAccessToken: (accessToken) => {
    try {
      const artifacts = Jwt.token.decode(accessToken);
      Jwt.token.verifySignature(artifacts, process.env.ACCESS_TOKEN_KEY);
      const { payload } = artifacts.decoded;
      return payload;
    } catch (e) {
      throw OpenMusicErrorHandling('Access token tidak valid', 400);
    }
  },
  verifyRefreshToken: (refreshToken) => {
    try {
      const artifacts = Jwt.token.decode(refreshToken);
      Jwt.token.verifySignature(artifacts, process.env.REFRESH_TOKEN_KEY);
      const { payload } = artifacts.decoded;
      return payload;
    } catch (e) {
      throw OpenMusicErrorHandling('Refresh token tidak valid', 400);
    }
  },
};

module.exports = TokenManager;
