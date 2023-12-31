
import TeamEntity from "../objects/entities/team.entity";
import matchRepository from "../repositories/match.repository";
import rugbyApiRepository, { Match, MatchEventStat } from "../repositories/rugby-api.repository";
import rugbyApiService from "./rugby-api.service";
import teamRepository from "../repositories/team.repository";
import MatchEntity from "../objects/entities/match.entity";
import UserEntity from "../objects/entities/user.entity";
import userRepository from "../repositories/user.repository";
import betRepository from "../repositories/bet.repository";
import BetEntity from "../objects/entities/bet.entity";


async function createMatch(match: Match) {
    console.log("MatchService - createMatch");

    const teamHomeEntity: TeamEntity = await teamRepository.getTeamByApiIdOrNull(match.firstTeam.firstTeamId).then(async (team: TeamEntity | null) => {
        if (team == null) {
            const createdTeamEntity = await teamRepository.createTeam(match.firstTeam.firstTeamName, match.firstTeam.firstTeamId);
            return createdTeamEntity;
        }
        return team;
    });

    const teamAwayEntity: TeamEntity = await teamRepository.getTeamByApiIdOrNull(match.secondTeam.secondTeamId).then(async (team: TeamEntity | null) => {
        if (team == null) {
            const createdTeamEntity = await teamRepository.createTeam(match.secondTeam.secondTeamName, match.secondTeam.secondTeamId);
            return createdTeamEntity;
        }
        return team;
    });



    try {
        console.log("MatchService - createMatch - " + match + " - " + teamHomeEntity + " - " + teamAwayEntity);
        console.log('match probabilities: ' + match.probability.firstTeam + ' - ' + match.probability.secondTeam + ' - ' + match.probability.draw);
        const createdMatch: MatchEntity = await matchRepository.createMatch(match, teamHomeEntity, teamAwayEntity);
        console.log("MatchService - createMatch - " + createdMatch);
        return createdMatch;
    }
    catch (error) {
        console.log(error);
        throw error;
    }
}

async function updateTeamsMatch(match: Match, matchEntity: MatchEntity) {
    console.log("MatchService - updateTeamsMatch");

    const teamHomeEntity: TeamEntity = await teamRepository.getTeamByApiIdOrNull(match.firstTeam.firstTeamId).then(async (team: TeamEntity | null) => {
        if (team == null) {
            const createdTeamEntity = await teamRepository.createTeam(match.firstTeam.firstTeamName, match.firstTeam.firstTeamId);
            return createdTeamEntity
        }
        return team;
    });

    const teamAwayEntity: TeamEntity = await teamRepository.getTeamByApiIdOrNull(match.secondTeam.secondTeamId).then(async (team: TeamEntity | null) => {
        if (team == null) {
            const createdTeamEntity = await teamRepository.createTeam(match.secondTeam.secondTeamName, match.secondTeam.secondTeamId);
            return createdTeamEntity;
        }
        return team;
    });

    try {
        await matchRepository.updateTeamsMatch(matchEntity, teamHomeEntity, teamAwayEntity);
        return;
    }
    catch (error) {
        console.log(error);
        throw error;
    }
}

async function createOrUpdateMatches(matches: Match[]) {

    const now = new Date();

    for (const match of matches) {
        console.log('Match : ' + JSON.stringify(match));

        // compare startTime String to now String
        const matchDate = new Date(match.startTime);
        if (matchDate < now) {
            console.log("MatchService - fetchAndCreateOrUpdateMatches - match already started");
            continue;
        }

        // check if match already exists
        const matchEntity = await matchRepository.getMatchByApiIdOrNull(match.id).catch((error) => {
            throw error;
        });
        if (matchEntity == null) {
            console.log("MatchService - fetchAndCreateOrUpdateMatches - match doesn't exist");
            await createMatch(match).catch((error) => {
                throw error;
            });
            continue;
        }

        console.log("MatchService - fetchAndCreateOrUpdateMatches - match already exists");
        // patch if value changed

        if (matchEntity.getProbabilityHome() != match.probability.firstTeam
            || matchEntity.getProbabilityAway() != match.probability.secondTeam
            || matchEntity.getProbabilityDraw() != match.probability.draw) {
            console.log("MatchService - fetchAndCreateOrUpdateMatches - match probability changed");
            await matchRepository.updateProbabilityMatch(match, matchEntity).catch((error) => {
                throw error;
            });
        }

        if (matchEntity.getTeamHome()?.getApiId() != match.firstTeam.firstTeamId
            || matchEntity.getTeamAway()?.getApiId() != match.secondTeam.secondTeamId) {
            console.log("MatchService - fetchAndCreateOrUpdateMatches - match teams changed");
            await updateTeamsMatch(match, matchEntity).catch((error) => {
                throw error;
            });
        }

    }
}


