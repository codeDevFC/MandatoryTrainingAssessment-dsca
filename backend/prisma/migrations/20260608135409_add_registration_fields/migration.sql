/*
  Warnings:

  - You are about to drop the column `codeSentAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `whatsappSent` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `PendingRegistration` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "codeSentAt",
DROP COLUMN "whatsappSent";

-- DropTable
DROP TABLE "PendingRegistration";
