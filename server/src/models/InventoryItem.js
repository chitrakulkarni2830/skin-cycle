import mongoose from 'mongoose';

const inventoryItemSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  purchaseDate: { type: Date, default: Date.now },
  volumeRemainingMl: { type: Number, required: true },
  usageLog: [{ 
    date: { type: Date, default: Date.now }, 
    amountUsedMl: { type: Number, required: true } 
  }],
  estimatedDepletionDate: { type: Date },
  reorderThresholdDays: { type: Number },
  reorderReminderSent: { type: Boolean, default: false }
}, { timestamps: true });

inventoryItemSchema.index({ userId: 1 });
inventoryItemSchema.index({ estimatedDepletionDate: 1 });

export const InventoryItem = mongoose.model('InventoryItem', inventoryItemSchema);
