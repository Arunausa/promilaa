import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import sharp from 'sharp';

const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
const accessKeyId = process.env.CLOUDFLARE_ACCESS_KEY_ID;
const secretAccessKey = process.env.CLOUDFLARE_SECRET_ACCESS_KEY;
const endpoint = process.env.CLOUDFLARE_ENDPOINT;
const bucketName = process.env.CLOUDFLARE_BUCKET_NAME || 'promilaa';

if (!accountId || !accessKeyId || !secretAccessKey || !endpoint) {
  console.warn('Cloudflare R2 credentials are not fully configured in the environment.');
}

export const s3 = new S3Client({
  region: 'auto',
  endpoint: endpoint || `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: accessKeyId || '',
    secretAccessKey: secretAccessKey || '',
  },
});

/**
 * Automatically resizes, compresses, and uploads a file buffer to Cloudflare R2.
 * High-performance image compression via Sharp (80-90% size reduction with HD visual quality).
 */
export const uploadImage = async (
  fileBuffer: Buffer,
  originalName: string,
  mimetype: string,
  folder: string = 'products'
): Promise<string> => {
  let finalBuffer = fileBuffer;
  let finalMimeType = mimetype;
  let ext = path.extname(originalName).toLowerCase();

  // Compress image if it is a JPEG, PNG, or WebP file
  if (mimetype.startsWith('image/')) {
    try {
      const isPng = mimetype === 'image/png';
      
      let sharpInstance = sharp(fileBuffer)
        .resize({ width: 1400, height: 1800, fit: 'inside', withoutEnlargement: true });

      if (isPng) {
        finalBuffer = await sharpInstance.png({ quality: 82, compressionLevel: 8 }).toBuffer();
      } else {
        // Convert / Compress to optimized JPEG / WebP
        finalBuffer = await sharpInstance.jpeg({ quality: 82, mozjpeg: true }).toBuffer();
        finalMimeType = 'image/jpeg';
        ext = '.jpg';
      }
      console.log(`[R2 Upload] Auto-compressed image from ${(fileBuffer.length / 1024).toFixed(1)} KB to ${(finalBuffer.length / 1024).toFixed(1)} KB!`);
    } catch (err: any) {
      console.warn('[R2 Upload] Image compression skipped due to error, using original buffer:', err.message);
      finalBuffer = fileBuffer;
    }
  }

  const uniqueFilename = `${folder}/${uuidv4()}${ext}`;

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: uniqueFilename,
    Body: finalBuffer,
    ContentType: finalMimeType,
  });

  await s3.send(command);

  const publicBaseUrl = process.env.CLOUDFLARE_PUBLIC_URL || `${endpoint}/${bucketName}`;
  return `${publicBaseUrl}/${uniqueFilename}`;
};
