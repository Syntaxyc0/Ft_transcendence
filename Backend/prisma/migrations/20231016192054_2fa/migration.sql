-- AlterTable
ALTER TABLE "User" ADD COLUMN     "is2faenabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is2favalidated" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "twofacode" TEXT NOT NULL DEFAULT '';
