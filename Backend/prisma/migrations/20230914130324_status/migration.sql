/*
  Warnings:

  - The `userStatus` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ONLINE', 'OFFLINE', 'INGAME');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "userStatus",
ADD COLUMN     "userStatus" "Status" NOT NULL DEFAULT 'OFFLINE';
