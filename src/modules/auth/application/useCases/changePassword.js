import bcrypt from 'bcryptjs';
import { UnauthorizedError, BadRequestError } from '../../../../utils/errors.js';
import UserModel from '../../infrastructure/database/models/user.model.js';

/**
 * Change Password Use Case
 * Allows authenticated user to change their password
 */
const changePassword = (userRepo) => async (userId, data) => {
  const { currentPassword, newPassword } = data;

  if (!currentPassword || !newPassword) {
    throw new BadRequestError('Current password and new password are required');
  }

  if (currentPassword === newPassword) {
    throw new BadRequestError('New password must be different from current password');
  }

  // Find user with password
  const user = await UserModel.findById(userId).select('+password');

  if (!user) {
    throw new UnauthorizedError('User not found');
  }

  // Verify current password
  const isPasswordValid = await user.comparePassword(currentPassword);
  if (!isPasswordValid) {
    throw new UnauthorizedError('Current password is incorrect');
  }

  // Hash new password
  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  // Update password
  await userRepo.updatePassword(userId, hashedPassword);

  return { message: 'Password changed successfully' };
};

export default changePassword;
