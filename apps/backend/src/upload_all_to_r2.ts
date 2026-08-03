import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import prisma from './lib/prisma';

dotenv.config({ path: '../../.env' });

const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
const accessKeyId = process.env.CLOUDFLARE_ACCESS_KEY_ID;
const secretAccessKey = process.env.CLOUDFLARE_SECRET_ACCESS_KEY;
const endpoint = process.env.CLOUDFLARE_ENDPOINT;
const bucketName = process.env.CLOUDFLARE_BUCKET_NAME || 'promilaa';

console.log('Testing Cloudflare R2 credentials...');
console.log('Account ID:', accountId);
console.log('Endpoint:', endpoint);
console.log('Bucket:', bucketName);

if (!accountId || !accessKeyId || !secretAccessKey || !endpoint) {
  console.error('Missing Cloudflare R2 credentials in .env!');
  process.exit(1);
}

const s3 = new S3Client({
  region: 'auto',
  endpoint,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

async function uploadFile(filePath: string, key: string, contentType: string): Promise<string> {
  const fileBuffer = fs.readFileSync(filePath);
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: fileBuffer,
    ContentType: contentType,
  });

  await s3.send(command);
  
  // Public URL construction
  const publicUrl = process.env.CLOUDFLARE_PUBLIC_URL || `${endpoint}/${bucketName}/${key}`;
  return publicUrl;
}

async function main() {
  const mediaDir = path.resolve(__dirname, '../../frontend/public/media');
  console.log('Scanning media directory:', mediaDir);

  const filesToUpload: { localPath: string; key: string; mime: string }[] = [];

  function scan(dir: string, base: string) {
    const items = fs.readdirSync(dir);
    for (const item of items) {
      if (item === '.DS_Store') continue;
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        scan(fullPath, `${base}/${item}`);
      } else {
        let mime = 'image/jpeg';
        if (item.endsWith('.mp4')) mime = 'video/mp4';
        else if (item.endsWith('.png')) mime = 'image/png';

        const r2Key = `media/${base ? base + '/' : ''}${item}`;
        filesToUpload.push({ localPath: fullPath, key: r2Key, mime });
      }
    }
  }

  scan(mediaDir, '');

  console.log(`Found ${filesToUpload.length} files to upload to Cloudflare R2.`);

  let successCount = 0;
  for (const file of filesToUpload) {
    try {
      console.log(`Uploading ${file.key} (${file.mime})...`);
      const url = await uploadFile(file.localPath, file.key, file.mime);
      console.log(`✓ Uploaded: ${url}`);
      successCount++;
    } catch (err: any) {
      console.error(`✗ Failed to upload ${file.key}:`, err.message);
    }
  }

  console.log(`Finished uploading ${successCount}/${filesToUpload.length} files to Cloudflare R2!`);
}

main().catch(console.error);
