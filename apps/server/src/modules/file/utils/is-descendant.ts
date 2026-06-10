import { prisma } from "@/lib/prisma.js";

export const isDescendant = async (
  folderId: string,
  targetParentId: string,
): Promise<boolean> => {
  let currentId = targetParentId;

  while (currentId) {
    if (currentId === folderId) {
      return true;
    }

    const folder = await prisma.folder.findUnique({
      where: {
        id: currentId,
      },

      select: {
        parentId: true,
      },
    });

    currentId = folder?.parentId ?? "";
  }

  return false;
};
