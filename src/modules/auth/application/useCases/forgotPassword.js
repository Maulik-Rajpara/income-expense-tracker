import { BadRequestError } from '../../../../utils/errors.js';
import JwtService from '../../../../utils/jwt.js';

/**
 * Forgot Password Use Case
 * Generates password reset token
 * In production, you would send this via email
 */
const forgotPassword = (userRepo) => async (email) => {
  if (!email) {
    throw new BadRequestError('Email is required');
  }

  // Find user by email
  const user = await userRepo.findByEmail(email);
  
  if (!user) {
    // Don't reveal that user doesn't exist for security
    // Still return success message
    return { 
      message: 'If an account exists with this email, you will receive a password reset link.' 
    };
  }

  // Generate reset token
  const { resetToken, hashedToken, expiresAt } = JwtService.generatePasswordResetToken();

  // Save hashed token and expiry to database
  await userRepo.setPasswordResetToken(user._id, hashedToken, expiresAt);

  // In production, send email with reset link
  // For now, we'll return the token (only for development/testing)
  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;

  // TODO: Implement email sending
  // await sendEmail({
  //   to: user.email,
  //   subject: 'Password Reset Request',
  //   text: `Reset your password: ${resetUrl}`
  // });

  return { 
    message: 'If an account exists with this email, you will receive a password reset link.',
    // Only include these in development - remove in production
    ...(process.env.NODE_ENV === 'development' && { 
      resetToken,
      resetUrl,
      note: 'Reset token included only in development mode'
    })
  };
};

export default forgotPassword;
