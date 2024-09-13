-- CreateTable
CREATE TABLE "userModel" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "userModel_email_key" ON "userModel"("email");
