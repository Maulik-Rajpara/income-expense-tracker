/**
 * Authentication Middleware
 * Verifies JWT tokens and protects routes
 */
import JwtService from '../../utils/jwt.js';
import { UnauthorizedError } from '../../utils/errors.js';
import UserModel from '../../modules/auth/infrastructure/database/models/user.model.js';

/**
 * Middleware to authenticate requests using JWT
 * Adds user object to req.user
 */
const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    const token = JwtService.extractTokenFromHeader(authHeader);

    if (!token) {
      throw new UnauthorizedError('Access token is required');
    }

    // Verify token
    const decoded = JwtService.verifyAccessToken(token);

    // Get user from database
    const user = await UserModel.findById(decoded.userId).select('-password -refreshToken');

    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    if (!user.isActive) {
      throw new UnauthorizedError('User account is deactivated');
    }

    // Attach user to request
    req.user = user;
    req.userId = user._id;

    next();
  } catch (error) {
    if (error.message === 'Access token has expired') {
      return next(new UnauthorizedError('Access token has expired. Please refresh your token.'));
    }
    if (error.message === 'Invalid access token') {
      return next(new UnauthorizedError('Invalid access token'));
    }
    next(error);
  }
};

/**
 * Optional authentication middleware
 * Attaches user if token present, but doesn't fail if not
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = JwtService.extractTokenFromHeader(authHeader);

    if (token) {
      const decoded = JwtService.verifyAccessToken(token);
      const user = await UserModel.findById(decoded.userId).select('-password -refreshToken');
      
      if (user && user.isActive) {
        req.user = user;
        req.userId = user._id;
      }
    }

    next();
  } catch (error) {
    // Silently fail for optional auth - just don't attach user
    next();
  }
};

export { authenticate, optionalAuth };
