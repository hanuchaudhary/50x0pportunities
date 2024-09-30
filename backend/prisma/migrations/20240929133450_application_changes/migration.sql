-- DropForeignKey
ALTER TABLE "jobApplication" DROP CONSTRAINT "jobApplication_jobId_fkey";

-- AlterTable
ALTER TABLE "jobApplication" ALTER COLUMN "status" DROP NOT NULL,
ALTER COLUMN "jobId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "jobApplication" ADD CONSTRAINT "jobApplication_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE SET NULL ON UPDATE CASCADE;
