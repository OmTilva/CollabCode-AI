import jwt from "jsonwebtoken";

export const generateAccessToken = (
  userId: string,
  role: string,
  email: string,
) => {
  return jwt.sign(
    {
      userId,
      role,
      email,
    },
    process.env.JWT_ACCESS_SECRET!,
    {
      expiresIn: "15m",
    },
  );
};

export const generateRefreshToken = (sessionId: string) => {
  return jwt.sign(
    {
      sessionId,
    },
    process.env.JWT_REFRESH_SECRET!,
    {
      expiresIn: "7d",
    },
  );
};
