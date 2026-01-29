import multer from 'multer';

const memoryStorage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowed = ['image/', 'application/pdf'];
  if (allowed.some(prefix => file.mimetype.startsWith(prefix))) {
    cb(null, true);
  } else {
    cb(new Error('INVALID_FILE_TYPE'), false);
  }
};

const limits = { fileSize: 10 * 1024 * 1024 }; // 10MB

function uploadSingle(fieldName = 'attachment') {
  return multer({ storage: memoryStorage, fileFilter, limits }).single(fieldName);
}

export { uploadSingle };
