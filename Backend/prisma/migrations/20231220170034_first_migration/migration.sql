/*
  Warnings:

  - Added the required column `Public` to the `Room` table without a default value. This is not possible if the table is not empty.
  - Added the required column `creatorId` to the `Room` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Room" ADD COLUMN     "Public" BOOLEAN NOT NULL,
ADD COLUMN     "creatorId" INTEGER NOT NULL,
ADD COLUMN     "password" TEXT;

-- CreateTable
CREATE TABLE "_AdminRooms" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_AdminRooms_AB_unique" ON "_AdminRooms"("A", "B");

-- CreateIndex
CREATE INDEX "_AdminRooms_B_index" ON "_AdminRooms"("B");

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AdminRooms" ADD CONSTRAINT "_AdminRooms_A_fkey" FOREIGN KEY ("A") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AdminRooms" ADD CONSTRAINT "_AdminRooms_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
