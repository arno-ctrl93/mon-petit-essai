import MatchEntity from "../entities/match.entity";

export default class LiveMatchDto {
    apiId: string;
    homeTeam: string;
    awayTeam: string;
    predictionHome: number;
    predictionAway: number;
    predictionDraw: number;
    betHome: number;
    betAway: number;

    public static toDto(matchEntity: MatchEntity): LiveMatchDto {
        const apiId = matchEntity.getApiId();
        const homeTeam = matchEntity.getTeamHome();
        const awayTeam = matchEntity.getTeamAway();
        if (homeTeam == null || awayTeam == null) {
            throw new Error("homeTeam or awayTeam is null");
        }
        const homeTeamName = homeTeam.getName();
        const awayTeamName = awayTeam.getName();
        const predictionHome = matchEntity.getProbabilityHome();
        const predictionAway = matchEntity.getProbabilityAway();
        const predictionDraw = matchEntity.getProbabilityDraw();
        const bet = matchEntity.getFirstBet();
        const betHome = bet == null ? 0 : bet.getBetHomeTeam();
        const betAway = bet == null ? 0 : bet.getBetAwayTeam();
        return new LiveMatchDto(apiId, homeTeamName, awayTeamName, predictionHome, predictionAway, predictionDraw, betHome, betAway);
    }

    constructor(apiId: string, homeTeam: string, awayTeam: string, predictionHome: number, predictionAway: number, predictionDraw: number, betHome: number, betAway: number) {
        this.apiId = apiId;
        this.homeTeam = homeTeam;
        this.awayTeam = awayTeam;
        this.predictionHome = predictionHome;
        this.predictionAway = predictionAway;
        this.predictionDraw = predictionDraw;
        this.betHome = betHome;
        this.betAway = betAway;
    }


}