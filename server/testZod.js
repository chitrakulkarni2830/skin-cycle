import { z } from 'zod';
const schema = z.object({ name: z.string() });
try {
  schema.parse({});
} catch (error) {
  console.log("error.errors:", error.errors);
  console.log("error.issues:", error.issues);
}
