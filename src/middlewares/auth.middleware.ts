import type { Context, Next } from "hono";

import { verify } from "hono/jwt";
import * as HttpStatusCodes from "stoker/http-status-codes";

import type { AppBindings } from "@/lib/types";

import { prisma } from "@/prisma";

// A simple secret key for JWT - in production, this should be in env vars
const JWT_SECRET = "optipredict-secret-key";

export async function authMiddleware(c: Context<AppBindings>, next: Next) {

  // Get the authorization header
  const authHeader = c.req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    c.var.logger.info("Missing or invalid authorization header");
    return c.json(
      { message: "Authentication required" },
      HttpStatusCodes.UNAUTHORIZED,
    );
  }

  // Extract the token
  const token = authHeader.split(" ")[1];

  try {
    // Verify the token
    const decoded = await verify(token, JWT_SECRET) as { userId: number };

    // Check if the user exists
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true },
    });

    if (!user) {
      c.var.logger.warn({ userId: decoded.userId }, "Auth token for non-existent user");
      return c.json(
        { message: "Invalid authentication token" },
        HttpStatusCodes.UNAUTHORIZED,
      );
    }

    // Add the user ID to the request context
    c.set("userId", decoded.userId);

    // Continue to the next middleware or handler
    await next();
  }
  catch (error) {
    c.var.logger.warn({ error }, "Invalid or expired JWT");
    return c.json(
      { message: "Invalid or expired authentication token" },
      HttpStatusCodes.UNAUTHORIZED,
    );
  }
}
