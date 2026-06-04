import { prisma } from "@/lib/prisma.js";

export const getTeamProjectsService = async (teamId: string) => {
  return prisma.project.findMany({
    where: {
      teamId,
    },

    orderBy: {
      createdAt: "desc",
    },

    include: {
      owner: {
        select: {
          id: true,
          username: true,
          email: true,
        },
      },

      _count: {
        select: {
          memberships: true,
        },
      },
    },
  });
};
