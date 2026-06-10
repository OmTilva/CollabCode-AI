import { prisma } from "@/lib/prisma.js";

export const getFileVersionService = async (
  fileId: string,
  versionId: string,
) => {
  const version = await prisma.fileVersion.findFirst({
    where: {
      id: versionId,

      fileId,
    },

    include: {
      createdBy: {
        select: {
          id: true,
          username: true,
          email: true,
        },
      },
    },
  });

  if (!version) {
    throw new Error("Version not found");
  }

  return version;
};
