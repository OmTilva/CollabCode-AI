import { prisma } from "@/lib/prisma.js";

interface Input {
  teamSlug: string;
  projectSlug: string;

  userId: string;

  role: "EDITOR" | "VIEWER";

  addedById: string;
}

export const addProjectMemberService = async ({
  teamSlug,
  projectSlug,
  userId,
  role,
  addedById,
}: Input) => {
  const project = await prisma.project.findFirst({
    where: {
      slug: projectSlug,

      team: {
        slug: teamSlug,
      },
    },

    include: {
      team: true,
    },
  });

  if (!project) {
    throw new Error("Project not found");
  }

  const teamMember = await prisma.teamMember.findFirst({
    where: {
      teamId: project.teamId,
      userId,
    },
  });

  if (!teamMember) {
    throw new Error("User is not a team member");
  }

  const existingMember = await prisma.projectMember.findFirst({
    where: {
      projectId: project.id,
      userId,
    },
  });

  if (existingMember) {
    throw new Error("User already belongs to project");
  }

  return prisma.projectMember.create({
    data: {
      projectId: project.id,

      userId,

      role,

      addedById,
    },
  });
};
