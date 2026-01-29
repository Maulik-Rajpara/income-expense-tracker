import { Router } from 'express';
import { authenticate } from '../../../../interfaces/middlewares/auth.js';
import {
  validateCreateTransaction,
  validateUpdateTransaction,
  validateTransactionId,
  validateTransactionQueryParams
} from '../validators/transaction.validator.js';

const transactionRoutes = (controller) => {
  const router = Router();

  // ==================== PROTECTED TRANSACTION ROUTES ====================
  // All transaction routes require authentication
  
  // POST /api/v1/transactions - Create new transaction
  router.post("/", authenticate, validateCreateTransaction, controller.create);
  
  // GET /api/v1/transactions - Get all transactions (with optional filters)
  router.get("/", authenticate, validateTransactionQueryParams, controller.getAll);
  
  // GET /api/v1/transactions/:id - Get transaction by ID
  router.get("/:id", authenticate, validateTransactionId, controller.getById);
  
  // PUT /api/v1/transactions/:id - Update transaction by ID
  router.put("/:id", authenticate, validateTransactionId, validateUpdateTransaction, controller.update);
  
  // DELETE /api/v1/transactions/:id - Delete transaction by ID
  router.delete("/:id", authenticate, validateTransactionId, controller.delete);
  
  return router;
};

export default transactionRoutes;
