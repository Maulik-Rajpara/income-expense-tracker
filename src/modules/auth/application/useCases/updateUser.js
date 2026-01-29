const updateUser = (userRepo) => async (id, data) => {
  return await userRepo.update(id, data);
};

export default updateUser;
