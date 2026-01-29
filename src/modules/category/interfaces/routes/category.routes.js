import { Router } from 'express';
import { authenticate } from '../../../../interfaces/middlewares/auth.js';
import {
  validateCreateCategory,
  validateUpdateCategory,
  validateCategoryId,
  validateCategoryQueryParams,
  validateCategoryType
} from '../validators/category.validator.js';

const categoryRoutes = (controller) => {
  const router = Router();

  // All category routes require authentication
  
  // POST /api/v1/categories - Create new category
  router.post("/", authenticate, validateCreateCategory, controller.create);
  
  // GET /api/v1/categories - Get all categories (with optional filters: type, search, pagination)
  router.get("/", authenticate, validateCategoryQueryParams, controller.getAll);
  
  // GET /api/v1/categories/type/:type - Get categories by type (income or expense)
  router.get("/type/:type", authenticate, validateCategoryType, controller.getByType);
  
  // GET /api/v1/categories/:id - Get category by ID
  router.get("/:id", authenticate, validateCategoryId, controller.getById);
  
  // PUT /api/v1/categories/:id - Update category by ID
  router.put("/:id", authenticate, validateCategoryId, validateUpdateCategory, controller.update);
  
  // DELETE /api/v1/categories/:id - Delete category by ID
  router.delete("/:id", authenticate, validateCategoryId, controller.delete);
  
  return router;
};

export default categoryRoutes;
