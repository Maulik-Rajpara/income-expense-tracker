const getUserById = (userRepo) => async (id) => {
   return await userRepo.findById(id);
};

export default getUserById;
