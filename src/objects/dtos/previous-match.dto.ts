import BetEntity from "../entities/bet.entity";
import MatchEntity from "../entities/match.entity";

export default class PreviousMatchDto {
    apiId: string;

    homeTeam: string;

    awayTeam: string;

    homeScore: number;

    awayScore: number;

    betHome: number;

    betAway: number;

    points: number;

    betScoreResult: string;

    public static toDto(matchEntity: MatchEntity): PreviousMatchDto {
        const apiId = matchEntity.getApiId();
        const homeTeam = matchEntity.getTeamHome();
        const awayTeam = matchEntity.getTeamAway();
        if (homeTeam == null || awayTeam == null) {
            throw new Error("homeTeam or awayTeam is null");
        }
        const homeTeamName = homeTeam.getName();
        const awayTeamName = awayTeam.getName();
        const homeScore = matchEntity.getScoreHome();
        const awayScore = matchEntity.getScoreAway();
        const bet: BetEntity | null = matchEntity.getFirstBet();
        const betHome = bet == null ? 0 : bet.getBetHomeTeam();
        const betAway = bet == null ? 0 : bet.getBetAwayTeam();
        const betScoreResult: string = bet == null ? "LOSE" : bet.getBetScoreResult();
        const points = bet == null ? 0 : bet.getBetScore();


        return new PreviousMatchDto(apiId, homeTeamName, awayTeamName, homeScore, awayScore, betHome, betAway, points, betScoreResult);
    }

    constructor(apiId: string, homeTeam: string, awayTeam: string, homeScore: number, awayScore: number, betHome: number, betAway: number, points: number, betScoreResult: string) {
        this.apiId = apiId;
        this.homeTeam = homeTeam;
        this.awayTeam = awayTeam;
        this.homeScore = homeScore;
        this.awayScore = awayScore;
        this.betHome = betHome;
        this.betAway = betAway;
        this.points = points;
        this.betScoreResult = betScoreResult;
    }
}