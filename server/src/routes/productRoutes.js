import express from 'express';
import { ProductController } from '../controllers/productController.js';
import { validate } from '../middleware/validate.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { createProductSchema, updateProductSchema } from '../validators/productValidators.js';

const router = express.Router();

// Public routes
router.get('/', ProductController.getProducts);
router.get('/:id', ProductController.getProductById);

// Admin only routes
router.post('/', protect, authorize('admin'), validate(createProductSchema), ProductController.createProduct);
router.patch('/:id', protect, authorize('admin'), validate(updateProductSchema), ProductController.updateProduct);

export default router;
