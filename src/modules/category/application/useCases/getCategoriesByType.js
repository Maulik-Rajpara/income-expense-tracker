/**
 * Get Categories By Type Use Case
 * Filters categories by income or expense type
 */
const getCategoriesByType = (categoryRepo) => async (type, options = {}) => {
  return await categoryRepo.findByType(type, options);
};

export default getCategoriesByType;
