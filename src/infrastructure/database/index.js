import mongoose from 'mongoose';
import logger from '../logger/index.js';
import config from '../../config/index.js';

mongoose.connection.on('connected', () => {
  logger.info('MongoDB connected successfully');
});

mongoose.connection.on('error', (err) => {
  logger.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  logger.warn('MongoDB disconnected');
});

const connectDB = async () => {
  try {
    if (!config.database.uri) {
      throw new Error('MongoDB URI is not configured');
    }

    await mongoose.connect(config.database.uri, config.database.options);
    logger.info(`MongoDB connected to: ${config.database.uri.split('@')[1] || 'database'}`);
  } catch (error) {
    logger.error('Unable to connect to database:', error);
    throw error;
  }
};

export { mongoose, connectDB };