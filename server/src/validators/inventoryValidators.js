import { z } from 'zod';

export const addInventorySchema = z.object({
  body: z.object({
    productId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Product ID'),
    purchaseDate: z.string().datetime().optional()
  }),
});

export const logUsageSchema = z.object({
  body: z.object({
    amountUsedMl: z.number().positive().optional()
  }),
});
