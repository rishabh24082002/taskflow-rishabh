const logger = require('../utils/logger');

const errorMiddleware = (err, req, res, next) => {
  logger.error({
    message: err.message,
    stack: err.stack,
    path: req.originalUrl,
    method: req.method,
  });

  if (err.isOperational) {
    return res.status(err.statusCode).json({
      error: err.message,
      ...(err.fields && { fields: err.fields }),
    });
  }

  return res.status(500).json({
    error: 'internal server error',
  });
};

module.exports = errorMiddleware;