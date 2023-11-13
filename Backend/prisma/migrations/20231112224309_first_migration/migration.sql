/*
  Warnings:

  - You are about to drop the column `FriendRequests` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "FriendRequests",
ADD COLUMN     "FriendRequestsEmitted" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
ADD COLUMN     "FriendRequestsReceived" INTEGER[] DEFAULT ARRAY[]::INTEGER[];
