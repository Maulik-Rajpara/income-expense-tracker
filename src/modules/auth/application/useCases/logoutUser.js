/**
 * Logout User Use Case
 * Invalidates refresh token
 */
const logoutUser = (userRepo) => async (userId) => {
  // Clear refresh token
  await userRepo.updateRefreshToken(userId, null);
  
  return { message: 'Logged out successfully' };
};

export default logoutUser;
