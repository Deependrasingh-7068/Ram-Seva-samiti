const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary').v2;
const upload = require('../middleware/imageUpload');
const { optimizeImage } = require('../utils/imageOptimizer');

// Cloudinary configuration (Securely using .env credentials)[cite: 1]
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Generic Upload Endpoint with Sharp Optimization & Secure Cloudinary Stream
router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ success: false, message: 'No file uploaded or file buffer is missing' });
    }

    // Step 1: Compress and optimize image using shared Sharp utility
    let optimizedBuffer;
    try {
      optimizedBuffer = await optimizeImage(req.file.buffer);
    } catch (sharpError) {
      return res.status(400).json({ 
        success: false, 
        message: sharpError.message || 'Compression failure occurred during image processing.' 
      });
    }

    // Step 2: Stream upload optimized image directly to Cloudinary
    const uploadToCloudinary = (buffer) => {
      return new Promise((resolve, reject) => {
        const folderName = req.body.folder || 'ram-sewa-samiti'; // Optional custom folder support
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: folderName,
            resource_type: 'image',
            format: 'webp',
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(buffer);
      });
    };

    let cloudinaryResult;
    try {
      cloudinaryResult = await uploadToCloudinary(optimizedBuffer);
    } catch (cloudError) {
      return res.status(502).json({ 
        success: false, 
        message: 'Cloudinary upload failure. Please try again later.',
        error: cloudError.message 
      });
    }

    // Step 3: Return Cloudinary secure URL and public ID[cite: 1]
    return res.status(200).json({
      success: true,
      message: 'Image successfully optimized and uploaded',
      url: cloudinaryResult.secure_url,
      publicId: cloudinaryResult.public_id,
    });

  } catch (error) {
    console.error('Upload Endpoint Error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Internal server error during upload.',
      error: error.message 
    });
  }
});

module.exports = router;