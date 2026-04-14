class AppError extends Error {
  constructor(message, statusCode = 500, fields = null) {
    super(message);

    this.statusCode = statusCode;
    this.fields = fields;

    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;