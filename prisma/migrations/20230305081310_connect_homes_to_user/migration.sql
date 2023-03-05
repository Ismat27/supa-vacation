/*
  Warnings:

  - Added the required column `ownerId` to the `Home` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Home" ADD COLUMN     "ownerId" TEXT;

-- default value for exissting home
UPDATE "Home" SET "ownerId" = 'cleughx9r0000pe3ow1z2nkq9' WHERE "ownerId" IS NULL;

-- change ownerId to a required column
ALTER TABLE "Home" ALTER COLUMN "ownerId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Home" ADD CONSTRAINT "Home_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
