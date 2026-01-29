import { Router } from 'express';
import { authenticate } from '../../../../interfaces/middlewares/auth.js';
import {
  validateRegister,
  validateLogin,
  validateChangePassword,
  validateForgotPassword,
  validateResetPassword,
  validateRefreshToken,
  validateUpdateProfile,
  validateUpdateUser,
  validateUserId,
  validateUserQueryParams
} from '../validators/user.validator.js';

const authRoutes = (controller) => {
  const router = Router();

  // ==================== PUBLIC AUTH ROUTES ====================
  
  // POST /api/v1/auth/register - Register new user
  router.post("/register", validateRegister, controller.register);
  
  // POST /api/v1/auth/login - Login user
  router.post("/login", validateLogin, controller.login);
  
  // POST /api/v1/auth/forgot-password - Request password reset
  router.post("/forgot-password", validateForgotPassword, controller.forgotPassword);
  
  // POST /api/v1/auth/reset-password - Reset password with token
  router.post("/reset-password", validateResetPassword, controller.resetPassword);
  
  // POST /api/v1/auth/refresh-token - Refresh access token
  router.post("/refresh-token", validateRefreshToken, controller.refreshToken);

  // ==================== PROTECTED AUTH ROUTES ====================
  
  // POST /api/v1/auth/logout - Logout user
  router.post("/logout", authenticate, controller.logout);
  
  // POST /api/v1/auth/change-password - Change password
  router.post("/change-password", authenticate, validateChangePassword, controller.changePassword);
  
  // GET /api/v1/auth/me - Get current user profile
  router.get("/me", authenticate, controller.getProfile);
  
  // PUT /api/v1/auth/me - Update current user profile
  router.put("/me", authenticate, validateUpdateProfile, controller.updateProfile);

  // ==================== ADMIN USER MANAGEMENT ROUTES ====================
  // TODO: Add admin middleware for these routes
  
  // GET /api/v1/auth/users - Get all users
  router.get("/users", authenticate, validateUserQueryParams, controller.getAll);
  
  // GET /api/v1/auth/users/:id - Get user by ID
  router.get("/users/:id", authenticate, validateUserId, controller.findById);
  
  // PUT /api/v1/auth/users/:id - Update user by ID
  router.put("/users/:id", authenticate, validateUserId, validateUpdateUser, controller.update);
  
  // DELETE /api/v1/auth/users/:id - Delete user by ID
  router.delete("/users/:id", authenticate, validateUserId, controller.delete);
  
  return router;
};

export default authRoutes;
