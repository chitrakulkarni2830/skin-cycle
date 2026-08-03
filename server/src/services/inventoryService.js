import { InventoryItem } from '../models/InventoryItem.js';
import { Product } from '../models/Product.js';
import { ReorderRule } from '../models/ReorderRule.js';
import { NotFoundError } from '../utils/errors.js';

export class InventoryService {
  static async getInventory(userId, query) {
    const { page = 1, limit = 10 } = query;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const items = await InventoryItem.find({ userId })
      .populate('productId')
      .skip(skip)
      .limit(limitNum)
      .lean();

    const total = await InventoryItem.countDocuments({ userId });

    return {
      data: items,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum)
      }
    };
  }

  static async getReminders(userId) {
    return await InventoryItem.find({
      userId,
      reorderReminderSent: true
    }).populate('productId').lean();
  }

  static async addOwnedProduct(userId, inventoryData) {
    const product = await Product.findById(inventoryData.productId);
    if (!product) throw new NotFoundError('Product not found');

    const rule = await ReorderRule.findOne({ productCategory: product.category });
    const reorderThresholdDays = rule ? rule.reminderLeadTimeDays : 7;
    const defaultFreq = rule ? rule.defaultFrequencyPerWeek : 7;

    const dailyUsageFreq = defaultFreq / 7;
    const daysToDeplete = Math.floor(product.volumeMl / (product.usagePerApplicationMl * dailyUsageFreq));
    
    const estimatedDepletionDate = new Date();
    estimatedDepletionDate.setDate(estimatedDepletionDate.getDate() + daysToDeplete);

    const item = await InventoryItem.create({
      userId,
      productId: inventoryData.productId,
      volumeRemainingMl: product.volumeMl,
      purchaseDate: inventoryData.purchaseDate || new Date(),
      estimatedDepletionDate,
      reorderThresholdDays
    });

    return item;
  }

  static async logUsage(itemId, userId, usageData) {
    const item = await InventoryItem.findOne({ _id: itemId, userId }).populate('productId');
    if (!item) throw new NotFoundError('Inventory item not found');

    const amountUsed = usageData.amountUsedMl || item.productId.usagePerApplicationMl;
    item.volumeRemainingMl -= amountUsed;
    if (item.volumeRemainingMl < 0) item.volumeRemainingMl = 0;

    item.usageLog.push({
      date: new Date(),
      amountUsedMl: amountUsed
    });

    // Recalculate depletion date
    if (item.usageLog.length > 1) {
      const firstUse = item.usageLog[0].date.getTime();
      const lastUse = item.usageLog[item.usageLog.length - 1].date.getTime();
      let daysDiff = (lastUse - firstUse) / (1000 * 60 * 60 * 24);
      if (daysDiff < 1) daysDiff = 1; // prevent divide by zero
      
      const totalUsed = item.usageLog.reduce((sum, log) => sum + log.amountUsedMl, 0);
      const avgDailyUsage = totalUsed / daysDiff;

      const daysRemaining = avgDailyUsage > 0 ? (item.volumeRemainingMl / avgDailyUsage) : 0;
      
      const newDepletionDate = new Date();
      newDepletionDate.setTime(newDepletionDate.getTime() + (daysRemaining * 24 * 60 * 60 * 1000));
      item.estimatedDepletionDate = newDepletionDate;
      
      // Reset reminder logic if we pushed out the date
      const daysUntilDepletion = (newDepletionDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24);
      if (daysUntilDepletion > item.reorderThresholdDays) {
        item.reorderReminderSent = false;
      }
    }

    await item.save();
    return item;
  }

  static async removeOwnedProduct(itemId, userId) {
    const item = await InventoryItem.findOneAndDelete({ _id: itemId, userId });
    if (!item) throw new NotFoundError('Inventory item not found');
    return item;
  }
}
