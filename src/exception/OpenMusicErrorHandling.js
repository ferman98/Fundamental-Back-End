const errorCode = {
  400: 'Bad Request',
  404: 'Not Found',
  500: 'Internal Server Error',
};

const OpenMusicErrorHandling = (msg, code) => {
  const statusCode = code || 500;
  const error = errorCode[statusCode] || 'Error';
  const message = msg || errorCode[statusCode];

  const mainError = new Error(message);
  mainError.isBoom = true;
  mainError.output = {
    statusCode,
    payload: {
      statusCode: `${statusCode} (${error})`,
      status: 'fail',
      message,
    },
    headers: {},
  };

  return mainError;
};

module.exports = OpenMusicErrorHandling;
