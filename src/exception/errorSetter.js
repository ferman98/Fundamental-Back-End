const setError = {
  BadRequest(message = 'Bad Request') {
    const mainError = new Error(message);
    mainError.isBoom = true;
    mainError.output = {
      statusCode: 400,
      payload: {
        statusCode: '400 (Bad Request)',
        status: 'fail',
        message,
      },
      headers: {},
    };
    return mainError;
  },

  Unauthorized(message = 'Unauthorized') {
    const mainError = new Error(message);
    mainError.isBoom = true;
    mainError.output = {
      statusCode: 401,
      payload: {
        statusCode: '401 (Unauthorized)',
        status: 'fail',
        message,
      },
      headers: {},
    };
    return mainError;
  },

  Forbidden(message = 'Forbidden') {
    const mainError = new Error(message);
    mainError.isBoom = true;
    mainError.output = {
      statusCode: 403,
      payload: {
        statusCode: '403 (Forbidden)',
        status: 'fail',
        message,
      },
      headers: {},
    };
    return mainError;
  },

  NotFound(message = 'Not Found') {
    const mainError = new Error(message);
    mainError.isBoom = true;
    mainError.output = {
      statusCode: 404,
      payload: {
        statusCode: '404 (Not Found)',
        status: 'fail',
        message,
      },
      headers: {},
    };
    return mainError;
  },

  InternalServerError(message = 'Internal Server Error') {
    const mainError = new Error(message);
    mainError.isBoom = true;
    mainError.output = {
      statusCode: 500,
      payload: {
        statusCode: '500 (Internal Server Error)',
        status: 'fail',
        message,
      },
      headers: {},
    };
    return mainError;
  },
};

module.exports = setError;
