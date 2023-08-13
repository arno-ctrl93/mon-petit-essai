/*
  Warnings:

  - Made the column `team_away_id` on table `Match` required. This step will fail if there are existing NULL values in that column.
  - Made the column `team_home_id` on table `Match` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Match" DROP CONSTRAINT "Match_team_away_id_fkey";

-- DropForeignKey
ALTER TABLE "Match" DROP CONSTRAINT "Match_team_home_id_fkey";

-- AlterTable
ALTER TABLE "Match" ALTER COLUMN "closed_at" DROP NOT NULL,
ALTER COLUMN "team_away_id" SET NOT NULL,
ALTER COLUMN "team_home_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_team_home_id_fkey" FOREIGN KEY ("team_home_id") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_team_away_id_fkey" FOREIGN KEY ("team_away_id") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
