import { Router } from 'express';
import { submitPaymentProof, getPendingPayments, verifyPayment } from '../controllers/payment.controller';
import { authenticateToken, requireRole } from '../middleware/auth.middleware';

const router = Router();

// Customer Route
// In a fully secure app, we'd ensure the user owns the order. For simplicity/guest access, we allow ID-based updates.
router.patch('/orders/:orderId/proof', submitPaymentProof);

// Admin Routes
router.use(authenticateToken, requireRole(['ADMIN', 'STAFF']));
router.get('/pending', getPendingPayments);
router.patch('/orders/:orderId/verify', verifyPayment);

export default router;
