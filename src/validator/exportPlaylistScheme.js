const Joi = require('joi');

const exportPlaylistSchema = Joi.object({
  targetEmail: Joi.string().email({ tlds: true }).required(),
});

module.exports = exportPlaylistSchema;
