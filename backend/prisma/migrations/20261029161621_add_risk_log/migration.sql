-- CreateTable
CREATE TABLE "RiskLog" (
    "id" TEXT NOT NULL,
    "riskId" TEXT NOT NULL,
    "dateRaised" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "area" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "likelihood" TEXT NOT NULL,
    "impact" TEXT NOT NULL,
    "owner" TEXT NOT NULL,
    "mitigation" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Open',
    "dateClosed" TIMESTAMP(3),
    "resolutionNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RiskLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RiskLog_riskId_key" ON "RiskLog"("riskId");

-- CreateIndex
CREATE INDEX "RiskLog_riskId_idx" ON "RiskLog"("riskId");

-- CreateIndex
CREATE INDEX "RiskLog_area_idx" ON "RiskLog"("area");

-- CreateIndex
CREATE INDEX "RiskLog_status_idx" ON "RiskLog"("status");

-- CreateIndex
CREATE INDEX "RiskLog_dateRaised_idx" ON "RiskLog"("dateRaised");
