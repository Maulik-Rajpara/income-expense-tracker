/**
 * Standalone script to seed default categories
 * Run with: node src/modules/category/infrastructure/database/seeds/seedCategories.js
 */
import 'dotenv/config';
import mongoose from 'mongoose';
import config from '../../../../../config/index.js';
import { connectDB } from '../../../../../infrastructure/database/index.js';
import { seedDefaultCategories, clearDefaultCategories } from './defaultCategories.js';
import logger from '../../../../../infrastructure/logger/index.js';

const runSeed = async () => {
  try {
    // Connect to database
    await connectDB();
    logger.info('Database connected');

    // Check command line arguments
    const command = process.argv[2];

    if (command === '--clear' || command === '-c') {
      // Clear default categories
      logger.warn('⚠️  Clearing all default categories...');
      await clearDefaultCategories();
      logger.info('✅ Default categories cleared');
    } else {
      // Seed default categories
      logger.info('🌱 Seeding default categories...');
      const result = await seedDefaultCategories();
      
      if (result.success) {
        logger.info(`✅ Seed completed: ${result.created} created, ${result.skipped} skipped`);
      } else {
        logger.warn(`⚠️  Seed completed with errors: ${result.errors?.length} errors`);
      }
    }

    // Close database connection
    await mongoose.connection.close();
    logger.info('Database connection closed');
    process.exit(0);
  } catch (error) {
    logger.error('Seed script failed:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

runSeed();
