import { NotFoundError, ForbiddenError } from '../../../../utils/errors.js';

/**
 * Delete Category Use Case
 */
const deleteCategory = (categoryRepo) => async (categoryId) => {
  // Find the category by ID
  const category = await categoryRepo.findById(categoryId);
  if (!category) {
    throw new NotFoundError('Category', categoryId);
  }

  // Prevent deletion of default categories
  if (category.isDefault) {
    throw new ForbiddenError('Default categories cannot be deleted');
  }

  return await categoryRepo.delete(categoryId);
};

export default deleteCategory;
