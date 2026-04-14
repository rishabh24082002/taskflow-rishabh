const pinoHttp = require('pino-http');

const loggerMiddleware = pinoHttp({
  level: 'info',
  customSuccessMessage: function (req, res) {
    return `${req.method} ${req.url} completed with ${res.statusCode}`;
  },
  customErrorMessage: function (req, res, err) {
    return `${req.method} ${req.url} errored with ${res.statusCode}`;
  },
});

module.exports = loggerMiddleware;