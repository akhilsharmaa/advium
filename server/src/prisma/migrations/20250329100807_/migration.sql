/*
  Warnings:

  - You are about to drop the column `author_id` on the `Post` table. All the data in the column will be lost.
  - Added the required column `user_id` to the `Image` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_post_id_fkey";

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_author_id_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_profile_img_id_fkey";

-- AlterTable
ALTER TABLE "Image" ADD COLUMN     "user_id" INTEGER NOT NULL,
ALTER COLUMN "post_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "author_id",
ADD COLUMN     "user_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "Post"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
