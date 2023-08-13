-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_group_id_fkey";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "group_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "Group"("id") ON DELETE SET NULL ON UPDATE CASCADE;
