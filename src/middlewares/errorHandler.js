const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Default error
  let statusCode = 500;
  let message = 'Error interno del servidor';
  let errors = null;

  // Handle specific error types
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Error de validación';
    errors = Object.values(err.errors).map(error => error.message);
  } else if (err.name === 'UnauthorizedError') {
    statusCode = 401;
    message = 'No autorizado';
  } else if (err.name === 'ForbiddenError') {
    statusCode = 403;
    message = 'Acceso denegado';
  } else if (err.name === 'NotFoundError') {
    statusCode = 404;
    message = 'Recurso no encontrado';
  } else if (err.code === 'ER_DUP_ENTRY') {
    statusCode = 409;
    message = 'El registro ya existe';
  }

  // Send error response
  res.status(statusCode).json({
    success: false,
    message,
    errors,
    // Include stack trace only in development
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

// Custom error classes
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}

class UnauthorizedError extends Error {
  constructor(message = 'No autorizado') {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

class ForbiddenError extends Error {
  constructor(message = 'Acceso denegado') {
    super(message);
    this.name = 'ForbiddenError';
  }
}

class NotFoundError extends Error {
  constructor(message = 'Recurso no encontrado') {
    super(message);
    this.name = 'NotFoundError';
  }
}

module.exports = {
  errorHandler,
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError
};
