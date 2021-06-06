class OpenMusicErrorHandling extends Error {
  constructor(message, error) {
    const { statusCode, payload } = error.output;
    super(message);
    this.isBoom = true;
    this.output = {
      statusCode,
      payload: {
        statusCode: payload.statusCode,
        status: payload.status,
        message: payload.message,
      },
      headers: {},
    };
  }
}

module.exports = OpenMusicErrorHandling;
