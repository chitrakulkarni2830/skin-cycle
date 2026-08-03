import express from 'express';
import { InventoryController } from '../controllers/inventoryController.js';
import { validate } from '../middleware/validate.js';
import { protect } from '../middleware/authMiddleware.js';
import { addInventorySchema, logUsageSchema } from '../validators/inventoryValidators.js';

const router = express.Router();

router.use(protect); // All inventory routes are protected

router.get('/', InventoryController.getInventory);
router.post('/', validate(addInventorySchema), InventoryController.addOwnedProduct);
router.delete('/:id', InventoryController.removeOwnedProduct);
router.patch('/:id/log-usage', validate(logUsageSchema), InventoryController.logUsage);
router.get('/reminders', InventoryController.getReminders);

export default router;
