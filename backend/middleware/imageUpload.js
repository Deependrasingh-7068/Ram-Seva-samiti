const multer = require('multer');

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    // Safe string conversion to prevent startswith crashes if mimetype is missing/undefined
    const mimetype = file && file.mimetype ? String(file.mimetype).toLowerCase() : '';
    
    if (mimetype.startsWith('image/') || mimetype === 'image/avif') {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPG, JPEG, PNG, WebP, and AVIF images are allowed.'), false);
    }
  }
});

module.exports = upload;