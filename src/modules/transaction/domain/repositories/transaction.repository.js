class TransactionRepository {
  create(transaction) {}
  findAll(options) {}
  findById(_id) {}
  update(_id, transaction) {}
  delete(_id) {}
  findByUserId(userId, options) {}
  findByCategoryId(categoryId, options) {}
  findByDateRange(userId, startDate, endDate, options) {}
  getDashboardStats(userId, startDate, endDate) {}
}

export default TransactionRepository;
