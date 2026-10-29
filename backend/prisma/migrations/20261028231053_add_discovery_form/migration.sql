-- AlterTable
ALTER TABLE "Module" ADD COLUMN     "isPractical" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "ModuleAttempt" ADD COLUMN     "detailedAnswers" TEXT NOT NULL DEFAULT '[]';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "practicalModules" TEXT,
ALTER COLUMN "trainingRoute" SET DEFAULT 'FULL_ACCESS';

-- CreateTable
CREATE TABLE "PracticalAccessCode" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "generatedBy" TEXT,

    CONSTRAINT "PracticalAccessCode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DiscoveryForm" (
    "id" TEXT NOT NULL,
    "learnerId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "addressTown" TEXT,
    "country" TEXT DEFAULT 'UK',
    "courseAppliedFor" TEXT,
    "firstCourse" BOOLEAN NOT NULL DEFAULT false,
    "sourceChannel" TEXT,
    "bookingMethod" TEXT,
    "reasonForChoice" TEXT,
    "priorExperience" TEXT,
    "experienceRating" INTEGER,
    "futurePlans" TEXT,
    "comments" TEXT,
    "consentGiven" BOOLEAN NOT NULL DEFAULT false,
    "consentDate" TIMESTAMP(3),
    "submittedVia" TEXT DEFAULT 'digital',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DiscoveryForm_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PracticalAccessCode_code_key" ON "PracticalAccessCode"("code");

-- CreateIndex
CREATE UNIQUE INDEX "DiscoveryForm_learnerId_key" ON "DiscoveryForm"("learnerId");

-- CreateIndex
CREATE INDEX "DiscoveryForm_learnerId_idx" ON "DiscoveryForm"("learnerId");

-- CreateIndex
CREATE INDEX "DiscoveryForm_email_idx" ON "DiscoveryForm"("email");

-- CreateIndex
CREATE INDEX "DiscoveryForm_createdAt_idx" ON "DiscoveryForm"("createdAt");
