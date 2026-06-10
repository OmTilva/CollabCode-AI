import { prisma } from "@/lib/prisma.js";
import { createActivityService } from "@/modules/activity/services/create-activity.service.js";
import { ActivityType } from "@prisma/client";

interface Input {
  folderId: string;

  name: string;

  userId: string;
}

export const renameFolderService = async ({
  folderId,
  name,
  userId,
}: Input) => {
  const folder = await prisma.folder.findUnique({
    where: {
      id: folderId,
    },
  });

  if (!folder) {
    throw new Error("Folder not found");
  }

  const existing = await prisma.folder.findFirst({
    where: {
      projectId: folder.projectId,

      parentId: folder.parentId,

      NOT: {
        id: folderId,
      },

      name: {
        equals: name,
        mode: "insensitive",
      },
    },
  });

  if (existing) {
    throw new Error("Folder already exists");
  }

  const updatedFolder = await prisma.folder.update({
    where: {
      id: folderId,
    },

    data: {
      name,
    },
  });

  await createActivityService({
    type: ActivityType.FOLDER_RENAMED,

    message: `${folder.name} renamed to ${name}`,

    userId,

    projectId: folder.projectId,
  });
  return updatedFolder;
};
