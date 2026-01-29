/**
 * Request ID Middleware
 * Generates and attaches a unique request ID to each request
 * Useful for tracing requests across services and logs
 */
import crypto from 'crypto';

/**
 * Generate a unique request ID
 */
const generateRequestId = () => {
  // Use crypto.randomUUID() if available (Node.js 14.17.0+)
  if (crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for older Node.js versions
  return crypto.randomBytes(16).toString('hex');
};

const requestIdMiddleware = (req, res, next) => {
  // Get request ID from header or generate new one
  req.requestId = req.headers['x-request-id'] || generateRequestId();
  
  // Attach to response locals for use in response formatter
  res.locals.requestId = req.requestId;
  
  // Add to response headers
  res.setHeader('X-Request-ID', req.requestId);
  
  next();
};

export default requestIdMiddleware;
