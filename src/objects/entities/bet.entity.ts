import { Bet, Prisma } from "@prisma/client";
import UserEntity from "./user.entity";
import MatchEntity from "./match.entity";


const betWithMatch = Prisma.validator<Prisma.BetArgs>()({
    include: {
        match: true
    }
});

const betWithUser = Prisma.validator<Prisma.BetArgs>()({
    include: {
        user: true
    }
});

export type BetWithMatch = Prisma.BetGetPayload<typeof betWithMatch>;

export type BetWithUser = Prisma.BetGetPayload<typeof betWithUser>;

export type BetWithUserAndMatch = Prisma.BetGetPayload<typeof betWithUser> & Prisma.BetGetPayload<typeof betWithMatch>;

export default class BetEntity {
    private readonly id: string;

    private user: UserEntity | null;
    private match: MatchEntity | null;

    private betHomeTeam: number;
    private betAwayTeam: number;



    public static toEntity(bet: Bet): BetEntity;
    public static toEntity(bet: BetWithMatch): BetEntity;
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

    public getScore(): number {
        if (this.match == null)
            return 0;
        // team home win and predict team home win
        if (this.match.getScoreHome() > this.match.getScoreAway() && this.betHomeTeam > this.betAwayTeam) {
            if (this.match.getScoreHome() == this.betHomeTeam && this.match.getScoreAway() == this.betAwayTeam) {
                console.log("perfect prediction : team home win");
                return this.match.getProbabilityHome() * 2;
            }
            console.log("good prediction : team home win");
            return this.match.getProbabilityHome();
        }
        // team away win and predict team away win
        if (this.match.getScoreHome() < this.match.getScoreAway() && this.betHomeTeam < this.betAwayTeam) {
            if (this.match.getScoreHome() == this.betHomeTeam && this.match.getScoreAway() == this.betAwayTeam) {
                console.log("perfect prediction : team away win");
                return this.match.getProbabilityAway() * 2;
            }
            console.log("good prediction : team away win");
            return this.match.getProbabilityAway();
        }
        // draw and predict draw
        if (this.match.getScoreHome() == this.match.getScoreAway() && this.betHomeTeam == this.betAwayTeam) {
            if (this.match.getScoreHome() == this.betHomeTeam && this.match.getScoreAway() == this.betAwayTeam) {
                console.log("perfect prediction : draw");
                return this.match.getProbabilityDraw() * 2;
            }
            console.log("good prediction : draw");
            return this.match.getProbabilityDraw();
        }
        console.log("bad prediction");
        return 0;
    }

}