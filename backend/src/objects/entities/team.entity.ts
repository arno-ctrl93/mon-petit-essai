import { Team } from "@prisma/client";

export default class TeamEntity {
    private readonly id: string;
    private name: string;
    private apiId: string;

    public static toEntity(team: Team): TeamEntity {
        const teamEntity = new TeamEntity(team.id, team.name, team.team_api_id);
        return teamEntity;
    }

    constructor(id: string, name: string, apiId: string) {
        this.id = id;
        this.name = name;
        this.apiId = apiId;
    }

    public getId(): string {
        return this.id;
    }

    public getName(): string {
        return this.name;
    }

    public getApiId(): string {
        return this.apiId;
    }
}