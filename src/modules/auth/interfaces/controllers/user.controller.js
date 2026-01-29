import { NotFoundError } from "../../../../utils/errors.js";
import ResponseFormatter from "../../../../utils/responseFormatter.js";
import asyncHandler from "../../../../utils/asyncHandler.js";

const authController = (useCases) => ({
  // ==================== AUTH ENDPOINTS ====================
  
  /**
   * POST /auth/register
   * Register a new user
   */
  register: asyncHandler(async (req, res) => {
    const result = await useCases.create(req.body);
    return ResponseFormatter.created(res, "Registration successful", {
      user: result.user,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken
    });
  }),

  /**
   * POST /auth/login
   * Login with email/phone and password
   */
  login: asyncHandler(async (req, res) => {
    const result = await useCases.login(req.body);
    return ResponseFormatter.success(res, "Login successful", {
      user: result.user,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken
    });
  }),

  /**
   * POST /auth/logout
   * Logout user (invalidate refresh token)
   */
  logout: asyncHandler(async (req, res) => {
    await useCases.logout(req.userId);
    return ResponseFormatter.success(res, "Logout successful", null);
  }),

  /**
   * POST /auth/refresh-token
   * Get new access token using refresh token
   */
  refreshToken: asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;
    const result = await useCases.refreshToken(refreshToken);
    return ResponseFormatter.success(res, "Token refreshed successfully", {
      accessToken: result.accessToken,
      refreshToken: result.refreshToken
    });
  }),

  /**
   * POST /auth/change-password
   * Change password (requires authentication)
   */
  changePassword: asyncHandler(async (req, res) => {
    await useCases.changePassword(req.userId, req.body);
    return ResponseFormatter.success(res, "Password changed successfully", null);
  }),

  /**
   * POST /auth/forgot-password
   * Request password reset
   */
  forgotPassword: asyncHandler(async (req, res) => {
    const result = await useCases.forgotPassword(req.body.email);
    return ResponseFormatter.success(res, result.message, {
      // Only in development
      ...(process.env.NODE_ENV === 'development' && result.resetToken && {
        resetToken: result.resetToken,
        resetUrl: result.resetUrl
      })
    });
  }),

  /**
   * POST /auth/reset-password
   * Reset password with token
   */
  resetPassword: asyncHandler(async (req, res) => {
    const result = await useCases.resetPassword(req.body);
    return ResponseFormatter.success(res, result.message, null);
  }),

  // ==================== USER PROFILE ENDPOINTS ====================

  /**
   * GET /auth/me
   * Get current user profile
   */
  getProfile: asyncHandler(async (req, res) => {
    const user = await useCases.getById(req.userId);
    if (!user) {
      throw new NotFoundError("User", req.userId);
    }
    return ResponseFormatter.success(res, "Profile retrieved successfully", user);
  }),

  /**
   * PUT /auth/me
   * Update current user profile
   */
  updateProfile: asyncHandler(async (req, res) => {
    // Only allow updating certain fields
    const allowedFields = ['firstName', 'lastName', 'phoneNumber'];
    const updates = {};
    
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const updated = await useCases.update(req.userId, updates);
    return ResponseFormatter.success(res, "Profile updated successfully", updated);
  }),

  // ==================== ADMIN USER MANAGEMENT ENDPOINTS ====================

  /**
   * GET /auth/users
   * Get all users (admin only - add admin middleware later)
   */
  getAll: asyncHandler(async (req, res) => {
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

    const result = await useCases.getAll(options);
    
    return ResponseFormatter.successWithPagination(
      res,
      "Users retrieved successfully",
      result.data,
      result.pagination
    );
  }),

  /**
   * GET /auth/users/:id
   * Get user by ID (admin only)
   */
  findById: asyncHandler(async (req, res) => {
    const userId = req.params.id;
    const user = await useCases.getById(userId);

    if (!user) {
      throw new NotFoundError("User", userId);
    }

    return ResponseFormatter.success(res, "User retrieved successfully", user);
  }),

  /**
   * PUT /auth/users/:id
   * Update user by ID (admin only)
   */
  update: asyncHandler(async (req, res) => {
    const userId = req.params.id;
    const user = await useCases.getById(userId);

    if (!user) {
      throw new NotFoundError("User", userId);
    }

    const updated = await useCases.update(userId, req.body);
    return ResponseFormatter.success(res, "User updated successfully", updated);
  }),

  /**
   * DELETE /auth/users/:id
   * Delete user by ID (admin only)
   */
  delete: asyncHandler(async (req, res) => {      
    const userId = req.params.id;
    const user = await useCases.getById(userId);

    if (!user) {
      throw new NotFoundError("User", userId);
    }

    await useCases.delete(userId);
    return ResponseFormatter.success(res, "User deleted successfully", null);
  })
});

export default authController;
