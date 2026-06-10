import { prisma } from "@/lib/prisma.js";
import { isDescendant } from "../utils/is-descendant.js";
import { ActivityType } from "@prisma/client";
import { createActivityService } from "@/modules/activity/services/create-activity.service.js";

interface MoveFolderInput {
  folderId: string;
  parentId: string | null;
  userId: string;
}

export const moveFolderService = async ({
  folderId,
  parentId,
  userId,
}: MoveFolderInput) => {
  const folder = await prisma.folder.findUnique({
    where: {
      id: folderId,
    },
  });

  if (!folder) {
    throw new Error("Folder not found");
  }

  if (parentId === folderId) {
    throw new Error("Cannot move folder into itself");
  }

  if (parentId) {
    const target = await prisma.folder.findUnique({
      where: {
        id: parentId,
      },
    });

    if (!target) {
      throw new Error("Destination folder not found");
    }

    if (target.projectId !== folder.projectId) {
      throw new Error("Cannot move folder across projects");
    }

    const circular = await isDescendant(folderId, parentId);

    if (circular) {
      throw new Error("Cannot move folder into descendant folder");
    }
  }

  const duplicate = await prisma.folder.findFirst({
    where: {
      projectId: folder.projectId,

      parentId,

      name: {
        equals: folder.name,
        mode: "insensitive",
      },

      NOT: {
        id: folderId,
      },
    },
  });

  if (duplicate) {
    throw new Error("Folder already exists in destination");
  }

  const updatedFolder = await prisma.folder.update({
    where: {
      id: folderId,
    },

    data: {
      parentId,
    },
  });
  await createActivityService({
    type: ActivityType.FOLDER_MOVED,

    message: `${folder.name} folder moved`,

    userId,

    projectId: folder.projectId,
  });
  return updatedFolder;
};
