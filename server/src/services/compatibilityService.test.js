import { jest } from '@jest/globals';
import { CompatibilityService } from './compatibilityService.js';
import { IngredientConflict } from '../models/IngredientConflict.js';

// Mock the find method on the model
IngredientConflict.find = jest.fn();

describe('CompatibilityService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return empty array if less than 2 ingredients are provided', async () => {
    const result1 = await CompatibilityService.checkConflicts([]);
    const result2 = await CompatibilityService.checkConflicts(['id1']);
    
    expect(result1).toEqual([]);
    expect(result2).toEqual([]);
    expect(IngredientConflict.find).not.toHaveBeenCalled();
  });

  it('should detect a single conflict between two ingredients', async () => {
    const mockConflict = {
      ingredientA: { name: 'Retinol' },
      ingredientB: { name: 'Vitamin C' },
      severity: 'caution',
      reason: 'Irritation risk.',
      recommendation: 'AM/PM split.'
    };

    const mockQuery = {
      populate: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValue([mockConflict])
    };
    
    IngredientConflict.find.mockReturnValue(mockQuery);

    const result = await CompatibilityService.checkConflicts(['id_retinol', 'id_vitc']);

    expect(IngredientConflict.find).toHaveBeenCalledWith({
      $and: [
        { ingredientA: { $in: ['id_retinol', 'id_vitc'] } },
        { ingredientB: { $in: ['id_retinol', 'id_vitc'] } }
      ]
    });
    
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      ingredientA: 'Retinol',
      ingredientB: 'Vitamin C',
      severity: 'caution',
      reason: 'Irritation risk.',
      recommendation: 'AM/PM split.'
    });
  });

  it('should detect multiple stacked conflicts', async () => {
    const mockConflicts = [
      {
        ingredientA: { name: 'Retinol' },
        ingredientB: { name: 'AHA' },
        severity: 'avoid',
        reason: 'Over-exfoliation.',
        recommendation: 'Alternate.'
      },
      {
        ingredientA: { name: 'AHA' },
        ingredientB: { name: 'BHA' },
        severity: 'caution',
        reason: 'Too many acids.',
        recommendation: 'Use blend.'
      }
    ];

    const mockQuery = {
      populate: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValue(mockConflicts)
    };
    
    IngredientConflict.find.mockReturnValue(mockQuery);

    const result = await CompatibilityService.checkConflicts(['id_retinol', 'id_aha', 'id_bha']);

    expect(result).toHaveLength(2);
    expect(result[0].ingredientA).toBe('Retinol');
    expect(result[1].ingredientB).toBe('BHA');
  });
  
  it('should detect bidirectional matches correctly regardless of input order', async () => {
    // The DB query using $in on both fields handles bidirectional matching inherently.
    // We just verify the query is constructed correctly.
    const mockQuery = {
      populate: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValue([])
    };
    IngredientConflict.find.mockReturnValue(mockQuery);

    await CompatibilityService.checkConflicts(['id_b', 'id_a']);
    
    expect(IngredientConflict.find).toHaveBeenCalledWith({
      $and: [
        { ingredientA: { $in: ['id_b', 'id_a'] } },
        { ingredientB: { $in: ['id_b', 'id_a'] } }
      ]
    });
  });
});
