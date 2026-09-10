import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Product } from '../models/Product.js';

dotenv.config();

const products = [
  {
    name: 'Oat Extract 06% Gentle Cleanser',
    brand: 'Minimalist',
    category: 'cleanser',
    activeIngredients: ['Oat Extract', 'Bisabolol'],
    volumeMl: 120,
    usagePerApplicationMl: 2
  },
  {
    name: 'Niacinamide 10% Face Serum',
    brand: 'Minimalist',
    category: 'serum',
    activeIngredients: ['Niacinamide', 'Zinc'],
    volumeMl: 30,
    usagePerApplicationMl: 0.5
  },
  {
    name: 'Salicylic Acid 2% Serum',
    brand: 'Minimalist',
    category: 'serum',
    activeIngredients: ['Salicylic Acid'],
    volumeMl: 30,
    usagePerApplicationMl: 0.5
  },
  {
    name: 'Green Tea Pore Cleansing Face Wash',
    brand: 'Plum',
    category: 'cleanser',
    activeIngredients: ['Green Tea', 'Glycolic Acid'],
    volumeMl: 120,
    usagePerApplicationMl: 2
  },
  {
    name: '10% Niacinamide Face Serum with Rice Water',
    brand: 'Plum',
    category: 'serum',
    activeIngredients: ['Niacinamide', 'Rice Water Extract'],
    volumeMl: 30,
    usagePerApplicationMl: 0.5
  },
  {
    name: 'Ceramide & Vitamin C Sunscreen',
    brand: 'Dr. Sheth\'s',
    category: 'sunscreen',
    activeIngredients: ['Ceramides', 'Vitamin C'],
    volumeMl: 50,
    usagePerApplicationMl: 2
  },
  {
    name: 'Haldi & Hyaluronic Acid Oil-Free Moisturizer',
    brand: 'Dr. Sheth\'s',
    category: 'moisturizer',
    activeIngredients: ['Haldi', 'Hyaluronic Acid'],
    volumeMl: 50,
    usagePerApplicationMl: 1.5
  },
  {
    name: '1% Hyaluronic Sunscreen Aqua Gel',
    brand: 'The Derma Co',
    category: 'sunscreen',
    activeIngredients: ['Hyaluronic Acid', 'Vitamin E'],
    volumeMl: 50,
    usagePerApplicationMl: 2
  },
  {
    name: '10% Vitamin C Face Serum',
    brand: 'The Derma Co',
    category: 'serum',
    activeIngredients: ['Vitamin C', 'Niacinamide'],
    volumeMl: 30,
    usagePerApplicationMl: 0.5
  },
  {
    name: '72 HR Hydrating Gel + Probiotics',
    brand: 'Dot & Key',
    category: 'moisturizer',
    activeIngredients: ['Hyaluronic Acid', 'Probiotics'],
    volumeMl: 60,
    usagePerApplicationMl: 2
  },
  {
    name: 'Vitamin C + E Super Bright Sunscreen',
    brand: 'Dot & Key',
    category: 'sunscreen',
    activeIngredients: ['Vitamin C', 'Vitamin E'],
    volumeMl: 50,
    usagePerApplicationMl: 2
  },
  {
    name: 'Ultra Matte Dry Touch Sunscreen Gel SPF 50',
    brand: 'Re\'equil',
    category: 'sunscreen',
    activeIngredients: ['Zinc Oxide', 'Titanium Dioxide'],
    volumeMl: 50,
    usagePerApplicationMl: 2
  },
  {
    name: 'Oil Free Moisturiser',
    brand: 'Re\'equil',
    category: 'moisturizer',
    activeIngredients: ['Ceramides', 'Hyaluronic Acid'],
    volumeMl: 100,
    usagePerApplicationMl: 2
  },
  {
    name: 'Glow Hero Vitamin C Serum',
    brand: 'Foxtale',
    category: 'serum',
    activeIngredients: ['L-Ascorbic Acid'],
    volumeMl: 30,
    usagePerApplicationMl: 0.5
  },
  {
    name: 'Hydrate & Plump Sunscreen',
    brand: 'Aqualogica',
    category: 'sunscreen',
    activeIngredients: ['Watermelon Extract', 'Hyaluronic Acid'],
    volumeMl: 50,
    usagePerApplicationMl: 2
  },
  {
    name: 'Ubtan Face Wash with Turmeric & Saffron',
    brand: 'Mamaearth',
    category: 'cleanser',
    activeIngredients: ['Turmeric', 'Saffron'],
    volumeMl: 100,
    usagePerApplicationMl: 2
  },
  {
    name: 'Centella Green Tea Face Wash',
    brand: 'Suganda',
    category: 'cleanser',
    activeIngredients: ['Centella Asiatica', 'Green Tea'],
    volumeMl: 120,
    usagePerApplicationMl: 2
  },
  {
    name: 'White Lotus Moisturizer',
    brand: 'Suganda',
    category: 'moisturizer',
    activeIngredients: ['White Lotus Extract', 'Niacinamide'],
    volumeMl: 50,
    usagePerApplicationMl: 1.5
  }
];

const seedProducts = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/skincycle';
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    await Product.deleteMany({});
    console.log('Cleared existing products');

    await Product.insertMany(products);
    console.log('Successfully seeded products!');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
};

seedProducts();
