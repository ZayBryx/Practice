const CustomError = require("../Errors/custom-error");

const errorHandler = (err, req, res, next) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({
      error: {
        message: err.message,
        code: err.statusCode,
      },
    });
  }
  return res.status(500).json({
    error: {
      message: err.message,
      code: err.statusCode,
    },
  });
};

module.exports = errorHandler;
