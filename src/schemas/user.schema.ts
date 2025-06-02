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

export const UpdateProfileRequestSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
});