import { prisma } from "@/lib/prisma.js";
import { createActivityService } from "@/modules/activity/services/create-activity.service.js";

interface Input {
  fileId: string;

  name: string;

  extension?: string;

  userId: string;
}

export const renameFileService = async ({
  fileId,
  name,
  extension,
  userId,
}: Input) => {
  const file = await prisma.file.findUnique({
    where: {
      id: fileId,
    },
  });

  if (!file) {
    throw new Error("File not found");
  }

  const existing = await prisma.file.findFirst({
    where: {
      projectId: file.projectId,

      folderId: file.folderId,

      NOT: {
        id: fileId,
      },

      name: {
        equals: name,
        mode: "insensitive",
      },

      extension: extension ?? null,
    },
  });

  if (existing) {
    throw new Error("File already exists");
  }

  const updatedFile = await prisma.file.update({
    where: {
      id: fileId,
    },

    data: {
      name,
      extension,
    },
  });

  await createActivityService({
    type: "FILE_RENAMED",

    message: `${file.name}.${file.extension} renamed to ${name}.${extension}`,

    userId,

    projectId: file.projectId,
  });

  return updatedFile;
};
