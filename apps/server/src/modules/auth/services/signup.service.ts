import { prisma } from "@/lib/prisma.js";
import { SignupInput } from "../validators/auth.validator.js";
import { hashPassword } from "../utils/hash.js";
import { generateToken, hashToken } from "../utils/token.js";

import { sendVerificationEmail } from "./email.service.js";

export const signupService = async (data: SignupInput) => {
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email: data.email }, { username: data.username }],
    },
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await hashPassword(data.password);
//creates user
  const user = await prisma.user.create({
    data: {
      email: data.email,
      username: data.username,
      password: hashedPassword,
    },
  });

  //verify email
  const rawToken = generateToken();

  const hashedToken = hashToken(rawToken);

  await prisma.verificationToken.create({
    data: {
      token: hashedToken,

      userId: user.id,

      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), 
    },
  });

  await sendVerificationEmail(user.email, rawToken);

  return user;
};
