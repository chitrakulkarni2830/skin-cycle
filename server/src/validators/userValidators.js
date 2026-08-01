import { z } from 'zod';

export const updateSkinProfileSchema = z.object({
  body: z.object({
    skinType: z.enum(['oily', 'dry', 'combination', 'sensitive', 'normal']).optional(),
    concerns: z.array(z.string()).optional(),
    allergies: z.array(z.string()).optional(),
  }),
});
