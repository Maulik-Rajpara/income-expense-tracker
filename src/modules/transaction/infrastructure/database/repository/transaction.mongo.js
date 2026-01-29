import TransactionRepository from '../../../domain/repositories/transaction.repository.js';
import TransactionModel from '../models/transaction.model.js';
import { CATEGORY_TYPES } from '../../../../category/infrastructure/database/models/category.model.js';

class TransactionMongoRepository extends TransactionRepository {
  async create(transactionData) {
    const transactionDocument = new TransactionModel(transactionData);
    const savedTransaction = await transactionDocument.save();
    // Populate category and user details
    await savedTransaction.populate('categoryId', 'name type');
    await savedTransaction.populate('userId', 'firstName lastName email');
    return savedTransaction;
  }

  async findAll(options = {}) {
    const { 
      page = 1, 
      limit = 10, 
      sort = 'date', 
      order = 'desc', 
      search,
      categoryId,
      type,
      userId,
      startDate,
      endDate
    } = options;
    
    const query = {};
    
    // Filter by userId (required for user transactions, optional for admin)
    if (userId) {
      query.userId = userId;
    }
    
    // Filter by type
    if (type) {
      query.type = type;
    }
    
    // Filter by category
    if (categoryId) {
      query.categoryId = categoryId;
    }
    
    // Date range filter
    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        query.date.$gte = new Date(startDate);
      }
      if (endDate) {
        query.date.$lte = new Date(endDate);
      }
    }
    
    // Search in notes (word search)
    if (search) {
      query.$or = [
        { notes: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;
    const sortOrder = order === 'asc' ? 1 : -1;

    const [transactions, total] = await Promise.all([
      TransactionModel.find(query)
        .populate('categoryId', 'name type')
        .populate('userId', 'firstName lastName email')
        .sort({ [sort]: sortOrder })
        .skip(skip)
        .limit(parseInt(limit)),
      TransactionModel.countDocuments(query)
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: transactions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    };
  }

  async findById(id) {
    return await TransactionModel.findById(id)
      .populate('categoryId', 'name type')
      .populate('userId', 'firstName lastName email');
  }

  async findByUserId(userId, options = {}) {
    return await this.findAll({ ...options, userId });
  }

  async findByCategoryId(categoryId, options = {}) {
    return await this.findAll({ ...options, categoryId });
  }

  async findByDateRange(userId, startDate, endDate, options = {}) {
    return await this.findAll({ 
      ...options, 
      userId, 
      startDate, 
      endDate 
    });
  }

  async update(id, transactionData) {
    const updatedTransaction = await TransactionModel.findByIdAndUpdate(
      id, 
      { ...transactionData, updatedAt: new Date() }, 
      { new: true, runValidators: true }
    )
      .populate('categoryId', 'name type')
      .populate('userId', 'firstName lastName email');
    return updatedTransaction;
  }

  async delete(id) {
    return await TransactionModel.findByIdAndDelete(id);
  }

  /**
   * Get dashboard stats: total income, total expense, balance for a user in date range
   */
  async getDashboardStats(userId, startDate, endDate) {
    const match = { userId };
    if (startDate || endDate) {
      match.date = {};
      if (startDate) match.date.$gte = new Date(startDate);
      if (endDate) match.date.$lte = new Date(endDate);
    }

    const result = await TransactionModel.aggregate([
      { $match: match },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' }
        }
      }
    ]);

    let totalIncome = 0;
    let totalExpense = 0;

    for (const row of result) {
      if (row._id === CATEGORY_TYPES.INCOME) totalIncome = row.total;
      if (row._id === CATEGORY_TYPES.EXPENSE) totalExpense = row.total;
    }

    const balance = totalIncome - totalExpense;

    return {
      totalIncome: Math.round(totalIncome * 100) / 100,
      totalExpense: Math.round(totalExpense * 100) / 100,
      balance: Math.round(balance * 100) / 100
    };
  }
}

export default TransactionMongoRepository;
