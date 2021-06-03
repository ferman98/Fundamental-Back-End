const songSchema = require('./schema');

const songValidator = {
  validateSong(payload) {
    const validationResult = songSchema.validate(payload);
    return validationResult;
  },
};

module.exports = songValidator;
