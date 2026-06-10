-- AlterTable
ALTER TABLE "File" ADD COLUMN     "lastOpenedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Folder" ADD COLUMN     "createdById" TEXT;
