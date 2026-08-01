import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['cleanser', 'serum', 'moisturizer', 'sunscreen', 'treatment'],
    required: true 
  },
  activeIngredients: [{ type: String }],
  concentration: { 
    type: Map, 
    of: Number // e.g., { "Retinol": 1, "Niacinamide": 10 }
  },
  volumeMl: { type: Number, required: true },
  usagePerApplicationMl: { type: Number, required: true },
}, { timestamps: true });

// Text index for search functionality
productSchema.index({ name: 'text', brand: 'text' });
productSchema.index({ category: 1 });

export const Product = mongoose.model('Product', productSchema);
