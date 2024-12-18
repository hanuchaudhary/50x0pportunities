/*
  Warnings:

  - You are about to drop the `jobApplication` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "jobApplication" DROP CONSTRAINT "jobApplication_applicantId_fkey";

-- DropForeignKey
ALTER TABLE "jobApplication" DROP CONSTRAINT "jobApplication_jobId_fkey";

-- AlterTable
ALTER TABLE "Job" ALTER COLUMN "jobType" DROP DEFAULT;

-- DropTable
DROP TABLE "jobApplication";

-- CreateTable
CREATE TABLE "jobApplications" (
    "id" TEXT NOT NULL,
    "applicantId" TEXT NOT NULL,
    "jobId" TEXT,
    "status" "applicationStatus" DEFAULT 'Applied',
    "isApplied" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "jobApplications_id_key" ON "jobApplications"("id");

-- AddForeignKey
ALTER TABLE "jobApplications" ADD CONSTRAINT "jobApplications_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jobApplications" ADD CONSTRAINT "jobApplications_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;
