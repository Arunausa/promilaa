import { Router } from 'express';
import { checkFraud, getFraudHistory, getFraudReportByOrder, recheckFraud } from '../controllers/fraud.controller';
import { authenticate, authorizeAdmin } from '../middleware/auth.middleware';

const router = Router();

// All fraud routes require admin authentication
router.use(authenticate, authorizeAdmin);

router.post('/check', checkFraud);
router.get('/history', getFraudHistory);
router.get('/report/:orderId', getFraudReportByOrder);
router.post('/recheck', recheckFraud);

export default router;
