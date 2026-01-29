/**
 * Get Category By ID Use Case
 */
const getCategoryById = (categoryRepo) => async (id) => {
  return await categoryRepo.findById(id);
};

export default getCategoryById;
