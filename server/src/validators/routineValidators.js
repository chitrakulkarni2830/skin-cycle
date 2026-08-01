import { z } from 'zod';

export const createRoutineSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    timeOfDay: z.enum(['AM', 'PM']),
    steps: z.array(z.object({
      productId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Product ID'),
      order: z.number().int().min(1)
    })).min(1, 'Routine must have at least one step')
  }),
});

export const updateRoutineSchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    timeOfDay: z.enum(['AM', 'PM']).optional(),
    steps: z.array(z.object({
      productId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Product ID'),
      order: z.number().int().min(1)
    })).optional()
  }),
});
