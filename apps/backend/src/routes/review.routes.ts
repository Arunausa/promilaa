import { Router } from 'express';
import { createReview, getPendingReviews, approveReview } from '../controllers/review.controller';
import { authenticateToken, requireRole } from '../middleware/auth.middleware';

const router = Router();

// Customer
router.post('/', authenticateToken, createReview);

// Admin
router.get('/pending', authenticateToken, requireRole(['ADMIN', 'STAFF']), getPendingReviews);
router.patch('/:id/approve', authenticateToken, requireRole(['ADMIN', 'STAFF']), approveReview);

export default router;
