const sharp = require('sharp');

/**
 * Reusable Image Optimizer Utility using Sharp
 * - Validates image format
 * - Resizes to max 1000x1000 pixels (maintaining aspect ratio)
 * - Converts to WebP format
 * - Compresses target size between 200 KB and 400 KB
 */
async function optimizeImage(buffer) {
  let metadata;
  try {
    metadata = await sharp(buffer).metadata();
  } catch (err) {
    throw new Error('Compression failure: Uploaded file is not a valid image.');
  }

  if (!metadata || !['jpeg', 'jpg', 'png', 'webp', 'avif'].includes(metadata.format)) {
    throw new Error('Invalid file type. Only JPG, JPEG, PNG, WebP, and AVIF formats are accepted.');
  }

  // Resize large images to maximum dimension of 1000x1000 pixels
  let pipeline = sharp(buffer)
    .resize({
      width: 1000,
      height: 1000,
      fit: 'inside',
      withoutEnlargement: true,
    });

  const originalSizeKB = buffer.length / 1024;

  // If naturally smaller than 200 KB, do not bloat size unnecessarily
  if (originalSizeKB < 200) {
    return await pipeline.webp({ quality: 85 }).toBuffer();
  }

  let quality = 80;
  let compressedBuffer = null;
  let fileSizeKB = 0;

  // Iterative loop to target final size between 200 KB and 400 KB
  while (quality >= 20) {
    compressedBuffer = await pipeline.webp({ quality }).toBuffer();
    fileSizeKB = compressedBuffer.length / 1024;

    if (fileSizeKB >= 200 && fileSizeKB <= 400) {
      break; // Hit target range
    } else if (fileSizeKB > 400) {
      quality -= 10; // Reduce quality if above 400 KB
    } else if (fileSizeKB < 200) {
      if (quality < 80) quality += 5;
      compressedBuffer = await pipeline.webp({ quality }).toBuffer();
      break;
    }
  }

  return compressedBuffer;
}

module.exports = { optimizeImage };