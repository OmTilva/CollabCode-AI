import { prisma } from "@/lib/prisma.js";

export const getFileService = async (fileId: string) => {
  const file = await prisma.file.findUnique({
    where: {
      id: fileId,
    },
  });

  if (!file) {
    throw new Error("File not found");
  }

  return file;
};
