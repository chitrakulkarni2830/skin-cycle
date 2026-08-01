import { InventoryService } from '../services/inventoryService.js';

export class InventoryController {
  static async getInventory(req, res, next) {
    try {
      const result = await InventoryService.getInventory(req.user.id, req.query);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async getReminders(req, res, next) {
    try {
      const reminders = await InventoryService.getReminders(req.user.id);
      res.status(200).json({ reminders });
    } catch (error) {
      next(error);
    }
  }

  static async addOwnedProduct(req, res, next) {
    try {
      const item = await InventoryService.addOwnedProduct(req.user.id, req.body);
      res.status(201).json({ item });
    } catch (error) {
      next(error);
    }
  }

  static async logUsage(req, res, next) {
    try {
      const item = await InventoryService.logUsage(req.params.id, req.user.id, req.body);
      res.status(200).json({ item });
    } catch (error) {
      next(error);
    }
  }
}
