import 'dotenv/config';

const config = {
  app: {
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV || 'development',
    name: process.env.APP_NAME || 'Income Expense Tracker'
  },
  database: {
    uri: process.env.MONGODB_URI || '',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    refreshSecret: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET || 'your-refresh-secret-key',
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '60m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
  },
  logger: {
    level: process.env.LOG_LEVEL || 'info'
  },
  uploadDir: process.env.UPLOAD_DIR || 'uploads'
};

export default config;

