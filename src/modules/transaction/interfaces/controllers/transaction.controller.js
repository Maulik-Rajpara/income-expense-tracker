import { NotFoundError } from "../../../../utils/errors.js";
import ResponseFormatter from "../../../../utils/responseFormatter.js";
import asyncHandler from "../../../../utils/asyncHandler.js";

const transactionController = (useCases) => ({
  /**
   * POST /api/v1/transactions
   * Create a new transaction
   */
  create: asyncHandler(async (req, res) => {
    const transaction = await useCases.create(req.body, req.userId);
    return ResponseFormatter.created(res, "Transaction created successfully", transaction);
  }),

  /**
   * GET /api/v1/transactions
   * Get all transactions with optional filters
   * Users see only their transactions, admins can filter by userId
   */
  getAll: asyncHandler(async (req, res) => {
    const options = {
      page: req.query.page || 1,
      limit: req.query.limit || 10,
      sort: req.query.sort || 'date',
      order: req.query.order || 'desc',
      search: req.query.search, // Search in notes
      categoryId: req.query.categoryId,
      type: req.query.type, // Filter by income/expense
      userId: req.query.userId, // For admin only
      startDate: req.query.startDate,
      endDate: req.query.endDate
    };

    if (options.limit > 100) {
      options.limit = 100;
    }

    // Check if user is admin (you can implement admin check middleware)
    const isAdmin = req.user?.role === 'admin' || false;

    const result = await useCases.getAll(options, req.userId, isAdmin);
    
    return ResponseFormatter.successWithPagination(
      res,
      "Transactions retrieved successfully",
      result.data,
      result.pagination
    );
  }),

  /**
   * GET /api/v1/transactions/:id
   * Get transaction by ID
   */
  getById: asyncHandler(async (req, res) => {
    const transactionId = req.params.id;
    
    // Check if user is admin
    const isAdmin = req.user?.role === 'admin' || false;
    
    const transaction = await useCases.getById(transactionId, req.userId, isAdmin);

    if (!transaction) {
      throw new NotFoundError("Transaction", transactionId);
    }

    return ResponseFormatter.success(res, "Transaction retrieved successfully", transaction);
  }),

  /**
   * PUT /api/v1/transactions/:id
   * Update transaction by ID
   */
  update: asyncHandler(async (req, res) => {
    const transactionId = req.params.id;
    
    // Check if user is admin
    const isAdmin = req.user?.role === 'admin' || false;
    
    const updated = await useCases.update(transactionId, req.body, req.userId, isAdmin);
    return ResponseFormatter.success(res, "Transaction updated successfully", updated);
  }),

  /**
   * DELETE /api/v1/transactions/:id
   * Delete transaction by ID
   */
  delete: asyncHandler(async (req, res) => {
    const transactionId = req.params.id;
    
    // Check if user is admin
    const isAdmin = req.user?.role === 'admin' || false;
    
    await useCases.delete(transactionId, req.userId, isAdmin);
    return ResponseFormatter.success(res, "Transaction deleted successfully", null);
  }),

  /**
   * GET /api/v1/dashboard
   * Dashboard stats: total income, total expense, balance
   * User from token (no userId required). Optional date range filter.
   */
  getDashboard: asyncHandler(async (req, res) => {
    const { startDate, endDate } = req.query;
    const stats = await useCases.getDashboardStats(req.userId, startDate, endDate);
    return ResponseFormatter.success(res, "Dashboard stats retrieved successfully", {
      ...stats,
      ...(startDate && { startDate }),
      ...(endDate && { endDate })
    });
  })
});

export default transactionController;
