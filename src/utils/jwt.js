/**
 * JWT Utility
 * Handles token generation and verification
 */
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import config from '../config/index.js';

class JwtService {
  /**
   * Generate access token
   * @param {Object} payload - Data to encode in token
   * @returns {string} JWT token
   */
  static generateAccessToken(payload) {
    return jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.accessExpiresIn || '60m'
    });
  }

  /**
   * Generate refresh token
   * @param {Object} payload - Data to encode in token
   * @returns {string} JWT refresh token
   */
  static generateRefreshToken(payload) {
    return jwt.sign(payload, config.jwt.refreshSecret || config.jwt.secret, {
      expiresIn: config.jwt.refreshExpiresIn || '7d'
    });
  }

  /**
   * Generate both access and refresh tokens
   * @param {Object} user - User object
   * @returns {Object} { accessToken, refreshToken }
   */
  static generateTokens(user) {
    const payload = {
      userId: user._id || user.id,
      email: user.email
    };

    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload)
    };
  }

  /**
   * Verify access token
   * @param {string} token - JWT token
   * @returns {Object} Decoded token payload
   */
  static verifyAccessToken(token) {
    try {
      return jwt.verify(token, config.jwt.secret);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new Error('Access token has expired');
      }
      if (error.name === 'JsonWebTokenError') {
        throw new Error('Invalid access token');
      }
      throw error;
    }
  }

  /**
   * Verify refresh token
   * @param {string} token - JWT refresh token
   * @returns {Object} Decoded token payload
   */
  static verifyRefreshToken(token) {
    try {
      return jwt.verify(token, config.jwt.refreshSecret || config.jwt.secret);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new Error('Refresh token has expired');
      }
      if (error.name === 'JsonWebTokenError') {
        throw new Error('Invalid refresh token');
      }
      throw error;
    }
  }

  /**
   * Generate password reset token
   * @returns {Object} { resetToken, hashedToken, expiresAt }
   */
  static generatePasswordResetToken() {
    // Generate random token
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    // Hash token for storage
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    
    // Token expires in 1 hour
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    return {
      resetToken,      // Send this to user via email
      hashedToken,     // Store this in database
      expiresAt        // Store expiry time in database
    };
  }

  /**
   * Hash a reset token for comparison
   * @param {string} token - Plain reset token
   * @returns {string} Hashed token
   */
  static hashResetToken(token) {
    return crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');
  }

  /**
   * Extract token from Authorization header
   * @param {string} authHeader - Authorization header value
   * @returns {string|null} Token or null
   */
  static extractTokenFromHeader(authHeader) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    return authHeader.split(' ')[1];
  }
}

export default JwtService;
