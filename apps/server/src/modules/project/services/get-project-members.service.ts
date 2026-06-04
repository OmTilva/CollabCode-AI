import { prisma } from "@/lib/prisma.js";

export const getProjectMembersService = async (
  teamSlug: string,
  projectSlug: string,
) => {
  const project = await prisma.project.findFirst({
    where: {
      slug: projectSlug,

      team: {
        slug: teamSlug,
      },
    },

    include: {
      memberships: {
        include: {
          user: {
            select: {
              id: true,
              username: true,
              email: true,
            },
          },

          addedBy: {
            select: {
              id: true,
              username: true,
            },
          },
        },
      },
    },
  });

  return project;
};
