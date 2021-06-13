const uploadHelper = require('./helper');
const OpenMusicErrorHandling = require('../../exception/OpenMusicErrorHandling');
const setError = require('../../exception/errorSetter');
const ImageHeadersSchema = require('../../validator/uploadScheme');

const handler = {
  async postUploadImageHandler(req, h) {
    try {
      const { data } = req.payload;

      const validationResult = ImageHeadersSchema.validate(data.hapi.headers);
      if (validationResult.error) {
        throw setError.BadRequest(validationResult.error.message);
      }

      uploadHelper.folderChecker();
      const filename = await uploadHelper.writeFile(data, data.hapi);

      const response = h.response({
        status: 'success',
        message: 'Gambar berhasil diunggah',
        data: {
          fileLocation: `http://${process.env.HOST}:${process.env.PORT}/assets/${filename}`,
        },
      });
      response.code(201);
      return response;
    } catch (e) {
      throw new OpenMusicErrorHandling(e.message, e);
    }
  },
};

module.exports = handler;
