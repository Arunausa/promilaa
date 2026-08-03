import { Router } from 'express';
import { authenticateToken, requireRole } from '../middleware/auth.middleware';
import { 
  getStats, 
  getOrders, 
  updateOrderStatus,
  updatePaymentStatus,
  getCustomers,
  toggleBlockCustomer
} from '../controllers/admin.controller';

const router = Router();

// Protect all admin routes
router.use(authenticateToken, requireRole(['ADMIN', 'STAFF']));

router.get('/stats', getStats);
router.get('/orders', getOrders);
router.patch('/orders/:id/status', updateOrderStatus);
router.patch('/payments/:orderId/status', updatePaymentStatus);

// Customers
router.get('/customers', getCustomers);
router.patch('/customers/:id/block', toggleBlockCustomer);

export default router;
