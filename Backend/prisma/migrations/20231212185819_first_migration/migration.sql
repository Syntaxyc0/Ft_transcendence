-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ONLINE', 'OFFLINE', 'INGAME');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "login" TEXT NOT NULL,
    "login42" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "access_token" TEXT NOT NULL DEFAULT '',
    "is2faenabled" BOOLEAN NOT NULL DEFAULT false,
    "is2favalidated" BOOLEAN NOT NULL DEFAULT false,
    "twofacode" TEXT NOT NULL DEFAULT '',
    "avatar" TEXT NOT NULL DEFAULT '',
    "elo" INTEGER NOT NULL DEFAULT 1000,
    "userStatus" TEXT NOT NULL DEFAULT 'OFFLINE',
    "gameHistory" INTEGER[],
    "friendList" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    "FriendRequestsEmitted" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    "FriendRequestsReceived" INTEGER[] DEFAULT ARRAY[]::INTEGER[],

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

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

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_login_key" ON "User"("login");

-- CreateIndex
CREATE UNIQUE INDEX "User_login42_key" ON "User"("login42");
