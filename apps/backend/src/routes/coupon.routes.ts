import { Router } from 'express';
import { getCoupons, createCoupon, validateCoupon } from '../controllers/coupon.controller';
import { authenticateToken, requireRole } from '../middleware/auth.middleware';

const router = Router();

// Customer
router.post('/validate', validateCoupon);

// Admin
router.use(authenticateToken, requireRole(['ADMIN', 'STAFF']));
router.get('/', getCoupons);
router.post('/', createCoupon);

export default router;
