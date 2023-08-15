import { PrismaClient } from "@prisma/client";
import TeamEntity from "../objects/entities/team.entity";

const prisma = new PrismaClient();


async function getTeamByApiIdOrNull(id: string) {
    console.log("TeamRepository - getTeamByApiId");

    try {

        const team = await prisma.team.findUnique({
            where: {
                team_api_id: id
            }
        });

        if (team == null) {
            return null;
        }

        const teamEntity = TeamEntity.toEntity(team);
        return teamEntity;
    }
    catch (error) {
        console.log(error);
        throw error;
    }
}

async function createTeam(name: string, apiId: string) {
    console.log("TeamRepository - createTeam");

    try {
        const team = await prisma.team.create({
            data: {
                name: name,
                team_api_id: apiId
            }
        });

        const teamEntity = TeamEntity.toEntity(team);
        return teamEntity;
    }
    catch (error) {
        console.log(error);
        throw error;
    }
}

export default {
    getTeamByApiIdOrNull,
    createTeam
}