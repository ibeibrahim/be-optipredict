import { Prisma } from "@prisma/client";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import type { AppRouteHandler } from "@/lib/types";

import { prisma } from "@/prisma";

import type { ListUsers, updateUser, User } from "./users.routes";

export const list: AppRouteHandler<ListUsers> = async (c) => {
  const users = (await prisma.user.findMany({
    omit: {
      password: true,
    },
  })).map(user => ({
    id: user.id,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    photo_url: user.photo_url,
    created_at: user.created_at,
    updated_at: user.updated_at,
  }));

  return c.json(users);
};

export const userById: AppRouteHandler<User> = async (c) => {
  const { id } = c.req.valid("param");

  const user = await prisma.user.findUnique({
    where: {
      id,
    },
    omit: {
      password: true,
    },
  });
  if (!user) {
    return c.json(
      {
        message: HttpStatusPhrases.NOT_FOUND,
      },
      HttpStatusCodes.NOT_FOUND,
    );
  }
  const userData = {
    id: user.id,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    photo_url: user.photo_url,
    created_at: user.created_at,
    updated_at: user.updated_at,
  };
  return c.json(userData, HttpStatusCodes.OK);
};

export const updateOne: AppRouteHandler<updateUser> = async (c) => {
  const { first_name, last_name, email } = c.req.valid("json");
  const { id } = c.req.valid("param");
  try {
    const user = await prisma.user.update({
      where: { id },
      data: {
        first_name,
        last_name,
        email,
      },
    });

    const userData = {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      photo_url: user.photo_url,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };

    return c.json(userData, HttpStatusCodes.OK);
  }
  catch (error) {
    // If the user with the given ID doesn't exist
    if (
      error instanceof Prisma.PrismaClientKnownRequestError
      && error.code === "P2025"
    ) {
      return c.json(
        { message: HttpStatusPhrases.NOT_FOUND },
        HttpStatusCodes.NOT_FOUND,
      );
    }
    return c.json(
      { message: HttpStatusPhrases.INTERNAL_SERVER_ERROR },
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
};
