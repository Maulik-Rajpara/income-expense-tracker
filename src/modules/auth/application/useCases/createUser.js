import { ConflictError } from '../../../../utils/errors.js';
import JwtService from '../../../../utils/jwt.js';

/**
 * Create User / Register Use Case
 * Handles user registration with validation
 */
const createUser = (userRepo) => async (data) => {
  const { firstName, lastName, email, phoneNumber, password } = data;

  // Check if user with email already exists
  const existingEmail = await userRepo.findByEmail(email);
  if (existingEmail) {
    throw new ConflictError('User with this email already exists');
  }

  // Check if user with phone number already exists (if provided)
  if (phoneNumber) {
    const existingPhone = await userRepo.findByPhoneNumber(phoneNumber);
    if (existingPhone) {
      throw new ConflictError('User with this phone number already exists');
    }
  }

  // Create user (password will be hashed by mongoose pre-save hook)
  const userData = {
    firstName,
    lastName,
    email: email.toLowerCase(),
    phoneNumber,
    password
  };

  const user = await userRepo.create(userData);

  // Generate tokens
  const tokens = JwtService.generateTokens(user);

  // Store refresh token
  await userRepo.updateRefreshToken(user._id || user.id, tokens.refreshToken);

  return {
    user,
    ...tokens
  };
};

export default createUser;
