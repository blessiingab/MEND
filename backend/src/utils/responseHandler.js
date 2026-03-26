const successResponse = (res, message, data = null, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

const errorResponse = (res, message, statusCode = 400, error = null) => {
  return res.status(statusCode).json({
    success: false,
    message,
    error: process.env.NODE_ENV === 'development' ? error : undefined
  });
};

const validationError = (res, errors) => {
  return res.status(422).json({
    success: false,
    message: 'Validation error',
    errors
  });
};

module.exports = {
  successResponse,
  errorResponse,
  validationError
};
