const errorMiddleware = (err, req, res, next) => {
  try {
    let error = { ...err };
    error.message = err.message;
    console.error(err);

    // Mongoose bad ObjectId
    if (err.name === "CastError") {
      const msg = "Resource not found.";
      error = new Error(msg);
      error.status = 404;
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
      const msg = "Duplicate field value entered."
      error = new Error(msg);
      error.status = 400;
    }

    // Mongoose validation key
    if (err.name === "validationError") {
      const msg = Object.values(err.errors).map(val => val.message);
      error = new Error(msg.join(', '));
      error.status = 400;
    }

    res.status(error.status || 500).json({ success: false, error: error.message || "Server Error" });
  } catch (error) {
    next(error);
  }
};

export default errorMiddleware;