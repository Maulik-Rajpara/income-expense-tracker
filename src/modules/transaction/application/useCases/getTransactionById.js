import { NotFoundError, ForbiddenError } from '../../../../utils/errors.js';

/**
 * Get Transaction By ID Use Case
 * Users can only access their own transactions
 */
const getTransactionById = (transactionRepo) => async (id, userId, isAdmin = false) => {
  const transaction = await transactionRepo.findById(id);
  
  if (!transaction) {
    throw new NotFoundError('Transaction', id);
  }

  // Users can only access their own transactions (unless admin)
  if (!isAdmin && transaction.userId.toString() !== userId.toString()) {
    throw new ForbiddenError('You do not have permission to access this transaction');
  }

  return transaction;
};

export default getTransactionById;
