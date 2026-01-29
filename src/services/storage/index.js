import LocalStorage from './localStorage.js';
import config from '../../config/index.js';

function createStorage() {
  const driver = process.env.STORAGE_DRIVER || 'local';
  if (driver === 'local') {
    return new LocalStorage(config.uploadDir || 'uploads');
  }
  // placeholder: add S3/GCS implementations later
  throw new Error(`Unsupported storage driver: ${driver}`);
}

export default createStorage();
