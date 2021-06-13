const fs = require('fs');
const path = require('path');

const uploadHelper = {
  folder: '',

  folderChecker() {
    const directory = path.resolve(__dirname, '../../../', 'assets');

    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }
    uploadHelper.folder = directory;
  },

  writeFile(file, meta) {
    const filename = `${+new Date()}-${meta.filename}`;
    const location = `${uploadHelper.folder}/${filename}`;

    const fileStream = fs.createWriteStream(location);

    return new Promise((resolve, reject) => {
      fileStream.on('error', (error) => reject(error));
      file.pipe(fileStream);
      file.on('end', () => resolve(filename));
    });
  },
};

module.exports = uploadHelper;
