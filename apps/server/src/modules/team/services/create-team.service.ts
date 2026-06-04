import { prisma } from "@/lib/prisma.js";
import { CreateTeamInput } from "../validators/team.validator.js";
import { generateUniqueSlug } from "../utils/slug.js";

export const createTeamService = async (
  data: CreateTeamInput,
  userId: string,
) => {
  const existingTeam = await prisma.team.findFirst({
    where: {
      ownerId: userId,

      name: {
        equals: data.name,
        mode: "insensitive",
      },
    },
  });

  if (existingTeam) {
    throw new Error("You already own a team with this name");
  }

  const slug = await generateUniqueSlug(data.name);

  const team = await prisma.team.create({
    data: {
      name: data.name,

      description: data.description,

      slug,

      ownerId: userId,

      members: {
        create: {
          userId,

          role: "OWNER",
        },
      },
    },

    include: {
      members: true,
    },
  });

  return team;
};
