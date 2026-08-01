import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Ingredient } from '../models/Ingredient.js';
import { IngredientConflict } from '../models/IngredientConflict.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/skincycle';

const ingredientsData = [
  { name: 'Retinol', aliases: ['Vitamin A', 'Retinoid'] },
  { name: 'Vitamin C', aliases: ['Ascorbic Acid', 'L-Ascorbic Acid'] },
  { name: 'AHA', aliases: ['Glycolic Acid', 'Lactic Acid', 'Alpha Hydroxy Acid'] },
  { name: 'BHA', aliases: ['Salicylic Acid', 'Beta Hydroxy Acid'] },
  { name: 'Benzoyl Peroxide', aliases: ['BPO'] },
  { name: 'Niacinamide', aliases: ['Vitamin B3', 'Nicotinamide'] },
  { name: 'Hyaluronic Acid', aliases: ['HA', 'Sodium Hyaluronate'] },
  { name: 'Peptides', aliases: ['Copper Peptides'] },
  { name: 'Azelaic Acid', aliases: [] },
  { name: 'Hydroquinone', aliases: [] },
  { name: 'Ceramides', aliases: [] },
  { name: 'Centella Asiatica', aliases: ['Cica'] },
  { name: 'Bakuchiol', aliases: [] }
];

const conflictsData = [
  {
    ingA: 'Retinol', ingB: 'Vitamin C',
    severity: 'caution',
    reason: 'Both can irritate when layered, as they operate at different optimal pH levels.',
    recommendation: 'Use Vitamin C in the AM and Retinol in the PM.'
  },
  {
    ingA: 'Retinol', ingB: 'AHA',
    severity: 'avoid',
    reason: 'Risk of severe over-exfoliation and compromised skin barrier.',
    recommendation: 'Use on alternate nights, never in the same routine.'
  },
  {
    ingA: 'Retinol', ingB: 'BHA',
    severity: 'avoid',
    reason: 'Risk of over-exfoliation and irritation.',
    recommendation: 'Use on alternate nights.'
  },
  {
    ingA: 'Benzoyl Peroxide', ingB: 'Retinol',
    severity: 'avoid',
    reason: 'Benzoyl peroxide can deactivate some forms of retinol and significantly increase irritation.',
    recommendation: 'Use BP in the AM and Retinol in the PM.'
  },
  {
    ingA: 'Niacinamide', ingB: 'Vitamin C',
    severity: 'caution',
    reason: 'Historically thought to destabilize each other, but modern formulations are often fine. Can cause flushing in sensitive skin.',
    recommendation: 'Layer cautiously. If flushing occurs, separate into AM and PM routines.'
  },
  {
    ingA: 'AHA', ingB: 'BHA',
    severity: 'caution',
    reason: 'Multiple exfoliating acids stacked can lead to a damaged skin barrier.',
    recommendation: 'Look for pre-formulated blends instead of layering separate products, or alternate days.'
  },
  {
    ingA: 'Vitamin C', ingB: 'AHA',
    severity: 'caution',
    reason: 'Both are acids; using them together can be too irritating for some.',
    recommendation: 'Separate into AM (Vit C) and PM (AHA), or alternate days.'
  },
  {
    ingA: 'Vitamin C', ingB: 'BHA',
    severity: 'caution',
    reason: 'Both are acids; using them together can be too irritating for some.',
    recommendation: 'Separate into AM (Vit C) and PM (BHA), or alternate days.'
  },
  {
    ingA: 'Benzoyl Peroxide', ingB: 'Vitamin C',
    severity: 'avoid',
    reason: 'Benzoyl peroxide can oxidize and deactivate Vitamin C.',
    recommendation: 'Space out applications (AM vs PM).'
  },
  {
    ingA: 'Retinol', ingB: 'Peptides',
    severity: 'caution',
    reason: 'Retinol might degrade certain sensitive peptides like copper peptides.',
    recommendation: 'Alternate nights or use in different routines.'
  },
  {
    ingA: 'Vitamin C', ingB: 'Peptides',
    severity: 'caution',
    reason: 'Low pH of Vitamin C can destabilize copper peptides.',
    recommendation: 'Space out applications.'
  },
  {
    ingA: 'Benzoyl Peroxide', ingB: 'AHA',
    severity: 'avoid',
    reason: 'Extreme irritation and dryness risk.',
    recommendation: 'Do not use in the same routine.'
  },
  {
    ingA: 'Benzoyl Peroxide', ingB: 'BHA',
    severity: 'avoid',
    reason: 'High risk of skin barrier damage and dryness.',
    recommendation: 'Do not use in the same routine.'
  },
  {
    ingA: 'AHA', ingB: 'Peptides',
    severity: 'caution',
    reason: 'Acids can break down the structure of some peptides, rendering them less effective.',
    recommendation: 'Use acids in the PM and peptides in the AM.'
  },
  {
    ingA: 'Hydroquinone', ingB: 'Benzoyl Peroxide',
    severity: 'avoid',
    reason: 'Can cause temporary staining of the skin.',
    recommendation: 'Avoid using together completely.'
  },
  {
    ingA: 'Azelaic Acid', ingB: 'Retinol',
    severity: 'caution',
    reason: 'Both increase cell turnover; can cause irritation if not acclimated.',
    recommendation: 'Use cautiously, preferably separating AM/PM if sensitive.'
  },
  {
    ingA: 'Azelaic Acid', ingB: 'AHA',
    severity: 'caution',
    reason: 'Can be overly irritating for sensitive skin.',
    recommendation: 'Alternate days.'
  },
  {
    ingA: 'Azelaic Acid', ingB: 'BHA',
    severity: 'caution',
    reason: 'Can be overly drying.',
    recommendation: 'Monitor skin closely, space out if dry.'
  },
  {
    ingA: 'Hydroquinone', ingB: 'AHA',
    severity: 'caution',
    reason: 'While often combined for efficacy, it increases irritation risk significantly.',
    recommendation: 'Follow dermatologist instructions, use sun protection.'
  },
  {
    ingA: 'Niacinamide', ingB: 'AHA',
    severity: 'caution',
    reason: 'Niacinamide works best at neutral pH, AHA is low pH. Niacinamide can convert to niacin and cause flushing.',
    recommendation: 'Wait 30 mins between applications or split AM/PM.'
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await IngredientConflict.deleteMany({});
    await Ingredient.deleteMany({});
    console.log('Cleared existing ingredients and conflicts');

    // Insert ingredients
    const insertedIngredients = await Ingredient.insertMany(ingredientsData);
    console.log(`Inserted ${insertedIngredients.length} ingredients`);

    // Create a map for quick ObjectId lookup
    const ingredientMap = {};
    insertedIngredients.forEach(ing => {
      ingredientMap[ing.name] = ing._id;
    });

    // Prepare conflict records
    const conflictsToInsert = conflictsData.map(conflict => {
      const ingAId = ingredientMap[conflict.ingA];
      const ingBId = ingredientMap[conflict.ingB];

      if (!ingAId || !ingBId) {
         console.warn(`Warning: Could not find ObjectId for ${conflict.ingA} or ${conflict.ingB}`);
      }

      // Ensure consistent ordering so (A, B) is always the same as (B, A) in the DB if we want, 
      // but the app logic can handle bi-directional checking.
      // We will sort them alphabetically by ID to enforce uniqueness and simplicity.
      const idA = ingAId.toString();
      const idB = ingBId.toString();

      return {
        ingredientA: idA < idB ? ingAId : ingBId,
        ingredientB: idA < idB ? ingBId : ingAId,
        severity: conflict.severity,
        reason: conflict.reason,
        recommendation: conflict.recommendation
      };
    });

    const insertedConflicts = await IngredientConflict.insertMany(conflictsToInsert);
    console.log(`Inserted ${insertedConflicts.length} conflict rules`);

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

seedDatabase();
