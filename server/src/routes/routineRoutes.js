import express from 'express';
import { RoutineController } from '../controllers/routineController.js';
import { validate } from '../middleware/validate.js';
import { protect } from '../middleware/authMiddleware.js';
import { createRoutineSchema, updateRoutineSchema } from '../validators/routineValidators.js';

const router = express.Router();

router.use(protect); // All routine routes are protected

router.get('/', RoutineController.getRoutines);
router.get('/:id', RoutineController.getRoutineById);
router.post('/', validate(createRoutineSchema), RoutineController.createRoutine);
router.patch('/:id', validate(updateRoutineSchema), RoutineController.updateRoutine);
router.delete('/:id', RoutineController.deleteRoutine);

export default router;
