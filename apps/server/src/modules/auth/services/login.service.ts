import { prisma } from "@/lib/prisma.js";

import { LoginInput } from "../validators/auth.validator.js";

import { verifyPassword } from "../utils/hash.js";

import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js";

export const loginService = async (data: LoginInput) => {
  const user = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (!user) {
    throw new Error("Invalid credentials");
  }
  if (!user.isEmailVerified) {
    throw new Error("Please verify your email first");
  }

  const isPasswordValid = await verifyPassword(user.password, data.password);

  if (!isPasswordValid) {
    throw new Error("Invalid credentials");
  }

  await prisma.session.deleteMany({
    where: {
      userId: user.id,
    },
  });

  const session = await prisma.session.create({
    data: {
      userId: user.id,
      refreshToken: "",
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  const accessToken = generateAccessToken(user.id, user.role, user.email);

  const refreshToken = generateRefreshToken(session.id);

  await prisma.session.update({
    where: {
      id: session.id,
    },

    data: {
      refreshToken,
    },
  });

  return {
    user,
    accessToken,
    refreshToken,
  };
};
