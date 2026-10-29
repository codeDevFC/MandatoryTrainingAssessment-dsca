/*
  Warnings:

  - You are about to drop the column `enrollmentId` on the `AttendanceRecord` table. All the data in the column will be lost.
  - You are about to drop the column `learnerId` on the `AttendanceRecord` table. All the data in the column will be lost.
  - Added the required column `courseName` to the `AttendanceRecord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `learnerName` to the `AttendanceRecord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `learnerPhone` to the `AttendanceRecord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `trainerName` to the `AttendanceRecord` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "AttendanceRecord_learnerId_idx";

-- AlterTable
ALTER TABLE "AttendanceRecord" DROP COLUMN "enrollmentId",
DROP COLUMN "learnerId",
ADD COLUMN     "courseName" TEXT NOT NULL,
ADD COLUMN     "learnerName" TEXT NOT NULL,
ADD COLUMN     "learnerPhone" TEXT NOT NULL,
ADD COLUMN     "trainerName" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "AttendanceRecord_learnerName_idx" ON "AttendanceRecord"("learnerName");

-- CreateIndex
CREATE INDEX "AttendanceRecord_courseName_idx" ON "AttendanceRecord"("courseName");
