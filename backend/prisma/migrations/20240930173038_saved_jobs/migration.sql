-- DropForeignKey
ALTER TABLE "jobApplication" DROP CONSTRAINT "jobApplication_jobId_fkey";

-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "savedJobsId" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "savedJobsId" TEXT;

-- CreateTable
CREATE TABLE "SavedJobs" (
    "id" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "SavedJobs_id_key" ON "SavedJobs"("id");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_savedJobsId_fkey" FOREIGN KEY ("savedJobsId") REFERENCES "SavedJobs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_savedJobsId_fkey" FOREIGN KEY ("savedJobsId") REFERENCES "SavedJobs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jobApplication" ADD CONSTRAINT "jobApplication_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;
