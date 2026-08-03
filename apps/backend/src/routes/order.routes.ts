import { Router } from 'express';
import { createOrder, getMyOrders, trackOrder } from '../controllers/order.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

const optionalAuth = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authenticateToken(req, res, next);
  }
  next();
};

router.post('/', optionalAuth, createOrder);
router.get('/my-orders', authenticateToken, getMyOrders);
router.get('/track', trackOrder); // Public — phone + orderNumber query

export default router;
