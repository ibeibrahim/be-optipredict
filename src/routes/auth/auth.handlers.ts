import * as bcrypt from "bcrypt";
import { sign } from "hono/jwt";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import type { AppRouteHandler } from "@/lib/types";

import { prisma } from "@/prisma";

import type { Login, Register } from "./auth.routes";

// A simple secret key for JWT - in production, this should be in env vars
const JWT_SECRET = "optipredict-secret-key";

export const register: AppRouteHandler<Register> = async (c) => {
  const { first_name, last_name, email, password } = c.req.valid("json");

  // Check if user with this email already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    c.var.logger.warn({ email }, "Registration attempted with existing email");
    return c.json(
      {
        message: "Email already in use",
      },
      HttpStatusCodes.CONFLICT,
    );
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    // Create the user
    const user = await prisma.user.create({
      data: {
        first_name,
        last_name,
        email,
        password: hashedPassword,
        photo_url: null,
      },
    });
    const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 5;
    // Generate JWT token
    const payload = {
      userId: user.id,
      exp,
    };

    const token = await sign(payload, JWT_SECRET);

    // Return the response without password
    return c.json({
      token,
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        photo_url: user.photo_url,
        created_at: user.created_at,
        updated_at: user.updated_at,
      },
    }, HttpStatusCodes.CREATED);
  }
  catch (error) {
    c.var.logger.error({ error }, "Error during user registration");
    return c.json(
      {
        message: HttpStatusPhrases.INTERNAL_SERVER_ERROR,
      },
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
};

export const login: AppRouteHandler<Login> = async (c) => {
  const { email, password } = c.req.valid("json");

  // Find user by email
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    c.var.logger.info({ email }, "Login attempt with non-existent email");
    return c.json(
      {
        message: "Invalid credentials",
      },
      HttpStatusCodes.UNAUTHORIZED,
    );
  }

  // Compare passwords
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    c.var.logger.info({ email }, "Login attempt with incorrect password");
    return c.json(
      {
        message: "Invalid credentials",
      },
      HttpStatusCodes.UNAUTHORIZED,
    );
  }

  // Generate JWT token
  const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 5;
  const payload = {
    userId: user.id,
    exp,
  };

  const token = await sign(payload, JWT_SECRET);

  // Return the response without password
  return c.json({
    token,
    user: {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      photo_url: user.photo_url,
      created_at: user.created_at,
      updated_at: user.updated_at,
    },
  }, HttpStatusCodes.OK);
};
