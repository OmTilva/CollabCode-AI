import { prisma } from "@/lib/prisma.js";

export const getProjectTreeService = async (
  teamSlug: string,
  projectSlug: string,
) => {
  const project = await prisma.project.findFirst({
    where: {
      slug: projectSlug,
      team: {
        slug: teamSlug,
      },
    },
    select: {
      id: true,
    },
  });

  if (!project) {
    throw new Error("Project not found");
  }

  const [folders, files] = await Promise.all([
    prisma.folder.findMany({
      where: {
        projectId: project.id,
      },
      orderBy: {
        name: "asc",
      },
    }),

    prisma.file.findMany({
      where: {
        projectId: project.id,
      },
      orderBy: {
        name: "asc",
      },
    }),
  ]);

  const folderMap = new Map();

  const rootNodes: any[] = [];

  for (const folder of folders) {
    folderMap.set(folder.id, {
      id: folder.id,
      type: "folder",
      name: folder.name,
      parentId: folder.parentId,
      children: [],
    });
  }

  for (const folder of folders) {
    const node = folderMap.get(folder.id);

    if (folder.parentId) {
      const parent = folderMap.get(folder.parentId);

      parent?.children.push(node);
    } else {
      rootNodes.push(node);
    }
  }

  for (const file of files) {
    const fileNode = {
      id: file.id,
      type: "file",
      name: file.extension ? `${file.name}.${file.extension}` : file.name,
    };

    if (file.folderId) {
      const parent = folderMap.get(file.folderId);

      parent?.children.push(fileNode);
    } else {
      rootNodes.push(fileNode);
    }
  }

  return rootNodes;
};
