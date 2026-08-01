import mongoose from 'mongoose';

const ingredientConflictSchema = new mongoose.Schema({
  ingredientA: { type: mongoose.Schema.Types.ObjectId, ref: 'Ingredient', required: true },
  ingredientB: { type: mongoose.Schema.Types.ObjectId, ref: 'Ingredient', required: true },
  severity: { type: String, enum: ['avoid', 'caution', 'space_out'], required: true },
  reason: { type: String, required: true },
  recommendation: { type: String, required: true }
});

// Ensure unique constraint for pairs (A, B)
ingredientConflictSchema.index({ ingredientA: 1, ingredientB: 1 }, { unique: true });

export const IngredientConflict = mongoose.model('IngredientConflict', ingredientConflictSchema);
