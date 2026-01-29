import { UnauthorizedError } from '../../../../utils/errors.js';
import JwtService from '../../../../utils/jwt.js';
import UserModel from '../../infrastructure/database/models/user.model.js';

/**
 * Refresh Token Use Case
 * Generates new access token using refresh token
 */
const refreshToken = (userRepo) => async (refreshTokenValue) => {
  if (!refreshTokenValue) {
    throw new UnauthorizedError('Refresh token is required');
  }

  // Verify refresh token
  let decoded;
  try {
    decoded = JwtService.verifyRefreshToken(refreshTokenValue);
  } catch (error) {
    throw new UnauthorizedError('Invalid or expired refresh token');
  }

  // Find user and check if refresh token matches
  const user = await UserModel.findById(decoded.userId).select('+refreshToken');
  
  if (!user) {
    throw new UnauthorizedError('User not found');
  }

  if (!user.isActive) {
    throw new UnauthorizedError('User account is deactivated');
  }

  if (user.refreshToken !== refreshTokenValue) {
    throw new UnauthorizedError('Invalid refresh token');
  }

  // Generate new tokens
  const tokens = JwtService.generateTokens(user);

  // Update refresh token in database
  await userRepo.updateRefreshToken(user._id, tokens.refreshToken);

  return {
    ...tokens,
    user: user.toPublicJSON()
  };
};

export default refreshToken;
