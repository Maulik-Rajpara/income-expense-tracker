import mongoose from 'mongoose';
import app from './app.js';
import config from './config/index.js';
import { connectDB } from './infrastructure/database/index.js';
import logger from './infrastructure/logger/index.js';
import { seedDefaultCategories } from './modules/category/infrastructure/database/seeds/defaultCategories.js';

const startServer = async () => {
  try {
    // Initialize database connection
    await connectDB();
    
    // Seed default categories if enabled (optional - set SEED_CATEGORIES=true in .env)
    if (process.env.SEED_CATEGORIES === 'true') {
      logger.info('🌱 Auto-seeding default categories...');
      try {
        await seedDefaultCategories();
      } catch (error) {
        logger.warn('Failed to seed default categories:', error.message);
        // Don't fail server startup if seeding fails
      }
    }
    
    const server = app.listen(config.app.port, () => {
      logger.info(`🚀 ${config.app.name} running on port ${config.app.port}`);
      logger.info(`📦 Environment: ${config.app.env}`);
    });

    // Graceful shutdown
    const shutdown = async (signal) => {
      logger.info(`${signal} received. Shutting down gracefully...`);
      
      server.close(() => {
        logger.info('HTTP server closed');
        
        // Close database connection
        mongoose.connection.close(false, () => {
          logger.info('MongoDB connection closed');
          process.exit(0);
        });
      });

      // Force close after 10 seconds
      setTimeout(() => {
        logger.error('Forced shutdown after timeout');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err) => {
      logger.error('Unhandled Promise Rejection:', err);
      shutdown('unhandledRejection');
    });

    // Handle uncaught exceptions
    process.on('uncaughtException', (err) => {
      logger.error('Uncaught Exception:', err);
      shutdown('uncaughtException');
    });

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
