import { prisma } from "@/lib/prisma.js";

export const getAvailableMembersService = async (
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
      memberships: true,
    },
  });

  if (!project) {
    throw new Error("Project not found");
  }

  const projectUserIds = project.memberships.map((m) => m.userId);

  return prisma.teamMember.findMany({
    where: {
      teamId: project.teamId,

      userId: {
        notIn: projectUserIds,
      },
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
  });
};
