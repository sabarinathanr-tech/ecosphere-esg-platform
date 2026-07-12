// Cloudinary configuration (optional)
// If CLOUDINARY_* env vars are not set, uploads will use local storage

import { logger } from '../utils/logger';

interface CloudinaryConfig {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
  isConfigured: boolean;
}

export const cloudinaryConfig: CloudinaryConfig = {
  cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
  apiKey: process.env.CLOUDINARY_API_KEY || '',
  apiSecret: process.env.CLOUDINARY_API_SECRET || '',
  isConfigured: !!(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  ),
};

if (cloudinaryConfig.isConfigured) {
  logger.info('✅ Cloudinary configured for file uploads');
} else {
  logger.info('ℹ️  Cloudinary not configured — using local file storage');
}

export async function uploadToCloudinary(
  buffer: Buffer,
  folder: string,
  resourceType: 'image' | 'raw' = 'image'
): Promise<{ url: string; publicId: string } | null> {
  if (!cloudinaryConfig.isConfigured) {
    logger.warn('Cloudinary not configured, skipping upload');
    return null;
  }

  // Dynamic import to avoid errors when cloudinary package is not installed
  try {
    const cloudinary = require('cloudinary').v2;
    cloudinary.config({
      cloud_name: cloudinaryConfig.cloudName,
      api_key: cloudinaryConfig.apiKey,
      api_secret: cloudinaryConfig.apiSecret,
    });

    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder, resource_type: resourceType }, (error: any, result: any) => {
          if (error) reject(error);
          else resolve({ url: result.secure_url, publicId: result.public_id });
        })
        .end(buffer);
    });
  } catch (error) {
    logger.error('Cloudinary upload failed:', error);
    return null;
  }
}
