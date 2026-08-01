import { IngredientConflict } from '../models/IngredientConflict.js';

export class CompatibilityService {
  /**
   * Checks for conflicts between a list of ingredient IDs.
   * @param {Array<string>} ingredientIds - Array of ObjectId strings or Mongoose ObjectIds
   * @returns {Promise<Array<Object>>} - Array of conflict objects formatted for the routine
   */
  static async checkConflicts(ingredientIds) {
    if (!ingredientIds || ingredientIds.length < 2) {
      return [];
    }

    // Find all conflicts where both ingredients in the rule are present in the provided list
    const conflicts = await IngredientConflict.find({
      $and: [
        { ingredientA: { $in: ingredientIds } },
        { ingredientB: { $in: ingredientIds } }
      ]
    })
      .populate('ingredientA', 'name')
      .populate('ingredientB', 'name')
      .lean();

    // Map to a clean format
    return conflicts.map(c => ({
      ingredientA: c.ingredientA.name,
      ingredientB: c.ingredientB.name,
      severity: c.severity,
      reason: c.reason,
      recommendation: c.recommendation
    }));
  }
}
