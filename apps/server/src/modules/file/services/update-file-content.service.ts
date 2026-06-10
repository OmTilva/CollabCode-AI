import { prisma } from "@/lib/prisma.js";

interface Input {
  fileId: string;

  content: string;

  userId: string;
}

export const updateFileContentService = async ({
  fileId,
  content,
  userId,
}: Input) => {
  const file = await prisma.file.findUnique({
    where: {
      id: fileId,
    },

    include: {
      versions: {
        orderBy: {
          version: "desc",
        },

        take: 1,
      },
    },
  });

  if (!file) {
    throw new Error("File not found");
  }

  const latestVersion = file.versions[0];

  const nextVersion = latestVersion ? latestVersion.version + 1 : 1;

  return prisma.$transaction(async (tx) => {
    const updatedFile = await tx.file.update({
      where: {
        id: fileId,
      },

      data: {
        content,

        updatedById: userId,
      },
    });

    await tx.fileVersion.create({
      data: {
        fileId,

        content,

        version: nextVersion,

        createdById: userId,
      },
    });

    return updatedFile;
  });
};
