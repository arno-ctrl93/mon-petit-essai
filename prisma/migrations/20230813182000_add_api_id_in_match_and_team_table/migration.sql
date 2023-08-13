/*
  Warnings:

  - You are about to drop the column `rating` on the `Score_Team` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[match_api_id]` on the table `Match` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[team_api_id]` on the table `Team` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `draw_probability` to the `Match` table without a default value. This is not possible if the table is not empty.
  - Added the required column `match_api_id` to the `Match` table without a default value. This is not possible if the table is not empty.
  - Added the required column `victory_probability` to the `Score_Team` table without a default value. This is not possible if the table is not empty.
  - Added the required column `team_api_id` to the `Team` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Match" ADD COLUMN     "draw_probability" INTEGER NOT NULL,
ADD COLUMN     "match_api_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Score_Team" DROP COLUMN "rating",
ADD COLUMN     "victory_probability" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Team" ADD COLUMN     "team_api_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Match_match_api_id_key" ON "Match"("match_api_id");

-- CreateIndex
CREATE UNIQUE INDEX "Team_team_api_id_key" ON "Team"("team_api_id");
