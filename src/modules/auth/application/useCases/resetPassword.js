import bcrypt from 'bcryptjs';
import { BadRequestError, UnauthorizedError } from '../../../../utils/errors.js';
import JwtService from '../../../../utils/jwt.js';

/**
 * Reset Password Use Case
 * Resets password using the reset token
 */
const resetPassword = (userRepo) => async (data) => {
  const { token, newPassword } = data;

  if (!token || !newPassword) {
    throw new BadRequestError('Reset token and new password are required');
  }

  // Hash the provided token to compare with stored hash
  const hashedToken = JwtService.hashResetToken(token);

  // Find user by reset token and check if not expired
  const user = await userRepo.findByPasswordResetToken(hashedToken);

  if (!user) {
    throw new UnauthorizedError('Invalid or expired reset token');
  }

  // Hash new password
  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  // Update password and clear reset token
  await userRepo.updatePassword(user._id, hashedPassword);
  await userRepo.clearPasswordResetToken(user._id);

  // Invalidate all refresh tokens (optional - for security)
  await userRepo.updateRefreshToken(user._id, null);

  return { message: 'Password reset successfully. Please login with your new password.' };
};

export default resetPassword;
