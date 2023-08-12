/*
  Warnings:

  - You are about to drop the column `created_at` on the `Bet` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_at` on the `Bet` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `Bet` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `Group` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_at` on the `Group` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `Group` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `Score_Team` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_at` on the `Score_Team` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `Score_Team` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `Team` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_at` on the `Team` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `Team` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_at` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Bet" DROP COLUMN "created_at",
DROP COLUMN "deleted_at",
DROP COLUMN "updated_at";

-- AlterTable
ALTER TABLE "Group" DROP COLUMN "created_at",
DROP COLUMN "deleted_at",
DROP COLUMN "updated_at";

-- AlterTable
ALTER TABLE "Score_Team" DROP COLUMN "created_at",
DROP COLUMN "deleted_at",
DROP COLUMN "updated_at";

-- AlterTable
ALTER TABLE "Team" DROP COLUMN "created_at",
DROP COLUMN "deleted_at",
DROP COLUMN "updated_at";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "created_at",
DROP COLUMN "deleted_at",
DROP COLUMN "updated_at";
