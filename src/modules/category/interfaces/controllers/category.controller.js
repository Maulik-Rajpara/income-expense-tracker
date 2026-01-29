import { NotFoundError } from "../../../../utils/errors.js";
import ResponseFormatter from "../../../../utils/responseFormatter.js";
import asyncHandler from "../../../../utils/asyncHandler.js";

const categoryController = (useCases) => ({
  /**
   * POST /api/v1/categories
   * Create a new category
   */
  create: asyncHandler(async (req, res) => {
    const category = await useCases.create(req.body);
    return ResponseFormatter.created(res, "Category created successfully", category);
  }),

  /**
   * GET /api/v1/categories
   * Get all categories with optional filters (type, search, pagination)
   */
  getAll: asyncHandler(async (req, res) => {
    const options = {
      page: req.query.page || 1,
      limit: req.query.limit || 100,
      sort: req.query.sort || 'createdAt',
      order: req.query.order || 'desc',
      search: req.query.search,
      type: req.query.type // Filter by type: 'income' or 'expense'
    };

    if (options.limit > 100) {
      options.limit = 100;
    }

    const result = await useCases.getAll(options);
    
    return ResponseFormatter.successWithPagination(
      res,
      "Categories retrieved successfully",
      result.data,
      result.pagination
    );
  }),

  /**
   * GET /api/v1/categories/type/:type
   * Get categories filtered by type (income or expense)
   */
  getByType: asyncHandler(async (req, res) => {
    const { type } = req.params;
    const options = {
      page: req.query.page || 1,
      limit: req.query.limit || 10,
      sort: req.query.sort || 'createdAt',
      order: req.query.order || 'desc',
      search: req.query.search
    };

    if (options.limit > 100) {
      options.limit = 100;
    }

    const result = await useCases.getByType(type, options);
    
    return ResponseFormatter.successWithPagination(
      res,
      `Categories of type "${type}" retrieved successfully`,
      result.data,
      result.pagination
    );
  }),

  /**
   * GET /api/v1/categories/:id
   * Get category by ID
   */
  getById: asyncHandler(async (req, res) => {
    const categoryId = req.params.id;
    const category = await useCases.getById(categoryId);

    if (!category) {
      throw new NotFoundError("Category", categoryId);
    }

    return ResponseFormatter.success(res, "Category retrieved successfully", category);
  }),

  /**
   * PUT /api/v1/categories/:id
   * Update category by ID
   */
  update: asyncHandler(async (req, res) => {
    const categoryId = req.params.id;
    const category = await useCases.getById(categoryId);

    if (!category) {
      throw new NotFoundError("Category", categoryId);
    }

    const updated = await useCases.update(categoryId, req.body);
    return ResponseFormatter.success(res, "Category updated successfully", updated);
  }),

  /**
   * DELETE /api/v1/categories/:id
   * Delete category by ID
   */
  delete: asyncHandler(async (req, res) => {
    const categoryId = req.params.id;
    const category = await useCases.getById(categoryId);

    if (!category) {
      throw new NotFoundError("Category", categoryId);
    }

    await useCases.delete(categoryId);
    return ResponseFormatter.success(res, "Category deleted successfully", null);
  })
});

export default categoryController;
