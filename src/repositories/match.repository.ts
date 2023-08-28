import { Match, PrismaClient } from "@prisma/client";
import MatchEntity, { MatchWithTeams, MatchWithTeamsAndBets } from "../objects/entities/match.entity";
import { MatchEventStat, Match as MatchJson } from "./rugby-api.repository";
import TeamEntity from "../objects/entities/team.entity";
const prisma = new PrismaClient();

async function getMatchByApiIdOrNull(id: string) {
    console.log("MatchRepository - getMatchByApiId");

    try {
        const match: MatchWithTeams | null = await prisma.match.findUnique({
            where: {
                event_api_id: id
            },
            include: {
                team_home: true,
                team_away: true
            }
        });

        if (match == null) {
            return null;
        }

        const matchEntity: MatchEntity = MatchEntity.toEntity(match);
        return matchEntity;
    }
    catch (error) {
        console.log(error);
        throw error;
    }
}

async function createMatch(match: MatchJson, teamHomeEntity: TeamEntity, teamAwayEntity: TeamEntity) {
    console.log("MatchRepository - createMatch");

    try {
        const createdMatch: Match = await prisma.match.create({
            data: {
                event_api_id: match.id,
                round: match.stageName,
                started_at: match.startTime,
                team_home_id: teamHomeEntity.getId(),
                team_away_id: teamAwayEntity.getId(),
                team_home_probability: match.probability.firstTeam,
                team_away_probability: match.probability.secondTeam,
                draw_probability: match.probability.draw
            }
        });

        const matchEntity: MatchEntity = MatchEntity.toEntity(createdMatch);
        return matchEntity;
    }
    catch (error) {
        console.log(error);
        throw error;
    }
}

async function updateProbabilityMatch(match: MatchJson, matchEntity: MatchEntity) {
    console.log("MatchRepository - updateProbabilityMatch");

    try {
        const updatedMatch: Match = await prisma.match.update({
            where: {
                id: matchEntity.getId()
            },
            data: {
                team_home_probability: match.probability.firstTeam,
                team_away_probability: match.probability.secondTeam,
                draw_probability: match.probability.draw
            }
        });

        const updatedMatchEntity: MatchEntity = MatchEntity.toEntity(updatedMatch);
        return updatedMatchEntity;
    }
    catch (error) {
        console.log(error);
        throw error;
    }
}

async function updateTeamsMatch(matchEntity: MatchEntity, teamHomeEntity: TeamEntity, teamAwayEntity: TeamEntity) {
    console.log("MatchRepository - updateTeamsMatch");

    try {
        const updatedMatch: Match = await prisma.match.update({
            where: {
                id: matchEntity.getId()
            },
            data: {
                team_home_id: teamHomeEntity.getId(),
                team_away_id: teamAwayEntity.getId()
            }
        });

        const updatedMatchEntity: MatchEntity = MatchEntity.toEntity(updatedMatch);
        return updatedMatchEntity;
    }
    catch (error) {
        console.log(error);
        throw error;
    }
}

async function fetchTodayPastAndNotClosedMatches() {
    console.log("MatchRepository - fetchTodayPastAndNotClosedMatches");

    // i want the matches that are not closed and started + time of a regualar rugby match before now
    const now: Date = new Date();
    console.log(now);
    const timeOfRegularRugbyMatch: number = 1000 * 60 * 95; // 80 minutes + 10 minutes of break + 5 minutes of extra time
    const timeOfRegularRugbyMatchBeforeNow: Date = new Date(now.getTime() - timeOfRegularRugbyMatch);
    console.log(timeOfRegularRugbyMatchBeforeNow);

    try {
        const matches: Match[] | null = await prisma.match.findMany({
            where: {
                started_at: {
                    lte: timeOfRegularRugbyMatchBeforeNow
                },
                closed_at: {
                    equals: null
                }
            },
        });

        if (matches == null) {
            return [];
        }

        console.log(matches);

        const matchesEntity: MatchEntity[] = matches.map((match: Match) => {
            return MatchEntity.toEntity(match);
        });

        return matchesEntity;
    }
    catch (error) {
        console.log(error);
        throw error;
    }
}

async function closeMatch(matchEventStat: MatchEventStat) {
    console.log("MatchRepository - closeMatch");

    try {
        const match: Match = await prisma.match.update({
            where: {
                event_api_id: matchEventStat.api_id
            },
            data: {
                closed_at: new Date(),
                team_home_score: matchEventStat.home_score,
                team_away_score: matchEventStat.away_score
            }
        });

        console.log("closed match: " + match);
    } catch (error) {
        console.log(error);
        throw error;
    }
}

async function fetchMatchesWithBetsByUserId(userId: string) {
    console.log("MatchRepository - fetchPastLiveUpcomingMatches");

    // need to translate this sql query to prismas query language
    // select * from public."Match" m
    // left join public."Bet" b on b.match_id = m.id and b.user_id = '02c20d39-b522-4584-bb95-d64c231b8a98'

    const matches: MatchWithTeamsAndBets[] | null = await prisma.match.findMany({
        select: {
            team_home: {
                select: {
                    id: true,
                    name: true,
                    team_api_id: true,
                },
            },
            team_away: {
                select: {
                    id: true,
                    name: true,
                    team_api_id: true,
                },
            },
            Bet: {
                select: {
                    id: true,
                    user_id: true,
                    match_id: true,
                    bet_team_away: true,
                    bet_team_home: true,
                    bet_score: true,
                },
                where: {
                    user_id: userId
                }
            },
            id: true,
            event_api_id: true,
            team_home_score: true,
            team_away_score: true,
            team_away_id: true,
            team_home_id: true,
            team_home_probability: true,
            team_away_probability: true,
            draw_probability: true,
            started_at: true,
            round: true,
            closed_at: true,

        },
        orderBy: {
            started_at: 'asc'
        }
    });

    const matchEntities: MatchEntity[] = matches.map((match: MatchWithTeamsAndBets) => {
        return MatchEntity.toEntity(match);
    });

    return matchEntities;
}


export default {
    getMatchByApiIdOrNull,
    createMatch,
    updateProbabilityMatch,
    updateTeamsMatch,
    fetchTodayPastAndNotClosedMatches,
    closeMatch,
    fetchMatchesWithBetsByUserId
}