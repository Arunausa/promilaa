import { Router } from 'express';
import { getCategories, getCategoryBySlug, createCategory, updateCategory, deleteCategory } from '../controllers/category.controller';
import { authenticateToken, requireRole } from '../middleware/auth.middleware';

const router = Router();

// Public routes
router.get('/', getCategories);
router.get('/:slug', getCategoryBySlug);

// Admin-only routes
router.post('/', authenticateToken, requireRole(['ADMIN']), createCategory);
router.put('/:id', authenticateToken, requireRole(['ADMIN']), updateCategory);
router.delete('/:id', authenticateToken, requireRole(['ADMIN']), deleteCategory);

export default router;
