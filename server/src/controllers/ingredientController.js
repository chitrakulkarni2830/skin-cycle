import { IngredientService } from '../services/ingredientService.js';

export class IngredientController {
  static async getIngredients(req, res, next) {
    try {
      const ingredients = await IngredientService.getIngredients();
      res.status(200).json({ ingredients });
    } catch (error) {
      next(error);
    }
  }

  static async getConflictsForIngredient(req, res, next) {
    try {
      const conflicts = await IngredientService.getConflictsForIngredient(req.params.id);
      res.status(200).json({ conflicts });
    } catch (error) {
      next(error);
    }
  }

  static async addConflictRule(req, res, next) {
    try {
      const conflict = await IngredientService.addConflictRule(req.body);
      res.status(201).json({ conflict });
    } catch (error) {
      next(error);
    }
  }
}
