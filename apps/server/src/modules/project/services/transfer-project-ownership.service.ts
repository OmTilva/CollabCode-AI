import { prisma } from "@/lib/prisma.js";

interface Input {
  teamSlug: string;
  projectSlug: string;
  currentOwnerId: string;
  newOwnerId: string;
}

export const transferProjectOwnershipService = async ({
  teamSlug,
  projectSlug,
  currentOwnerId,
  newOwnerId,
}: Input) => {
  if (currentOwnerId === newOwnerId) {
    throw new Error("Cannot transfer ownership to yourself");
  }

  const project = await prisma.project.findFirst({
    where: {
      slug: projectSlug,
      team: {
        slug: teamSlug,
      },
    },
  });

  if (!project) {
    throw new Error("Project not found");
  }

  if (project.ownerId !== currentOwnerId) {
    throw new Error("Only project owner can transfer ownership");
  }

  const newOwnerMembership = await prisma.projectMember.findFirst({
    where: {
      projectId: project.id,
      userId: newOwnerId,
    },
  });

  if (!newOwnerMembership) {
    throw new Error("New owner must be a project member");
  }

  const currentOwnerMembership = await prisma.projectMember.findFirst({
    where: {
      projectId: project.id,
      userId: currentOwnerId,
    },
  });

  if (!currentOwnerMembership) {
    throw new Error("Current owner membership missing");
  }

  return prisma.$transaction(async (tx) => {
    await tx.project.update({
      where: {
        id: project.id,
      },
      data: {
        ownerId: newOwnerId,
      },
    });

    await tx.projectMember.update({
      where: {
        id: currentOwnerMembership.id,
      },
      data: {
        role: "EDITOR",
      },
    });

    await tx.projectMember.update({
      where: {
        id: newOwnerMembership.id,
      },
      data: {
        role: "OWNER",
      },
    });

    return true;
  });
};
