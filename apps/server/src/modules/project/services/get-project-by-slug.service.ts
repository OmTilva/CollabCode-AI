import { prisma } from "@/lib/prisma.js";

export const getProjectBySlugService = async (
  teamSlug: string,
  projectSlug: string,
) => {
  return prisma.project.findFirst({
    where: {
      slug: projectSlug,

      team: {
        slug: teamSlug,
      },
    },

    include: {
      owner: {
        select: {
          id: true,
          username: true,
          email: true,
        },
      },
      createdBy: {
        select: {
          id: true,
          username: true,
          email: true,
        },
      },

      team: {
        select: {
          id: true,
          name: true,
          slug: true,
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
