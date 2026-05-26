import argon2 from "argon2";

export const hashPassword = async (password: string) => {
  return argon2.hash(password);
};

export const verifyPassword = async (
  hashedPassword: string,
  plainPassword: string,
) => {
  return argon2.verify(hashedPassword, plainPassword);
};
