import crypto from "crypto";
import { prisma } from "@/lib/prisma.js";

interface AcceptInviteInput {
  token: string;
  userId: string;
  userEmail: string;
}

export const acceptInviteService = async ({
  token,
  userId,
  userEmail,
}: AcceptInviteInput) => {
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const invite = await prisma.teamInvite.findFirst({
    where: {
      token: hashedToken,
    },
  });

  if (!invite) {
    throw new Error("Invalid invitation");
  }

  if (invite.accepted) {
    throw new Error("Invitation already accepted");
  }

  if (invite.expiresAt < new Date()) {
    throw new Error("Invitation expired");
  }

  if (invite.email.toLowerCase() !== userEmail.toLowerCase()) {
    throw new Error("This invitation belongs to another email address");
  }

  const existingMember = await prisma.teamMember.findFirst({
    where: {
      teamId: invite.teamId,
      userId,
    },
  });

  if (existingMember) {
    await prisma.teamInvite.update({
      where: {
        id: invite.id,
      },
      data: {
        accepted: true,
        acceptedAt: new Date(),
        acceptedById: userId,
      },
    });

    return existingMember;
  }

  const result = await prisma.$transaction(async (tx) => {
    const member = await tx.teamMember.create({
      data: {
        teamId: invite.teamId,

        userId,

        role: invite.role,
      },
    });

    await tx.teamInvite.update({
      where: {
        id: invite.id,
      },
      data: {
        accepted: true,

        acceptedAt: new Date(),

        acceptedById: userId,
      },
    });

    return member;
  });

  return result;
};
