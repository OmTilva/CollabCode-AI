import { prisma } from "@/lib/prisma.js";
import { ActivityType } from "@prisma/client";

interface Input {
  type: ActivityType;

  message: string;

  userId: string;

  projectId?: string;
  teamId?: string;

  metadata?: any;
}

export const createActivityService = async ({
  type,
  message,
  userId,
  projectId,
  teamId,
  metadata,
}: Input) => {
  return prisma.activityLog.create({
    data: {
      type,

      message,

      userId,

      projectId,

      teamId,

      metadata,
    },
  });
};
