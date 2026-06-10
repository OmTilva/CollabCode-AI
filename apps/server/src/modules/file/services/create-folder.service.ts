import { prisma } from "@/lib/prisma.js";
import { createActivityService } from "@/modules/activity/services/create-activity.service.js";
import { ActivityType } from "@prisma/client";

interface CreateFolderInput {
  teamSlug: string;
  projectSlug: string;

  name: string;

  parentId?: string | null;

  userId: string;
}

export const createFolderService = async ({
  teamSlug,
  projectSlug,
  name,
  parentId = null,
  userId,
}: CreateFolderInput) => {
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

  if (parentId) {
    const parent = await prisma.folder.findFirst({
      where: {
        id: parentId,

        projectId: project.id,
      },
    });

    if (!parent) {
      throw new Error("Parent folder not found");
    }
  }

  const existingFolder = await prisma.folder.findFirst({
    where: {
      projectId: project.id,
      parentId: parentId ?? null,
      name: {
        equals: name,
        mode: "insensitive",
      },
    },
  });

  if (existingFolder) {
    throw new Error("Folder already exists");
  }

  const folder = await prisma.folder.create({
    data: {
      name,

      projectId: project.id,

      parentId,
    },
  });

  await createActivityService({
    type: ActivityType.FOLDER_CREATED,

    message: `${folder.name} folder created`,

    userId,

    projectId: project.id,
  });

  return folder;
};
