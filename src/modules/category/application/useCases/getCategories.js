/**
 * Get All Categories Use Case
 * Supports filtering by type and searching by name
 */
const getCategories = (categoryRepo) => async (options = {}) => {
  return await categoryRepo.findAll(options);
};

export default getCategories;
