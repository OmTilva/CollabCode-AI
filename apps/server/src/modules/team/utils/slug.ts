import slugify from "slugify";
import { prisma } from "@/lib/prisma.js";

export const generateUniqueSlug = async (name: string) => {
  const baseSlug = slugify(name, {
    lower: true,
    strict: true,
  });

  let slug = baseSlug;

  let counter = 1;

  while (true) {
    const existingTeam = await prisma.team.findUnique({
      where: { slug },
    });

    if (!existingTeam) {
      break;
    }

    slug = `${baseSlug}-${counter}`;

    counter++;
  }

  return slug;
};
