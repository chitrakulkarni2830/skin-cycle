import mongoose from 'mongoose';

const reorderRuleSchema = new mongoose.Schema({
  productCategory: { 
    type: String, 
    enum: ['cleanser', 'serum', 'moisturizer', 'sunscreen', 'treatment'],
    required: true,
    unique: true
  },
  defaultFrequencyPerWeek: { type: Number, required: true },
  reminderLeadTimeDays: { type: Number, required: true }
});

export const ReorderRule = mongoose.model('ReorderRule', reorderRuleSchema);
