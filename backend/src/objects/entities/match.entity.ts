import { Match, Prisma } from "@prisma/client";
import TeamEntity from "./team.entity";
import BetEntity from "./bet.entity";

const matchWithTeams = Prisma.validator<Prisma.MatchArgs>()({
    include: {
        team_home: true,
        team_away: true
    }
});

const matchWithBets = Prisma.validator<Prisma.MatchArgs>()({
    include: {
        Bet: true
    }
});

export type MatchWithTeams = Prisma.MatchGetPayload<typeof matchWithTeams>;

export type MatchWithBets = Prisma.MatchGetPayload<typeof matchWithBets>;

export type MatchWithTeamsAndBets = Prisma.MatchGetPayload<typeof matchWithTeams> & Prisma.MatchGetPayload<typeof matchWithBets>;

export default class MatchEntity {
    private readonly id: string;
    private readonly apiId: string;
    private round: string;
    private startedAt: Date;
    private closedAt: Date | null;
    private teamHome: TeamEntity | null;
    private teamAway: TeamEntity | null;
    private bets: BetEntity[] | null;
    private scoreHome: number;
    private scoreAway: number;
    private probabilityHome: number;
    private probabilityAway: number;
    private probabilityDraw: number;

    public static toEntity(match: Match): MatchEntity;
    public static toEntity(match: MatchWithTeams): MatchEntity;
    public static toEntity(match: MatchWithTeamsAndBets): MatchEntity {
        const matchEntity = new MatchEntity(
            match.id,
            match.event_api_id,
            match.round,
            match.started_at,
            match.closed_at,
            match.team_home_score,
            match.team_away_score,
            match.team_home_probability,
            match.team_away_probability,
            match.draw_probability
        );

        if (match.team_home != null) {
            matchEntity.teamHome = TeamEntity.toEntity(match.team_home);
        }

        if (match.team_away != null) {
            matchEntity.teamAway = TeamEntity.toEntity(match.team_away);
        }

        if (match.Bet != null) {
            matchEntity.bets = match.Bet.map((bet) => {
                return BetEntity.toEntity(bet);
            });
        }

        return matchEntity;
    }

    constructor(id: string, apiId: string, round: string, startedAt: Date, closedAt: Date | null, scoreHome: number, scoreAway: number, probabilityHome: number, probabilityAway: number, probabilityDraw: number) {
        this.id = id;
        this.apiId = apiId;
        this.round = round;
        this.startedAt = startedAt;
        this.closedAt = closedAt;
        this.teamHome = null;
        this.teamAway = null;
        this.bets = null;
        this.scoreHome = scoreHome;
        this.scoreAway = scoreAway;
        this.probabilityHome = probabilityHome;
        this.probabilityAway = probabilityAway;
        this.probabilityDraw = probabilityDraw;
    }

    getId(): string {
        return this.id;
    }

    getApiId(): string {
        return this.apiId;
    }

    getRound(): string {
        return this.round;
    }

    getStartedAt(): Date {
        return this.startedAt;
    }

    getClosedAt(): Date | null {
        return this.closedAt;
    }

    getTeamHome(): TeamEntity | null {
        return this.teamHome;
    }

    getTeamAway(): TeamEntity | null {
        return this.teamAway;
    }

    getScoreHome(): number {
        return this.scoreHome;
    }

    getScoreAway(): number {
        return this.scoreAway;
    }

    getProbabilityHome(): number {
        return this.probabilityHome;
    }

    getProbabilityAway(): number {
        return this.probabilityAway;
    }

    getProbabilityDraw(): number {
        return this.probabilityDraw;
    }

    // only if you do a join with userId between bet to have only one bet by match
    getFirstBet(): BetEntity | null {
        if (this.bets == null) {
            return null;
        }
        return this.bets[0];
    }
}