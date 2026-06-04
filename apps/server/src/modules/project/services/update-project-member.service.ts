import { prisma } from "@/lib/prisma.js";

export const updateProjectMemberService = async (
  memberId: string,
  role: "EDITOR" | "VIEWER",
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
    throw new Error("Cannot modify project owner");
  }

  return prisma.projectMember.update({
    where: {
      id: memberId,
    },
    data: {
      role,
    },
  });
};
