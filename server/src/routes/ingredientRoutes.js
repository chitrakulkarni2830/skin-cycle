import express from 'express';
import { IngredientController } from '../controllers/ingredientController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', IngredientController.getIngredients);
router.get('/:id/conflicts', IngredientController.getConflictsForIngredient);

// Admin only route
router.post('/conflicts', protect, authorize('admin'), IngredientController.addConflictRule);

export default router;
