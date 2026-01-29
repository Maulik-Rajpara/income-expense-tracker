const getUsers = (userRepo) => async (options = {}) => {
  return await userRepo.findAll(options);
};

export default getUsers;
