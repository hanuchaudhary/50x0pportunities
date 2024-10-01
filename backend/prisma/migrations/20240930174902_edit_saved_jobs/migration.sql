/*
  Warnings:

  - You are about to drop the column `savedJobsId` on the `Job` table. All the data in the column will be lost.
  - You are about to drop the column `savedJobsId` on the `User` table. All the data in the column will be lost.
  - Added the required column `jobId` to the `SavedJobs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `SavedJobs` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Job" DROP CONSTRAINT "Job_savedJobsId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_savedJobsId_fkey";

-- AlterTable
ALTER TABLE "Job" DROP COLUMN "savedJobsId";

-- AlterTable
ALTER TABLE "SavedJobs" ADD COLUMN     "jobId" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "savedJobsId";

-- AddForeignKey
ALTER TABLE "SavedJobs" ADD CONSTRAINT "SavedJobs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedJobs" ADD CONSTRAINT "SavedJobs_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;
