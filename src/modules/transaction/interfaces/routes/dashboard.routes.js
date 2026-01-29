import { Router } from 'express';
import { authenticate } from '../../../../interfaces/middlewares/auth.js';
import { validateDashboardQuery } from '../validators/dashboard.validator.js';

/**
 * Dashboard routes
 * User from token (Authorization header) - no userId in query/body
 * GET /api/v1/dashboard?startDate=...&endDate=...
 */
const dashboardRoutes = (controller) => {
  const router = Router();

  router.get("/", authenticate, validateDashboardQuery, controller.getDashboard);

  return router;
};

export default dashboardRoutes;
