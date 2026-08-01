import express from 'express';
import { UserController } from '../controllers/userController.js';
import { validate } from '../middleware/validate.js';
import { protect } from '../middleware/authMiddleware.js';
import { updateSkinProfileSchema } from '../validators/userValidators.js';

const router = express.Router();

router.use(protect); // All user routes are protected

router.get('/:id/profile', UserController.getProfile);
router.patch('/:id/skin-profile', validate(updateSkinProfileSchema), UserController.updateSkinProfile);

export default router;
