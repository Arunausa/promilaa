import { Router } from 'express';
import { getWishlist, toggleWishlist } from '../controllers/wishlist.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticateToken);
router.get('/', getWishlist);
router.post('/toggle', toggleWishlist);

export default router;
