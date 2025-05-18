import { z } from "@hono/zod-openapi";

export const RegisterRequestSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const LoginRequestSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const AuthResponseSchema = z.object({
  token: z.string(),
  user: z.object({
    id: z.number(),
    first_name: z.string(),
    last_name: z.string(),
    email: z.string(),
    photo_url: z.string().nullable(),
    created_at: z.date(),
    updated_at: z.date(),
  }),
});

export const AuthErrorSchema = z.object({
  message: z.string(),
});