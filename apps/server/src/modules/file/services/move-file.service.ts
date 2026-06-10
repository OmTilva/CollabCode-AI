import { prisma } from "@/lib/prisma.js";
import { createActivityService } from "@/modules/activity/services/create-activity.service.js";

interface MoveFileInput {
  fileId: string;
  folderId: string | null;
  userId: string;
}

export const moveFileService = async ({
  fileId,
  folderId,
  userId,
}: MoveFileInput) => {
  const file = await prisma.file.findUnique({
    where: {
      id: fileId,
    },
  });

  if (!file) {
    throw new Error("File not found");
  }

  if (folderId) {
    const folder = await prisma.folder.findUnique({
      where: {
        id: folderId,
      },
    });

    if (!folder) {
      throw new Error("Destination folder not found");
    }

    if (folder.projectId !== file.projectId) {
      throw new Error("Cannot move file across projects");
    }
  }

  const duplicate = await prisma.file.findFirst({
    where: {
      projectId: file.projectId,

      folderId,

      name: {
        equals: file.name,
        mode: "insensitive",
      },

      extension: file.extension,

      NOT: {
        id: fileId,
      },
    },
  });

  if (duplicate) {
    throw new Error("File with same name already exists in destination");
  }

  const updatedFile = await prisma.file.update({
    where: {
      id: fileId,
    },

    data: {
      folderId,
    },
  });

  await createActivityService({
    type: "FILE_MOVED",

    message: `${file.name}.${file.extension} moved`,

    userId,

    projectId: file.projectId,
  });

  return updatedFile;
};
