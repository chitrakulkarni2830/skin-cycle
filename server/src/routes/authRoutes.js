import express from 'express';
import { AuthController } from '../controllers/authController.js';
import { validate } from '../middleware/validate.js';
import { protect } from '../middleware/authMiddleware.js';
import { registerSchema, loginSchema } from '../validators/authValidators.js';

const router = express.Router();

router.post('/register', validate(registerSchema), AuthController.register);
router.post('/login', validate(loginSchema), AuthController.login);
router.get('/me', protect, AuthController.getMe);

export default router;
