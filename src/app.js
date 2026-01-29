import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import config from './config/index.js';
import routes from './interfaces/routes/index.js';
import errorHandler from './interfaces/middlewares/errorHandler.js';
import requestIdMiddleware from './interfaces/middlewares/requestId.js';
import { apiLimiter, writeLimiter } from './interfaces/middlewares/rateLimiter.js';
import initializeAuthModule from './modules/auth/index.js';
import initializeCategoryModule from './modules/category/index.js';
import initializeTransactionModule from './modules/transaction/index.js';

const uploadDir = config.uploadDir || path.join(process.cwd(), 'uploads');

class App {
  constructor() {
    this.app = express();
    this.setupMiddleware();
    this.setupModules();
    this.setupRoutes();
  }

  setupMiddleware() {
    // Request ID middleware (should be first)
    this.app.use(requestIdMiddleware);

    // Security middleware
    this.app.use(helmet());
    
    // CORS configuration
    const corsOrigin = process.env.CORS_ORIGIN || '*';
    this.app.use(cors({
      origin: corsOrigin,
      credentials: corsOrigin !== '*',
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization']
    }));
    
    // Body parsing middleware
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Serve uploaded files (local storage)
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    this.app.use('/uploads', express.static(uploadDir, {
      index: false,
      setHeaders: (res, filePath) => {
        res.setHeader('Cache-Control', 'public, max-age=3600');
      }
    }));

    // Rate limiting (apply to all routes)
    this.app.use(apiLimiter);
  }
  /**
   * Setup all application modules
   */
  setupModules() {
    // Initialize Auth Module (handles users + authentication)
    const authModule = initializeAuthModule();
    this.authModule = authModule;

    // Initialize Category Module (handles income/expense categories)
    const categoryModule = initializeCategoryModule();
    this.categoryModule = categoryModule;

    // Initialize Transaction Module (handles income/expense transactions)
    const transactionModule = initializeTransactionModule();
    this.transactionModule = transactionModule;
  }

  setupRoutes() {
    // Health check route
    this.app.use('/', routes);

    // API Health check endpoint
    this.app.get('/api/health', (req, res) => {
      const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
      
      res.status(200).json({
        success: true,
        message: 'Service is healthy',
        data: {
          status: 'ok',
          uptime: process.uptime(),
          timestamp: new Date().toISOString(),
          database: dbStatus,
          environment: config.app.env
        },
        meta: {
          timestamp: new Date().toISOString(),
          requestId: res.locals.requestId || null
        }
      });
    });

    // API Version 1 routes
    const v1Router = express.Router();

    // Auth routes (login, register, forgot-password, etc.)
    v1Router.use("/auth", 
      (req, res, next) => {
        // Apply stricter rate limiting for write operations
        if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
          return writeLimiter(req, res, next);
        }
        next();
      },
      this.authModule.routes
    );

    // Category routes (CRUD for income/expense categories)
    v1Router.use("/categories", 
      (req, res, next) => {
        // Apply stricter rate limiting for write operations
        if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
          return writeLimiter(req, res, next);
        }
        next();
      },
      this.categoryModule.routes
    );

    // Transaction routes (CRUD for income/expense transactions)
    v1Router.use("/transactions", 
      (req, res, next) => {
        // Apply stricter rate limiting for write operations
        if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
          return writeLimiter(req, res, next);
        }
        next();
      },
      this.transactionModule.routes
    );

    // Dashboard API (user from token, date range filter, total income/expense/balance)
    v1Router.use("/dashboard", this.transactionModule.dashboardRoutes);

    // Mount versioned API routes
    this.app.use("/api/v1", v1Router);

    // 404 handler
    this.app.use((req, res) => {
      res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: `Route ${req.originalUrl} not found`
        },
        meta: {
          timestamp: new Date().toISOString(),
          requestId: res.locals.requestId || null,
          path: req.originalUrl
        }
      });
    });

    // Global error handler (must be last)
    this.app.use(errorHandler);
  }

  getApp() {
    return this.app;
  }
}

export default new App().getApp();
