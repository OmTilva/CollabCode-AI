import { prisma } from "@/lib/prisma.js";

export const removeProjectMemberService = async (
  memberId: string,
  currentUserId: string,
) => {
  const member = await prisma.projectMember.findUnique({
    where: {
      id: memberId,
    },
  });

  if (!member) {
    throw new Error("Member not found");
  }

  if (member.role === "OWNER") {
    throw new Error("Cannot remove project owner");
  }

  if (member.userId === currentUserId) {
    throw new Error("Cannot remove yourself");
  }

  await prisma.projectMember.delete({
    where: {
      id: memberId,
    },
  });

  return true;
};
