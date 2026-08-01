import { z } from 'zod';

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    brand: z.string().min(1, 'Brand is required'),
    category: z.enum(['cleanser', 'serum', 'moisturizer', 'sunscreen', 'treatment']),
    activeIngredients: z.array(z.string()).optional(),
    concentration: z.record(z.number()).optional(),
    volumeMl: z.number().positive(),
    usagePerApplicationMl: z.number().positive(),
  }),
});

export const updateProductSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    brand: z.string().optional(),
    category: z.enum(['cleanser', 'serum', 'moisturizer', 'sunscreen', 'treatment']).optional(),
    activeIngredients: z.array(z.string()).optional(),
    concentration: z.record(z.number()).optional(),
    volumeMl: z.number().positive().optional(),
    usagePerApplicationMl: z.number().positive().optional(),
  }),
});
