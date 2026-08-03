import { Router } from 'express';
import multer from 'multer';
import { 
  getProducts, 
  getProductBySlug, 
  createProduct, 
  updateProduct, 
  deleteProduct,
  uploadProductImage,
  searchProducts
} from '../controllers/product.controller';
import { authenticateToken, requireRole } from '../middleware/auth.middleware';

const router = Router();

// Configure multer for memory storage (we'll stream the buffer to R2)
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  }
});

// Public routes
router.get('/search', searchProducts);
router.get('/', getProducts);
router.get('/:slug', getProductBySlug);

// Admin-only routes
router.post('/', authenticateToken, requireRole(['ADMIN']), createProduct);
router.put('/:id', authenticateToken, requireRole(['ADMIN']), updateProduct);
router.delete('/:id', authenticateToken, requireRole(['ADMIN']), deleteProduct);

// Image Upload (Admin only)
router.post('/images', authenticateToken, requireRole(['ADMIN']), upload.single('image'), uploadProductImage);

export default router;
