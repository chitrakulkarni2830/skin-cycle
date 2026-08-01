import { Routine } from '../models/Routine.js';
import { Product } from '../models/Product.js';
import { Ingredient } from '../models/Ingredient.js';
import { CompatibilityService } from './compatibilityService.js';
import { NotFoundError } from '../utils/errors.js';

export class RoutineService {
  static async _calculateConflicts(productIds) {
    // 1. Fetch products to get their active ingredient names
    const products = await Product.find({ _id: { $in: productIds } }).lean();
    
    const activeIngredientNames = new Set();
    products.forEach(p => {
      if (p.activeIngredients) {
        p.activeIngredients.forEach(ing => activeIngredientNames.add(ing));
      }
    });

    if (activeIngredientNames.size < 2) return [];

    // 2. Map names to Ingredient ObjectIds for CompatibilityService
    const ingredients = await Ingredient.find({
      $or: [
        { name: { $in: Array.from(activeIngredientNames) } },
        { aliases: { $in: Array.from(activeIngredientNames) } }
      ]
    }).lean();

    const ingredientIds = ingredients.map(ing => ing._id);

    // 3. Get conflicts
    return await CompatibilityService.checkConflicts(ingredientIds);
  }

  static async getRoutines(userId) {
    return await Routine.find({ userId }).populate('steps.productId').lean();
  }

  static async getRoutineById(id, userId) {
    const routine = await Routine.findOne({ _id: id, userId }).populate('steps.productId').lean();
    if (!routine) throw new NotFoundError('Routine not found');
    return routine;
  }

  static async createRoutine(userId, routineData) {
    const productIds = routineData.steps.map(step => step.productId);
    const conflicts = await this._calculateConflicts(productIds);

    const routine = await Routine.create({
      ...routineData,
      userId,
      conflicts
    });

    return await Routine.findById(routine._id).populate('steps.productId').lean();
  }

  static async updateRoutine(id, userId, routineData) {
    const routine = await Routine.findOne({ _id: id, userId });
    if (!routine) throw new NotFoundError('Routine not found');

    if (routineData.name) routine.name = routineData.name;
    if (routineData.timeOfDay) routine.timeOfDay = routineData.timeOfDay;
    
    if (routineData.steps) {
      routine.steps = routineData.steps;
      const productIds = routineData.steps.map(step => step.productId);
      routine.conflicts = await this._calculateConflicts(productIds);
    }

    await routine.save();
    return await Routine.findById(routine._id).populate('steps.productId').lean();
  }

  static async deleteRoutine(id, userId) {
    const result = await Routine.findOneAndDelete({ _id: id, userId });
    if (!result) throw new NotFoundError('Routine not found');
    return { message: 'Routine deleted successfully' };
  }
}
