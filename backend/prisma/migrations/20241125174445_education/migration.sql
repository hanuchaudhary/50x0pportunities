-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "jobRole" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "education" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "experience" TEXT NOT NULL DEFAULT '';
