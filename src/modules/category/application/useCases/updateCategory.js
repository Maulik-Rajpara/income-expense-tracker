import { ConflictError, ForbiddenError, NotFoundError } from '../../../../utils/errors.js';

/**
 * Update Category Use Case
 */
const updateCategory = (categoryRepo) => async (id, data) => {
  // Get current category
  const currentCategory = await categoryRepo.findById(id);
  if (!currentCategory) {
    throw new NotFoundError('Category', id);
  }

  // Prevent modification of default categories
  if (currentCategory.isDefault) {
    throw new ForbiddenError('Default categories cannot be modified');
  }

  const { name, type, isDefault } = data;

  // Prevent users from changing isDefault flag
  if (isDefault !== undefined) {
    throw new ForbiddenError('Cannot modify isDefault flag');
  }

  // If name or type is being updated, check for conflicts
  if (name || type) {
    const newName = name ? name.trim() : currentCategory.name;
    const newType = type || currentCategory.type;

    // Check if another category with same name and type exists
    const existingCategory = await categoryRepo.findByNameAndType(newName, newType);
    if (existingCategory && existingCategory._id.toString() !== id) {
      throw new ConflictError(`Category "${newName}" already exists for type "${newType}"`);
    }
  }

  // Remove isDefault from update data if somehow present
  const updateData = { ...data };
  delete updateData.isDefault;

  return await categoryRepo.update(id, updateData);
};

export default updateCategory;
