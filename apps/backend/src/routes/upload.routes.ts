import { Router } from 'express';
import multer from 'multer';
import { authenticate } from '../middleware/auth.middleware';
import { uploadImage } from '../services/r2.service';

const router = Router();

// Use memory storage — files stay in buffer, no temp disk files
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max for videos & HD photos
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'video/mp4', 'video/webm'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG, PNG, WebP images and MP4, WebM videos are allowed'));
    }
  }
});

// POST /api/upload/image — upload product/banner images (Admin only)
router.post('/image', authenticate, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    const folder = (req.query.folder as string) || 'products';
    const url = await uploadImage(req.file.buffer, req.file.originalname, req.file.mimetype, folder);
    res.json({ success: true, url });
  } catch (error: any) {
    console.error('Image upload error:', error);
    res.status(500).json({ success: false, message: error.message || 'Upload failed' });
  }
});

// POST /api/upload/payment-proof — upload bKash/Nagad proof (Guest allowed)
router.post('/payment-proof', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    const url = await uploadImage(req.file.buffer, req.file.originalname, req.file.mimetype, 'payment-proofs');
    res.json({ success: true, url });
  } catch (error: any) {
    console.error('Payment proof upload error:', error);
    res.status(500).json({ success: false, message: error.message || 'Upload failed' });
  }
});

export default router;
