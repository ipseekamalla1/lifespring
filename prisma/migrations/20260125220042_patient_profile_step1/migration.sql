/*
  Warnings:

  - You are about to drop the column `name` on the `Patient` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Patient" DROP COLUMN "name",
ADD COLUMN     "firstName" TEXT,
ADD COLUMN     "lastName" TEXT,
ADD COLUMN     "photoUrl" TEXT,
ADD COLUMN     "profileCompleted" BOOLEAN NOT NULL DEFAULT false;
