-- AlterTable
ALTER TABLE "ModuleAttempt" ADD COLUMN     "attemptNumber" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "errors" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "address" TEXT,
ADD COLUMN     "codeSentAt" TIMESTAMP(3),
ADD COLUMN     "paymentConfirmed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "paymentConfirmedAt" TIMESTAMP(3),
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "postCode" TEXT,
ADD COLUMN     "registrationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "whatsappSent" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "PendingRegistration" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "postCode" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "paymentConfirmedAt" TIMESTAMP(3),
    "codeSentAt" TIMESTAMP(3),
    "generatedEmail" TEXT,
    "generatedCode" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PendingRegistration_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PendingRegistration_email_key" ON "PendingRegistration"("email");
