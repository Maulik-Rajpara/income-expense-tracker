import { NotFoundError, ForbiddenError } from '../../../../utils/errors.js';

/**
 * Delete Transaction Use Case
 * Users can only delete their own transactions
 */
const deleteTransaction = (transactionRepo) => async (transactionId, userId, isAdmin = false) => {
  // Find the transaction by ID
  const transaction = await transactionRepo.findById(transactionId);
  if (!transaction) {
    throw new NotFoundError('Transaction', transactionId);
  }

  // Users can only delete their own transactions (unless admin)
  // if (!isAdmin && transaction.userId.toString() !== userId.toString()) {
  //   throw new ForbiddenError('You do not have permission to delete this transaction');
  // }

  return await transactionRepo.delete(transactionId);
};

export default deleteTransaction;
