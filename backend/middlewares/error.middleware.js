const errorMiddleware = (err, req, res, next) => {
  const statusCode = res.statusCode ? res.statusCode : 500;

  const errorTitles = {
    400: "Bad Request",
    401: "Unauthorized",
    403: "Forbidden",
    404: "Not Found",
    500: "Server Error",
  }

  res.status(statusCode)
    .json({ title: errorTitles[statusCode] || "Unknown Error", msg: err.message, stack: err.stack });
};

export default errorMiddleware;