import slugify from "slugify";
import { prisma } from "@/lib/prisma.js";

interface CreateProjectInput {
  teamId: string;

  name: string;

  description?: string;

  visibility?: "PRIVATE" | "PUBLIC";

  createdById: string;
}

export const createProjectService = async ({
  teamId,
  name,
  description,
  visibility = "PRIVATE",
  createdById,
}: CreateProjectInput) => {
  const slug = slugify(name, {
    lower: true,
    strict: true,
    trim: true,
  });

  const existingProject = await prisma.project.findFirst({
    where: {
      teamId,
      slug,
    },
  });

  if (existingProject) {
    throw new Error("Project already exists");
  }

  const result = await prisma.$transaction(async (tx) => {
    const project = await tx.project.create({
      data: {
        name,

        slug,

        description,

        visibility,

        teamId,

        ownerId: createdById,

        createdById,
      },
    });

    await tx.projectMember.create({
      data: {
        projectId: project.id,

        userId: createdById,

        role: "OWNER",

        addedById: createdById,
      },
    });

    return project;
  });

  return result;
};
