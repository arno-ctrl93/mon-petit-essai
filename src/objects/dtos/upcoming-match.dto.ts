import MatchEntity from "../entities/match.entity";

export default class UpcomingMatchDto {
    apiId: string;
    homeTeam: string;
    awayTeam: string;
    betHome: number;
    betAway: number;
    predictionHome: number;
    predictionAway: number;
    predictionDraw: number;
    startedAt: Date;
    round: string;

    public static toDto(match: MatchEntity): UpcomingMatchDto {
        const apiId = match.getApiId();
        const homeTeam = match.getTeamHome();
        const awayTeam = match.getTeamAway();
        if (homeTeam == null || awayTeam == null) {
            throw new Error("homeTeam or awayTeam is null");
        }
        const homeTeamName = homeTeam.getName();
        const awayTeamName = awayTeam.getName();
        const bet = match.getFirstBet();
        const betHome = bet == null ? 0 : bet.getBetHomeTeam();
        const betAway = bet == null ? 0 : bet.getBetAwayTeam();
        const predictionHome = match.getProbabilityHome();
        const predictionAway = match.getProbabilityAway();
        const predictionDraw = match.getProbabilityDraw();
        const startedAt = match.getStartedAt();
        const round = match.getRound();
        return new UpcomingMatchDto(apiId, homeTeamName, awayTeamName, betHome, betAway, predictionHome, predictionAway, predictionDraw, startedAt, round);

    }

    constructor(apiId: string, homeTeam: string, awayTeam: string, betHome: number, betAway: number, predictionHome: number, predictionAway: number, predictionDraw: number, startedAt: Date, round: string) {
        this.apiId = apiId;
        this.homeTeam = homeTeam;
        this.awayTeam = awayTeam;
        this.betHome = betHome;
        this.betAway = betAway;
        this.predictionHome = predictionHome;
        this.predictionAway = predictionAway;
        this.predictionDraw = predictionDraw;
        this.startedAt = startedAt;
        this.round = round;
    }

}