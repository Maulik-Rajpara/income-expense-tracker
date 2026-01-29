import { UnauthorizedError, BadRequestError } from '../../../../utils/errors.js';
import JwtService from '../../../../utils/jwt.js';
import UserModel from '../../infrastructure/database/models/user.model.js';

/**
 * Login User Use Case
 * Handles user authentication with email/phone and password
 */
const loginUser = (userRepo) => async (data) => {
  const { identifier, password } = data; // identifier can be email or phone

  if (!identifier || !password) {
    throw new BadRequestError('Email/Phone and password are required');
  }

  // Find user by email or phone number (include password for comparison)
  const user = await UserModel.findOne({
    $or: [
      { email: identifier.toLowerCase() },
      { phoneNumber: identifier }
    ]
  }).select('+password');

  if (!user) {
    throw new UnauthorizedError('Invalid credentials');
  }

  // Check if account is active
  if (!user.isActive) {
    throw new UnauthorizedError('Your account has been deactivated. Please contact support.');
  }

  // Compare password
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new UnauthorizedError('Invalid credentials');
  }

  // Generate tokens
  const tokens = JwtService.generateTokens(user);

  // Update refresh token and last login
  await UserModel.findByIdAndUpdate(user._id, {
    refreshToken: tokens.refreshToken,
    lastLoginAt: new Date()
  });

  // Return user without sensitive data
  const userResponse = user.toPublicJSON();

  return {
    user: userResponse,
    ...tokens
  };
};

export default loginUser;
