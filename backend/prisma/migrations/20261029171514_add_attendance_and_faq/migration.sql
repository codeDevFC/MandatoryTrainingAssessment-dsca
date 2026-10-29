-- CreateTable
CREATE TABLE "AttendanceRecord" (
    "id" TEXT NOT NULL,
    "attendanceId" TEXT NOT NULL,
    "enrollmentId" TEXT NOT NULL,
    "learnerId" TEXT NOT NULL,
    "sessionDate" TIMESTAMP(3) NOT NULL,
    "arrivalTime" TEXT,
    "departureTime" TEXT,
    "hoursAttended" DOUBLE PRECISION,
    "lateFlag" BOOLEAN NOT NULL DEFAULT false,
    "lateReason" TEXT,
    "noShowFlag" BOOLEAN NOT NULL DEFAULT false,
    "trainerNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AttendanceRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FAQEntry" (
    "id" TEXT NOT NULL,
    "faqId" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "courseId" TEXT,
    "frequency" TEXT NOT NULL DEFAULT 'Occasional',
    "answer" TEXT NOT NULL,
    "addedBy" TEXT NOT NULL,
    "publishReady" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FAQEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AttendanceRecord_attendanceId_key" ON "AttendanceRecord"("attendanceId");

-- CreateIndex
CREATE INDEX "AttendanceRecord_attendanceId_idx" ON "AttendanceRecord"("attendanceId");

-- CreateIndex
CREATE INDEX "AttendanceRecord_learnerId_idx" ON "AttendanceRecord"("learnerId");

-- CreateIndex
CREATE INDEX "AttendanceRecord_sessionDate_idx" ON "AttendanceRecord"("sessionDate");

-- CreateIndex
CREATE UNIQUE INDEX "FAQEntry_faqId_key" ON "FAQEntry"("faqId");

-- CreateIndex
CREATE INDEX "FAQEntry_faqId_idx" ON "FAQEntry"("faqId");

-- CreateIndex
CREATE INDEX "FAQEntry_courseId_idx" ON "FAQEntry"("courseId");
