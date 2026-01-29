import logger from '../../infrastructure/logger/index.js';
import { AppError } from '../../utils/errors.js';
import mongoose from 'mongoose';

/**
 * Enhanced Error Handler Middleware
 * Handles all errors and returns standardized error responses
 */
const errorHandler = (err, req, res, next) => {
  // Set default values if not an AppError
  err.statusCode = err.statusCode || 500;
  err.errorCode = err.errorCode || 'INTERNAL_SERVER_ERROR';
  err.isOperational = err.isOperational || false;

  // Handle MongoDB errors
  if (err instanceof mongoose.Error.CastError) {
    err = new AppError(`Invalid ${err.path}: ${err.value}`, 400, 'BAD_REQUEST');
  }

  if (err instanceof mongoose.Error.ValidationError) {
    const errors = Object.values(err.errors).map(e => ({
      field: e.path,
      message: e.message
    }));
    err = new AppError('Validation failed', 422, 'VALIDATION_ERROR', errors);
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    err = new AppError(
      `${field} already exists`,
      409,
      'CONFLICT_ERROR',
      { field, value: err.keyValue[field] }
    );
  }

    // Handle Multer errors
    if (err.message === 'Unexpected field') {
      err = new AppError(
        'Unexpected file field. Use "attachment" as the field name',
        400,
        'INVALID_FILE_FIELD'
      );
    }
  
    if (err.code === 'LIMIT_FILE_SIZE') {
      err = new AppError(
        'File size exceeds the maximum limit of 10MB',
        400,
        'FILE_TOO_LARGE'
      );
    }
  
    if (err.message === 'INVALID_FILE_TYPE') {
      err = new AppError(
        'Invalid file type. Only images and PDF files are allowed',
        400,
        'INVALID_FILE_TYPE'
      );
    }

  // Log error
  logger.error({
    message: err.message,
    stack: err.stack,
    statusCode: err.statusCode,
    errorCode: err.errorCode,
    path: req.originalUrl,
    method: req.method,
    requestId: req.requestId
  });

  // Prepare error response
  const errorResponse = {
    success: false,
    error: {
      code: err.errorCode,
      message: err.message,
      ...(err.data && { details: err.data })
    },
    meta: {
      timestamp: new Date().toISOString(),
      requestId: req.requestId || null,
      path: req.originalUrl
    }
  };

  // Add stack trace in development
  if (process.env.NODE_ENV === 'development') {
    errorResponse.error.stack = err.stack;
  }

  res.status(err.statusCode).json(errorResponse);
};

export default errorHandler;