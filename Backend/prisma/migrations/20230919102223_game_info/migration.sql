-- AlterTable
ALTER TABLE "User" ADD COLUMN     "elo" INTEGER NOT NULL DEFAULT 1000,
ADD COLUMN     "gameHistory" INTEGER[];

-- CreateTable
CREATE TABLE "GameInfo" (
    "id" SERIAL NOT NULL,
    "userId1" INTEGER NOT NULL,
    "userId2" INTEGER NOT NULL,
    "scoreUser1" INTEGER NOT NULL,
    "scoreUser2" INTEGER NOT NULL,
    "winnerId" INTEGER NOT NULL,

    CONSTRAINT "GameInfo_pkey" PRIMARY KEY ("id")
);
