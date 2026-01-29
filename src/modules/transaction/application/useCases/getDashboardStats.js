/**
 * Get Dashboard Stats Use Case
 * Returns total income, total expense, balance for the user in date range
 * User is taken from token (userId) - no userId param required
 */
const getDashboardStats = (transactionRepo) => async (userId, startDate, endDate) => {
  return await transactionRepo.getDashboardStats(userId, startDate, endDate);
};

export default getDashboardStats;