async function fetchAndCreateOrUpdateMatches() {
    console.log("MatchService - fetchAndCreateOrUpdateMatches");
    const matches: Match[] = await rugbyApiService.fetchMatches().catch((error) => {
        console.log(error);
        throw error;
    });

    await createOrUpdateMatches(matches).catch((error) => {
        console.log(error);
        throw error;
    });
}

async function fetchTodayPastAndNotClosedMatches() {
    console.log("MatchService - fetchTodayPastAndNotClosedMatches");

    const matches: MatchEntity[] = await matchRepository.fetchTodayPastAndNotClosedMatches().catch((error) => {
        console.log(error);
        throw error;
    });

    return matches;
}

async function closeMatches(matchEventStats: MatchEventStat[]) {
    console.log("MatchService - updateMatches");

    for (const matchEventStat of matchEventStats) {
        await matchRepository.closeMatch(matchEventStat).catch((error) => {
            throw error;
        });
    }
}

async function updateBetsWhenMatchIsClosed(matchEventStat: MatchEventStat){
    console.log("MatchService - updateBetsWhenMatchIsClosed");

    const betEntities: BetEntity[] = await betRepository.fetchBetByMatchId(matchEventStat.api_id).catch((error) => {
        throw error;
    });

    for (const betEntity of betEntities){
        betEntity.setBetScore();
        await betRepository.updateScoreBet(betEntity.getId(), betEntity.getBetScore(), betEntity.getBetScoreDiff()).catch((error) => {
            throw error;
        });
    }
}

async function updateEndedMatches() {
    console.log("MatchService - updateEndedMatches");

    const matches: MatchEntity[] = await fetchTodayPastAndNotClosedMatches().catch((error) => {
        console.log(error);
        throw error;
    });

    for (const match of matches) {
        const matchEventStat: MatchEventStat = await rugbyApiRepository.getMatchStatusById(match.getApiId()).catch((error) => {
            throw error;
        });

        console.log("Match event stat : " + JSON.stringify(matchEventStat))

        if (matchEventStat.is_ended) {
            console.log("MatchService - fetchTodayPastAndNotClosedMatches - match is ended");
            await matchRepository.closeMatch(matchEventStat).catch((error) => {
                throw error;
            });

            await updateBetsWhenMatchIsClosed(matchEventStat).catch((error) => {
                throw error;
            });
        }
        // wait between each call to rugby api
        // eslint-disable-next-line @typescript-eslint/no-loop-func
        await new Promise(resolve => setTimeout(resolve, 1200));
    }


}

export async function fetchMatchesWithBet(userEmail: string) {
    console.log("MatchService - fetchPastLiveUpcomingMatches");

    const userEntity: UserEntity = await userRepository.getUser(userEmail).catch((error) => {
        console.log(error);
        throw error;
    });

    const matches: MatchEntity[] = await matchRepository.fetchMatchesWithBetsByUserId(userEntity.getId()).catch((error) => {
        console.log(error);
        throw error;
    });

    return matches;
}


export default {
    fetchAndCreateOrUpdateMatches,
    createOrUpdateMatches,
    fetchTodayPastAndNotClosedMatches,
    updateEndedMatches,
    closeMatches,
    fetchMatchesWithBet
}
