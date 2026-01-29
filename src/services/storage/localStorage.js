import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

// Generate UUID v4 using crypto
function generateUUID() {
  return crypto.randomUUID();
}

// Simple filename sanitization
function sanitizeFilename(filename) {
  return filename.replace(/[^a-zA-Z0-9._-]/g, '_');
}

class LocalStorage {
  constructor(dir) {
    this.dir = dir;
    if (!fs.existsSync(this.dir)) fs.mkdirSync(this.dir, { recursive: true });
  }

  async save({ buffer, originalname, mimetype }) {
    const key = `${Date.now()}-${generateUUID()}-${sanitizeFilename(originalname)}`;
    const filePath = path.join(this.dir, key);
    await fs.promises.writeFile(filePath, buffer);
    return {
      key,
      path: filePath,
      originalName: originalname,
      mimeType: mimetype,
      size: buffer.length,
      url: `/uploads/${encodeURIComponent(key)}`,
      uploadedAt: new Date().toISOString()
    };
  }

  async delete(key) {
    const filePath = path.join(this.dir, key);
    if (fs.existsSync(filePath)) await fs.promises.unlink(filePath);
  }

  getUrl(key) {
    return `/uploads/${encodeURIComponent(key)}`;
  }
}

export default LocalStorage;
