import { NotFoundError } from '../../../../utils/errors.js';

const deleteUser = (userRepo) => async (userId) => {
  // Find the user by ID
  const user = await userRepo.findById(userId);
  if (!user) {
    throw new NotFoundError('User', userId);
  }

  return await userRepo.delete(userId);
};

export default deleteUser;
