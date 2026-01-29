import { BadRequestError, NotFoundError } from '../../../../utils/errors.js';
import CategoryModel from '../../../category/infrastructure/database/models/category.model.js';

/**
 * Create Transaction Use Case
 * Handles transaction creation with validation
 */
const createTransaction = (transactionRepo) => async (data, userId) => {
  const { type, categoryId, amount, date, notes } = data;

  // Validate category exists and matches transaction type
  const category = await CategoryModel.findById(categoryId);
  if (!category) {
    throw new NotFoundError('Category', categoryId);
  }

  // Ensure category type matches transaction type
  if (category.type !== type) {
    throw new BadRequestError(`Category type "${category.type}" does not match transaction type "${type}"`);
  }

  // Create transaction
  const transactionData = {
    type,
    categoryId,
    amount: parseFloat(amount),
    date: new Date(date),
    notes: notes?.trim() || '',
    userId
  };

  const transaction = await transactionRepo.create(transactionData);
  return transaction;
};

export default createTransaction;
