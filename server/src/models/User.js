import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Hashed
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  skinProfile: {
    skinType: { type: String, enum: ['oily', 'dry', 'combination', 'sensitive', 'normal'], default: 'normal' },
    concerns: [{ type: String }],
    allergies: [{ type: String }]
  },
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
