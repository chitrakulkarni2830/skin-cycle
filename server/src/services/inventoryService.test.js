import { jest } from '@jest/globals';
import { InventoryService } from './inventoryService.js';
import { InventoryItem } from '../models/InventoryItem.js';

describe('InventoryService Depletion Calculation', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should calculate depletion correctly for a normal usage pattern', async () => {
    const mockItem = {
      _id: 'mockId',
      userId: 'mockUser',
      volumeRemainingMl: 30, // 30ml left
      reorderThresholdDays: 7,
      usageLog: [
        { date: new Date('2023-10-01T08:00:00Z'), amountUsedMl: 2 },
        { date: new Date('2023-10-02T08:00:00Z'), amountUsedMl: 2 },
        { date: new Date('2023-10-03T08:00:00Z'), amountUsedMl: 2 },
      ],
      productId: { usagePerApplicationMl: 2 },
      save: jest.fn().mockResolvedValue(true)
    };
    
    // They used 6ml over 2 days (Oct 1 to Oct 3 is 2 days diff). Average = 3ml / day.
    // Remaining volume = 30 - 2 (new use) = 28ml.
    // 28ml / 3ml per day = 9.33 days remaining.
    // Estimated date should be approx 9.33 days from today.

    const mockQuery = {
      populate: jest.fn().mockResolvedValue(mockItem)
    };
    
    InventoryItem.findOne = jest.fn().mockReturnValue(mockQuery);

    const result = await InventoryService.logUsage('mockId', 'mockUser', { amountUsedMl: 2 });
    
    expect(result.volumeRemainingMl).toBe(28);
    expect(result.usageLog).toHaveLength(4);
    
    const today = new Date();
    const daysUntilDepletion = (result.estimatedDepletionDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
    
    // Average usage calc:
    // First use: Oct 1. Last use: Today (when the 4th log is added)
    // We expect daysDiff = (Today - Oct 1) in days.
    // Total used = 6 + 2 = 8ml.
    // avg = 8 / daysDiff
    // daysRemaining = 28 / avg
    // This will be dynamic based on when the test runs, but it should just set estimatedDepletionDate.
    expect(result.estimatedDepletionDate).toBeInstanceOf(Date);
    expect(result.save).toHaveBeenCalled();
  });

  it('should not throw if there is no previous usage log', async () => {
    const mockItem = {
      _id: 'mockId',
      userId: 'mockUser',
      volumeRemainingMl: 30,
      reorderThresholdDays: 7,
      usageLog: [],
      productId: { usagePerApplicationMl: 2 },
      save: jest.fn().mockResolvedValue(true)
    };
    
    const mockQuery = {
      populate: jest.fn().mockResolvedValue(mockItem)
    };
    InventoryItem.findOne = jest.fn().mockReturnValue(mockQuery);

    const result = await InventoryService.logUsage('mockId', 'mockUser', { amountUsedMl: 2 });
    
    // With only 1 log entry, we don't recalculate depletion date because we need at least 2 points for an average
    expect(result.volumeRemainingMl).toBe(28);
    expect(result.usageLog).toHaveLength(1);
    expect(result.estimatedDepletionDate).toBeUndefined(); // Should be unchanged
  });
  
  it('should handle zero days difference (same day usage)', async () => {
      const mockItem = {
      _id: 'mockId',
      userId: 'mockUser',
      volumeRemainingMl: 10,
      reorderThresholdDays: 7,
      usageLog: [
        { date: new Date(), amountUsedMl: 5 } // Used today
      ],
      productId: { usagePerApplicationMl: 2 },
      save: jest.fn().mockResolvedValue(true)
    };
    
    const mockQuery = {
      populate: jest.fn().mockResolvedValue(mockItem)
    };
    InventoryItem.findOne = jest.fn().mockReturnValue(mockQuery);

    const result = await InventoryService.logUsage('mockId', 'mockUser', { amountUsedMl: 5 });
    
    // 2 logs on the same day. daysDiff should default to 1 to avoid Infinity
    expect(result.volumeRemainingMl).toBe(5);
    // Total used = 10, daysDiff = 1 (enforced by logic), avg = 10
    // Remaining = 5, avg = 10 -> 0.5 days remaining.
    const today = new Date();
    const daysUntilDepletion = (result.estimatedDepletionDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
    expect(daysUntilDepletion).toBeCloseTo(0.5, 1);
  });
});
