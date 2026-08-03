import { Router } from 'express';
import { authenticateToken, requireRole } from '../middleware/auth.middleware';
import { createBanner, getBanners, updateBanner, deleteBanner } from '../controllers/banner.controller';

const router = Router();

// Public route to fetch banners for homepage/categories
router.get('/', getBanners);

// Admin only routes for managing banners
router.post('/', authenticateToken, requireRole(['ADMIN']), createBanner);
router.patch('/:id', authenticateToken, requireRole(['ADMIN']), updateBanner);
router.delete('/:id', authenticateToken, requireRole(['ADMIN']), deleteBanner);

export default router;
