/**
 * Async Handler Wrapper
 * Automatically catches errors from async route handlers
 * Prevents need for try-catch in every controller
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export default asyncHandler;

