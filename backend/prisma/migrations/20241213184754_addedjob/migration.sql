/*
  Warnings:

  - You are about to drop the column `jobRole` on the `Job` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Job` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "jobType" AS ENUM ('FullTime', 'PartTime', 'Contract', 'Internship', 'Temporary', 'Volunteer', 'Remote', 'Freelance', 'Apprenticeship', 'Seasonal', 'Other');

-- AlterTable
ALTER TABLE "Job" DROP COLUMN "jobRole",
DROP COLUMN "type",
ADD COLUMN     "experience" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "jobType" "jobType" NOT NULL DEFAULT 'FullTime',
ADD COLUMN     "package" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "position" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "salaryFrom" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "salaryTo" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "skills" TEXT NOT NULL DEFAULT '';
