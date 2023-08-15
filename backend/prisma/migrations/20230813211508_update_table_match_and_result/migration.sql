/*
  Warnings:

  - You are about to drop the column `bet_team_one` on the `Bet` table. All the data in the column will be lost.
  - You are about to drop the column `bet_team_two` on the `Bet` table. All the data in the column will be lost.
  - You are about to drop the column `match_api_id` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the `Score_Team` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[event_api_id]` on the table `Match` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `bet_team_away` to the `Bet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bet_team_home` to the `Bet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `closed_at` to the `Match` table without a default value. This is not possible if the table is not empty.
  - Added the required column `event_api_id` to the `Match` table without a default value. This is not possible if the table is not empty.
  - Added the required column `started_at` to the `Match` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Score_Team" DROP CONSTRAINT "Score_Team_match_id_fkey";

-- DropForeignKey
ALTER TABLE "Score_Team" DROP CONSTRAINT "Score_Team_team_id_fkey";

-- DropIndex
DROP INDEX "Match_match_api_id_key";

-- AlterTable
ALTER TABLE "Bet" DROP COLUMN "bet_team_one",
DROP COLUMN "bet_team_two",
ADD COLUMN     "bet_team_away" INTEGER NOT NULL,
ADD COLUMN     "bet_team_home" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Match" DROP COLUMN "match_api_id",
ADD COLUMN     "closed_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "event_api_id" TEXT NOT NULL,
ADD COLUMN     "started_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "team_away_id" TEXT,
ADD COLUMN     "team_away_probability" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "team_away_score" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "team_home_id" TEXT,
ADD COLUMN     "team_home_probability" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "team_home_score" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "draw_probability" SET DEFAULT 0;

-- DropTable
DROP TABLE "Score_Team";

-- CreateIndex
CREATE UNIQUE INDEX "Match_event_api_id_key" ON "Match"("event_api_id");

-- AddForeignKey
ALTER TABLE "Bet" ADD CONSTRAINT "Bet_match_id_fkey" FOREIGN KEY ("match_id") REFERENCES "Match"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_team_home_id_fkey" FOREIGN KEY ("team_home_id") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_team_away_id_fkey" FOREIGN KEY ("team_away_id") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;
