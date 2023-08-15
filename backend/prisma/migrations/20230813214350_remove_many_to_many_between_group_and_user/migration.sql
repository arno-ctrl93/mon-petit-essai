/*
  Warnings:

  - You are about to drop the `Groups_Users` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `group_id` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Groups_Users" DROP CONSTRAINT "Groups_Users_group_id_fkey";

-- DropForeignKey
ALTER TABLE "Groups_Users" DROP CONSTRAINT "Groups_Users_user_id_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "group_id" TEXT NOT NULL;

-- DropTable
DROP TABLE "Groups_Users";

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
