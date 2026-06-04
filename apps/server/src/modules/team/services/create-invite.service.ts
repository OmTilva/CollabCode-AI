import crypto from "crypto";
import { TeamRole } from "@prisma/client";
import { prisma } from "@/lib/prisma.js";
import { resend } from "@/lib/resend.js";
import { inviteEmailTemplate } from "../emails/invite.email.js";

/**
 * SECURITY NOTES
 *
 * - Never store raw invite tokens
 * - Always store SHA256 hash
 * - Email addresses are normalized
 * - Existing members cannot be invited
 * - Active invites are unique per team/email
 */

interface CreateInviteInput {
  teamId: string;
  email: string;
  role: TeamRole;
  invitedById: string;
}

export const createInviteService = async ({
  teamId,
  email,
  role,
  invitedById,
}: CreateInviteInput) => {
  // Normalize email
  email = email.trim().toLowerCase();

  // Prevent OWNER invites
  if (role === "OWNER") {
    throw new Error("Ownership cannot be assigned through invitations");
  }

  // Verify team exists
  const team = await prisma.team.findUnique({
    where: {
      id: teamId,
    },
  });

  if (!team) {
    throw new Error("Team not found");
  }

  // Check if user is already a member
  const existingMember = await prisma.teamMember.findFirst({
    where: {
      teamId,

      user: {
        email,
      },
    },
  });

  if (existingMember) {
    throw new Error("User is already a member");
  }

  // Check for existing ACTIVE invite
  const existingInvite = await prisma.teamInvite.findFirst({
    where: {
      teamId,
      email,

      accepted: false,

      expiresAt: {
        gt: new Date(),
      },
    },
  });

  if (existingInvite) {
    throw new Error("Pending invite already exists");
  }

  // Generate secure token
  const rawToken = crypto.randomBytes(32).toString("hex");

  // Hash token before storing
  const hashedToken = crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex");

  // 7 day expiry
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  // Create invite
  const invite = await prisma.teamInvite.create({
    data: {
      email,
      role,

      token: hashedToken,

      expiresAt,

      teamId,

      invitedById,
    },
  });

  const inviteLink = `${process.env.CLIENT_URL}/invite/${rawToken}`;

  try {
    const result = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,

      to: email,

      subject: `Invitation to join ${team.name}`,

      html: inviteEmailTemplate(team.name, inviteLink),
    });
  } catch (error) {
    await prisma.teamInvite.delete({
      where: {
        id: invite.id,
      },
    });

    throw new Error("Failed to send invitation email");
  }

  return {
    id: invite.id,
    email: invite.email,
    role: invite.role,
    expiresAt: invite.expiresAt,
  };
};
