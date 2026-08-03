import { Router } from 'express';
import { getInventory, getLowStockInventory, updateInventory } from '../controllers/inventory.controller';
import { authenticate, authorizeAdmin } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate, authorizeAdmin);

router.get('/', getInventory);
router.get('/low-stock', getLowStockInventory);
router.put('/:variantId', updateInventory);

export default router;
