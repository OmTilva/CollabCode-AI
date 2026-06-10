import { prisma } from "@/lib/prisma.js";

export const getProjectActivityService = async (projectId: string) => {
  return prisma.activityLog.findMany({
    where: {
      projectId,
    },

    include: {
      user: {
        select: {
          id: true,
          username: true,
          email: true,
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },

    take: 100,
  });
};
