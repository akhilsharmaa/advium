/*
  Warnings:

  - The values [DISLIKE] on the enum `ReactionEnum` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `imageId` on the `Post` table. All the data in the column will be lost.
  - Added the required column `post_id` to the `Image` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reaction_count` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imageId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ReactionEnum_new" AS ENUM ('LIKE');
ALTER TABLE "Reaction" ALTER COLUMN "reaction" TYPE "ReactionEnum_new" USING ("reaction"::text::"ReactionEnum_new");
ALTER TYPE "ReactionEnum" RENAME TO "ReactionEnum_old";
ALTER TYPE "ReactionEnum_new" RENAME TO "ReactionEnum";
DROP TYPE "ReactionEnum_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_imageId_fkey";

-- AlterTable
ALTER TABLE "Image" ADD COLUMN     "post_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "imageId",
ADD COLUMN     "reaction_count" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Reaction" ALTER COLUMN "reaction" SET DEFAULT 'LIKE';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "imageId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
