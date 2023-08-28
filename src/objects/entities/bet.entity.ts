import { Bet, Prisma } from "@prisma/client";
import UserEntity from "./user.entity";
import MatchEntity from "./match.entity";
import { calculateDifferenceBetweenScoreAndBet } from "../../helper/calculate-difference.misc";


enum BetScoreResult {
    WIN = "WIN",
    LOSE = "LOSE",
    PERFECT = "PERFECT",
    CLOSED = "CLOSED"
}

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

    private betScore: number;

    private betScoreDiff: number;

    public static toEntity(bet: Bet): BetEntity;
    public static toEntity(bet: BetWithMatch): BetEntity;
    public static toEntity(bet: BetWithUserAndMatch): BetEntity {
        const betEntity = new BetEntity(
            bet.id,
            bet.bet_team_home,
            bet.bet_team_away,
            bet.bet_score,
            bet.bet_score_diff
        );

        if (bet.user != null) {
            betEntity.user = UserEntity.toEntity(bet.user);
        }

        if (bet.match != null) {
            betEntity.match = MatchEntity.toEntity(bet.match);
        }
        return betEntity;
    }

    constructor(id: string, betHomeTeam: number, betAwayTeam: number, betScore: number, betScoreDiff: number) {
        this.id = id;
        this.user = null;
        this.match = null;
        this.betHomeTeam = betHomeTeam;
        this.betAwayTeam = betAwayTeam;
        this.betScore = betScore;
        this.betScoreDiff = betScoreDiff;
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

    public getBetScore(): number {
        return this.betScore;
    }

    public getBetScoreDiff(): number {
        return this.betScoreDiff;
    }

    public getBetScoreResult(): BetScoreResult {
        if (this.betScore === 0) {
            return BetScoreResult.LOSE;
        }
        else if (this.betScoreDiff === 0) {
            return BetScoreResult.PERFECT;
        }
        else if (this.betScoreDiff < 7) {
            return BetScoreResult.CLOSED;
        }
        else {
            return BetScoreResult.WIN;
        }
    }


    public setBetScore(): void {
        if (this.match == null) {
            throw new Error("BetEntity - setBetScore - match is null");
        }

        if (this.match.getClosedAt() == null) {
            throw new Error("BetEntity - setBetScore - match is not closed");
        }

        const scoreHome = this.match.getScoreHome();
        const scoreAway = this.match.getScoreAway();

        const matchDiff = calculateDifferenceBetweenScoreAndBet(scoreHome, scoreAway, this.betHomeTeam, this.betAwayTeam);

        if (scoreHome === scoreAway && this.betHomeTeam === this.betAwayTeam){
            if (matchDiff === 0){
                this.betScore = this.match.getProbabilityDraw() * 2;
            }
            else if (matchDiff < 7){
                this.betScore = Math.round(this.match.getProbabilityDraw() * 1.5);
            }
            else {
                this.betScore = this.match.getProbabilityDraw();
            }
        }
        else if (scoreHome < scoreAway && this.betHomeTeam < this.betAwayTeam) {
            if (matchDiff === 0){
                this.betScore = this.match.getProbabilityAway() * 2;
            }
            else if (matchDiff < 7){
                this.betScore = Math.round(this.match.getProbabilityAway() * 1.5);
            }
            else {
                this.betScore = this.match.getProbabilityAway();
            }

        }
        else if (scoreHome > scoreAway && this.betHomeTeam > this.betAwayTeam) {
            if (matchDiff === 0){
                this.betScore = this.match.getProbabilityHome() * 2;
            }
            else if (matchDiff < 7){
                this.betScore = Math.round(this.match.getProbabilityHome() * 1.5);
            }
            else {
                this.betScore = this.match.getProbabilityHome();
            }
        }
        else {
            this.betScore = 0;
        }
        this.betScoreDiff = matchDiff;
    }

}