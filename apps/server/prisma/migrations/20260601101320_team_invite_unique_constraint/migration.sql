/*
  Warnings:

  - A unique constraint covering the columns `[teamId,email]` on the table `TeamInvite` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "TeamInvite_teamId_email_key" ON "TeamInvite"("teamId", "email");
