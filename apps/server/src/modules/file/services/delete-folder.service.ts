import { prisma } from "@/lib/prisma.js";
import { createActivityService } from "@/modules/activity/services/create-activity.service.js";
import { ActivityType } from "@prisma/client";

interface Input {
  folderId: string;

  userId: string;
}

export const deleteFolderService = async ({ folderId, userId }: Input) => {
  const folder = await prisma.folder.findUnique({
    where: {
      id: folderId,
    },

    include: {
      children: true,
      files: true,
    },
  });

  if (!folder) {
    throw new Error("Folder not found");
  }

  if (folder.children.length > 0) {
    throw new Error("Folder contains subfolders");
  }

  if (folder.files.length > 0) {
    throw new Error("Folder contains files");
  }

  await prisma.folder.delete({
    where: {
      id: folderId,
    },
  });

  await createActivityService({
    type: ActivityType.FOLDER_DELETED,

    message: `${folder.name} folder deleted`,

    userId,

    projectId: folder.projectId,
  });

  return true;
};
