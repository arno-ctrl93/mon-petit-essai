
import TeamEntity from "../objects/entities/team.entity";
import matchRepository from "../repositories/match.repository";
import { Match } from "../repositories/rugby-api.repository";
import rugbyApiService from "./rugby-api.service";
import teamRepository from "../repositories/team.repository";
import MatchEntity from "../objects/entities/match.entity";


async function createMatch(match: Match) {
    console.log("MatchService - createMatch");

    const teamHomeEntity: TeamEntity = await teamRepository.getTeamByApiIdOrNull(match.firstTeam.firstTeamId).then(async (team: TeamEntity | null) => {
        if (team == null) {
            return await teamRepository.createTeam(match.firstTeam.firstTeamName, match.firstTeam.firstTeamId);
        }
        return team;
    });

    const teamAwayEntity: TeamEntity = await teamRepository.getTeamByApiIdOrNull(match.secondTeam.secondTeamId).then(async (team: TeamEntity | null) => {
        if (team == null) {
            return await teamRepository.createTeam(match.secondTeam.secondTeamName, match.secondTeam.secondTeamId);
        }
        return team;
    });



    try {
        const createdMatch: MatchEntity = await matchRepository.createMatch(match, teamHomeEntity, teamAwayEntity);
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
            return await teamRepository.createTeam(match.firstTeam.firstTeamName, match.firstTeam.firstTeamId);
        }
        return team;
    });

    const teamAwayEntity: TeamEntity = await teamRepository.getTeamByApiIdOrNull(match.secondTeam.secondTeamId).then(async (team: TeamEntity | null) => {
        if (team == null) {
            return await teamRepository.createTeam(match.secondTeam.secondTeamName, match.secondTeam.secondTeamId);
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


async function fetchAndCreateOrUpdateMatches() {
    console.log("MatchService - fetchAndCreateOrUpdateMatches");

    try {
        const matches: Match[] = await rugbyApiService.fetchMatches();
        const now = new Date();

        for (const match of matches) {

            // compare startTime String to now String
            const matchDate = new Date(match.startTime);
            if (matchDate < now) {
                console.log("MatchService - fetchAndCreateOrUpdateMatches - match already started");
                continue;
            }

            // check if match already exists
            const matchEntity = await matchRepository.getMatchByApiIdOrNull(match.id);
            if (matchEntity == null) {
                console.log("MatchService - fetchAndCreateOrUpdateMatches - match doesn't exist");
                await createMatch(match);
                continue;
            }

            console.log("MatchService - fetchAndCreateOrUpdateMatches - match already exists");
            // patch if value changed

            if (matchEntity.getProbabilityHome() != match.probability.firstTeam
                || matchEntity.getProbabilityAway() != match.probability.secondTeam
                || matchEntity.getProbabilityDraw() != match.probability.draw) {
                await matchRepository.updateProbabilityMatch(match, matchEntity);
            }

            if (matchEntity.getTeamHome()?.getApiId() != match.firstTeam.firstTeamId
                || matchEntity.getTeamAway()?.getApiId() != match.secondTeam.secondTeamId) {
                await updateTeamsMatch(match, matchEntity);
            }

        }
    }
    catch (error) {
        console.log(error);
        throw error;
    }
}


export default {
    fetchAndCreateOrUpdateMatches
}