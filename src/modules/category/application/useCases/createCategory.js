import { ConflictError } from '../../../../utils/errors.js';

/**
 * Create Category Use Case
 * Handles category creation with validation
 */
const createCategory = (categoryRepo) => async (data) => {
  const { name, type } = data;

  // Check if category with same name and type already exists
  const existingCategory = await categoryRepo.findByNameAndType(name, type);
  if (existingCategory) {
    throw new ConflictError(`Category "${name}" already exists for type "${type}"`);
  }

  // Create category (ensure isDefault is always false for user-created categories)
  const categoryData = {
    name: name.trim(),
    type,
    isDefault: false // User-created categories are never default
  };

  const category = await categoryRepo.create(categoryData);
  return category;
};

export default createCategory;
