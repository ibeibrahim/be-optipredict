import { z } from "@hono/zod-openapi";

export const UserResponseSchema = z.object({
  id: z.number(),
  first_name: z.string(),
  last_name: z.string(),
  email: z.string().email(),
  photo_url: z.string().nullable(),
  created_at: z.date(),
  updated_at: z.date(),
});
