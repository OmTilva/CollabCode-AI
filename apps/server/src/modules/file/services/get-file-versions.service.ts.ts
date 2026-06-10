import { prisma } from "@/lib/prisma.js";

export const getFileVersionsService = async (fileId: string) => {
  const file = await prisma.file.findUnique({
    where: {
      id: fileId,
    },

    select: {
      id: true,
    },
  });

  if (!file) {
    throw new Error("File not found");
  }

  return prisma.fileVersion.findMany({
    where: {
      fileId,
    },

    orderBy: {
      version: "desc",
    },

    select: {
      id: true,

      version: true,

      createdAt: true,

      createdBy: {
        select: {
          id: true,
          username: true,
        },
      },
    },
  });
};
