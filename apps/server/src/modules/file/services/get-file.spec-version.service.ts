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
  });

  if (!version) {
    throw new Error("Version not found");
  }

  return version;
};
