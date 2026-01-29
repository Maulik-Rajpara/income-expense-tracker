/**
 * Get All Transactions Use Case
 * Supports filtering by word, category, type, date range, and pagination
 * Users can only see their own transactions (unless admin)
 */
const getTransactions = (transactionRepo) => async (options, userId, isAdmin = false) => {
  // If not admin, filter by userId
  if (!isAdmin) {
    options.userId = userId;
  }
  // If admin and userId provided, filter by that userId
  // Otherwise, admin sees all transactions

  return await transactionRepo.findAll(options);
};

export default getTransactions;
