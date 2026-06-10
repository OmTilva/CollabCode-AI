/*
  Warnings:

  - A unique constraint covering the columns `[projectId,folderId,name,extension]` on the table `File` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[projectId,parentId,name]` on the table `Folder` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "File_projectId_folderId_name_extension_key" ON "File"("projectId", "folderId", "name", "extension");

-- CreateIndex
CREATE UNIQUE INDEX "Folder_projectId_parentId_name_key" ON "Folder"("projectId", "parentId", "name");
