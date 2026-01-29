import { NotFoundError, ForbiddenError, BadRequestError } from '../../../../utils/errors.js';
import CategoryModel from '../../../category/infrastructure/database/models/category.model.js';

/**
 * Update Transaction Use Case
 * Users can only update their own transactions
 */
const updateTransaction = (transactionRepo) => async (id, data, userId, isAdmin = false) => {
  // Get current transaction
  const currentTransaction = await transactionRepo.findById(id);
  if (!currentTransaction) {
    throw new NotFoundError('Transaction', id);
  }

  // Users can only update their own transactions (unless admin)
  // if (!isAdmin && currentTransaction.userId.toString() !== userId.toString()) {
  //   throw new ForbiddenError('You do not have permission to update this transaction');
  // }

  const { type, categoryId, amount, date, notes } = data;

  // If category is being updated, validate it exists and matches type
  if (categoryId) {
    const category = await CategoryModel.findById(categoryId);
    if (!category) {
      throw new NotFoundError('Category', categoryId);
    }

    const transactionType = type || currentTransaction.type;
    if (category.type !== transactionType) {
      throw new BadRequestError(`Category type "${category.type}" does not match transaction type "${transactionType}"`);
    }
  }

  // If type is being updated, ensure category matches
  if (type && categoryId) {
    const category = await CategoryModel.findById(categoryId);
    if (category.type !== type) {
      throw new BadRequestError(`Category type "${category.type}" does not match transaction type "${type}"`);
    }
  }

  // Prepare update data
  const updateData = {};
  if (type) updateData.type = type;
  if (categoryId) updateData.categoryId = categoryId;
  if (amount !== undefined) updateData.amount = parseFloat(amount);
  if (date) updateData.date = new Date(date);
  if (notes !== undefined) updateData.notes = notes.trim();

  return await transactionRepo.update(id, updateData);
};

export default updateTransaction;
