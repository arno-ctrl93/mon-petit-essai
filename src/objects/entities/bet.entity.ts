import { Bet, Prisma } from "@prisma/client";
import UserEntity from "./user.entity";
import MatchEntity from "./match.entity";


const betWithUserAndMatch = Prisma.validator<Prisma.BetArgs>()({
    include: {
        user: true,
        match: true
    }
});

export type BetWithUserAndMatch = Prisma.BetGetPayload<typeof betWithUserAndMatch>;


export default class BetEntity {
    private readonly id: string;

    private user: UserEntity | null;
    private match: MatchEntity | null;

    private betHomeTeam: number;
    private betAwayTeam: number;



    public static toEntity(bet: Bet): BetEntity;
    public static toEntity(bet: BetWithUserAndMatch): BetEntity {
        const betEntity = new BetEntity(
            bet.id,
            bet.bet_team_home,
            bet.bet_team_away
        );

        if (bet.user != null) {
            betEntity.user = UserEntity.toEntity(bet.user);
        }

        if (bet.match != null) {
            betEntity.match = MatchEntity.toEntity(bet.match);
        }
        return betEntity;
    }

    constructor(id: string, betHomeTeam: number, betAwayTeam: number) {
        this.id = id;
        this.user = null;
        this.match = null;
        this.betHomeTeam = betHomeTeam;
        this.betAwayTeam = betAwayTeam;
    }

    // getters and setters

    public getId(): string {
        return this.id;
    }

    public getUser(): UserEntity | null {
        return this.user;
    }

    public getMatch(): MatchEntity | null {
        return this.match;
    }

    public getBetHomeTeam(): number {
        return this.betHomeTeam;
    }

    public getBetAwayTeam(): number {
        return this.betAwayTeam;
    }

}