import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { User } from '../models/User.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/skincycle';

async function seedUser() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const email = 'demo@example.com';
    const password = 'password123';
    
    // Check if user already exists
    let user = await User.findOne({ email });
    
    if (user) {
      console.log('Demo user already exists. Email:', email);
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      
      user = new User({
        name: 'Demo User',
        email,
        password: hashedPassword,
        role: 'user'
      });
      
      await user.save();
      console.log('Created demo user! Email:', email, 'Password:', password);
    }
  } catch (error) {
    console.error('Error seeding user:', error);
  } finally {
    mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

seedUser();
