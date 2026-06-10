import { prisma } from "@/lib/prisma.js";
import { ActivityType } from "@prisma/client";
import { createActivityService } from "@/modules/activity/services/create-activity.service.js";

interface Input {
  fileId: string;

  userId: string;
}

export const deleteFileService = async ({ fileId, userId }: Input) => {
  const file = await prisma.file.findUnique({
    where: {
      id: fileId,
    },
  });

  if (!file) {
    throw new Error("File not found");
  }

  await prisma.file.delete({
    where: {
      id: fileId,
    },
  });

  await createActivityService({
    type: ActivityType.FILE_DELETED,

    message: `${file.name}.${file.extension} deleted`,

    userId,

    projectId: file.projectId,
  });

  return true;
};
