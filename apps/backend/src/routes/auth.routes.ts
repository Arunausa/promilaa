import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { register, login, refresh, logout, forgotPassword } from '../controllers/auth.controller';
import { authenticateToken, requireRole } from '../middleware/auth.middleware';

const router = Router();

// Rate limiting: max 5 requests per 15 minutes per IP for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 5,
  message: { error: 'Too many requests from this IP, please try again after 15 minutes' },
});

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.post('/forgot-password', authLimiter, forgotPassword);

// Example of a protected route using both middlewares (to be moved to relevant resource routers later)
router.get('/me', authenticateToken, (req, res) => {
  res.json({ user: req.user });
});

// Example of an admin-only route
router.get('/admin-only', authenticateToken, requireRole(['ADMIN', 'STAFF']), (req, res) => {
  res.json({ message: 'Welcome to the admin area.' });
});

export default router;
