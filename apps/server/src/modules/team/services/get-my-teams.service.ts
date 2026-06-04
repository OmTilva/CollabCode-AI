import { prisma } from "@/lib/prisma.js";

export const getMyTeamsService = async (userId: string) => {
  const memberships = await prisma.teamMember.findMany({
    where: {
      userId,
    },

    include: {
      team: {
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          createdAt: true,
        },
      },
    },

    orderBy: {
      joinedAt: "desc",
    },
  });

  return memberships.map((membership) => ({
    role: membership.role,

    joinedAt: membership.joinedAt,

    team: membership.team,
  }));
};
