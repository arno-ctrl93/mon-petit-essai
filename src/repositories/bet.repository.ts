import { Bet, PrismaClient } from "@prisma/client";
import createOrUpdateBetInboundDto from "../objects/dtos/inbound/create-or-update-bet.inbound.dto";
import BetEntity, { BetWithMatch } from "../objects/entities/bet.entity";

const prisma = new PrismaClient();

async function getBetByUserAndMatchIdOrNull(userId: string, matchId: string) {
    console.log("BetRepository - getBetByUserAndMatchIdOrNull");

    try {

        const bets: Bet[] = await prisma.bet.findMany({
            where: {
                AND: [
                    {
                        user_id: userId
                    },
                    {
                        match_id: matchId
                    }
                ]
            }
        });

        if (bets.length == 0) {
            return null;
        }

        if (bets.length > 1) {
            throw new Error("BetRepository - getBetByUserAndMatchIdOrNull - more than one bet found");
        }

        const betEntity = BetEntity.toEntity(bets[0]);

        return betEntity;

    }
    catch (error) {
        console.log(error);
        throw error;
    }
}






async function createBet(dto: createOrUpdateBetInboundDto, userId: string, matchId: string) {
    console.log("BetRepository - createBet");

    try {

        const bet: Bet = await prisma.bet.create({
            data: {
                bet_team_home: dto.betHomeTeam,
                bet_team_away: dto.betAwayTeam,
                user_id: userId,
                match_id: matchId
            }
        });

        const betEntity = BetEntity.toEntity(bet);

        return betEntity;

    }
    catch (error) {
        console.log(error);
        throw error;
    }
}

async function updateScoreBet(betId: string, score: number) {
    console.log("BetRepository - updateScoreBet");

    try {
        await prisma.bet.update({
            where: {
                id: betId
            },
            data: {
                bet_score: score
            }

        });
    }
    catch (error) {
        console.log(error);
        throw error;
    }
}


async function updateBet(dto: createOrUpdateBetInboundDto, betId: string) {
    console.log("BetRepository - updateBet");

    try {

        const bet: Bet = await prisma.bet.update({
            where: {
                id: betId
            },
            data: {
                bet_team_home: dto.betHomeTeam,
                bet_team_away: dto.betAwayTeam
            }
        });

        const betEntity = BetEntity.toEntity(bet);

        return betEntity;

    }
    catch (error) {
        console.log(error);
        throw error;
    }
}

async function fetchBetByMatchId(matchApiId: string) {
    console.log("BetRepository - fetchBetByMatchId");

    try {
        const bets: BetWithMatch[] = await prisma.bet.findMany({
            where: {
                match: {
                    event_api_id: matchApiId
                },
            },
            include: {
                match: true
            }
        });

        const betEntities: BetEntity[] = bets.map((bet) => {
            return BetEntity.toEntity(bet);
        });

        return betEntities;

    }
    catch (error) {
        console.log(error);
        throw error;
    }
}

export default {
    createBet,
    updateBet,
    getBetByUserAndMatchIdOrNull,
    fetchBetByMatchId,
    updateScoreBet
}

