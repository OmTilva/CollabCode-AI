import { prisma } from "@/lib/prisma.js";

export const getTeamBySlugService = async (slug: string) => {
  const team = await prisma.team.findUnique({
    where: {
      slug,
    },

    include: {
      members: {
        include: {
          user: {
            select: {
              id: true,
              username: true,
              email: true,
            },
          },
        },
      },

      projects: {
        select: {
          id: true,
          name: true,
          slug: true,
          visibility: true,
          createdAt: true,
        },
      },
    },
  });

  return team;
};
