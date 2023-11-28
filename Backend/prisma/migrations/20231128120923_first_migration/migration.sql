-- CreateTable
CREATE TABLE "ConnectedUser" (
    "id" SERIAL NOT NULL,
    "socketId" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "ConnectedUser_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ConnectedUser" ADD CONSTRAINT "ConnectedUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
