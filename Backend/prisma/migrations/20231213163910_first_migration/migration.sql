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

-- CreateTable
CREATE TABLE "Room" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConnectedUser" (
    "id" SERIAL NOT NULL,
    "socketId" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "ConnectedUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_UserRooms" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_login_key" ON "User"("login");

-- CreateIndex
CREATE UNIQUE INDEX "User_login42_key" ON "User"("login42");

-- CreateIndex
CREATE UNIQUE INDEX "_UserRooms_AB_unique" ON "_UserRooms"("A", "B");

-- CreateIndex
CREATE INDEX "_UserRooms_B_index" ON "_UserRooms"("B");

-- AddForeignKey
ALTER TABLE "ConnectedUser" ADD CONSTRAINT "ConnectedUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserRooms" ADD CONSTRAINT "_UserRooms_A_fkey" FOREIGN KEY ("A") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserRooms" ADD CONSTRAINT "_UserRooms_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
