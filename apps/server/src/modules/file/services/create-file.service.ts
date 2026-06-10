import { prisma } from "@/lib/prisma.js";
import { createActivityService } from "@/modules/activity/services/create-activity.service.js";

interface CreateFileInput {
  teamSlug: string;
  projectSlug: string;

  name: string;
  extension?: string;

  folderId?: string | null;

  userId: string;
}

export const createFileService = async ({
  teamSlug,
  projectSlug,
  name,
  extension,
  folderId = null,
  userId,
}: CreateFileInput) => {
  const project = await prisma.project.findFirst({
    where: {
      slug: projectSlug,

      team: {
        slug: teamSlug,
      },
    },
  });

  if (!project) {
    throw new Error("Project not found");
  }

  if (folderId) {
    const folder = await prisma.folder.findFirst({
      where: {
        id: folderId,

        projectId: project.id,
      },
    });

    if (!folder) {
      throw new Error("Folder not found");
    }
  }

  const existingFile = await prisma.file.findFirst({
    where: {
      projectId: project.id,

      folderId,

      name: {
        equals: name,
        mode: "insensitive",
      },

      extension: extension ?? null,
    },
  });

  if (existingFile) {
    throw new Error("File already exists");
  }

  return prisma.$transaction(async (tx) => {
    const file = await tx.file.create({
      data: {
        name,

        extension,

        projectId: project.id,

        folderId,

        createdById: userId,

        updatedById: userId,
      },
    });

    await tx.fileVersion.create({
      data: {
        fileId: file.id,

        version: 1,

        content: "",

        createdById: userId,
      },
    });

    await createActivityService({
      type: "FILE_CREATED",

      message: `${file.name}.${file.extension} created`,

      userId,

      projectId: project.id,
    });

    return file;
  });
};
