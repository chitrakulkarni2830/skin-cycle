import mongoose from 'mongoose';

const routineSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  timeOfDay: { type: String, enum: ['AM', 'PM'], required: true },
  steps: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    order: { type: Number, required: true }
  }],
  conflicts: [{
    ingredientA: String,
    ingredientB: String,
    severity: String,
    reason: String,
    recommendation: String
  }]
}, { timestamps: true });

routineSchema.index({ userId: 1 });

export const Routine = mongoose.model('Routine', routineSchema);
