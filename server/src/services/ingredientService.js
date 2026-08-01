import { Ingredient } from '../models/Ingredient.js';
import { IngredientConflict } from '../models/IngredientConflict.js';
import { NotFoundError } from '../utils/errors.js';

export class IngredientService {
  static async getIngredients() {
    return await Ingredient.find().lean();
  }

  static async getConflictsForIngredient(ingredientId) {
    const conflicts = await IngredientConflict.find({
      $or: [
        { ingredientA: ingredientId },
        { ingredientB: ingredientId }
      ]
    })
    .populate('ingredientA', 'name')
    .populate('ingredientB', 'name')
    .lean();
    
    return conflicts.map(c => ({
      ingredientA: c.ingredientA.name,
      ingredientB: c.ingredientB.name,
      severity: c.severity,
      reason: c.reason,
      recommendation: c.recommendation
    }));
  }

  static async addConflictRule(conflictData) {
    const conflict = await IngredientConflict.create(conflictData);
    return conflict;
  }
}
