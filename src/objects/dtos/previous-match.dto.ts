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
        let points = 0;
        console.log("betEntity : " + bet);
        if (bet == null) {
            points = 0;
        } else {
            if (homeScore > awayScore && bet.getBetHomeTeam() > bet.getBetAwayTeam()) {
                if (homeScore == bet.getBetHomeTeam() && awayScore == bet.getBetAwayTeam()) {
                    console.log("perfect prediction : team home win");
                    points = matchEntity.getProbabilityHome() * 2;
                } else {
                    console.log("good prediction : team home win");
                    points = matchEntity.getProbabilityHome();
                }
            } else if (homeScore < awayScore && bet.getBetHomeTeam() < bet.getBetAwayTeam()) {
                if (homeScore == bet.getBetHomeTeam() && awayScore == bet.getBetAwayTeam()) {
                    console.log("perfect prediction : team away win");
                    points = matchEntity.getProbabilityAway() * 2;
                } else {
                    console.log("good prediction : team away win");
                    points = matchEntity.getProbabilityAway();
                }
            } else if (homeScore == awayScore && bet.getBetHomeTeam() == bet.getBetAwayTeam()) {
                if (homeScore == bet.getBetHomeTeam() && awayScore == bet.getBetAwayTeam()) {
                    console.log("perfect prediction : draw");
                    points = matchEntity.getProbabilityDraw() * 2;
                } else {
                    console.log("good prediction : draw");
                    points = matchEntity.getProbabilityDraw();
                }
            } else {
                console.log("bad prediction");
                points = 0;
            }
        }
        return new PreviousMatchDto(apiId, homeTeamName, awayTeamName, homeScore, awayScore, betHome, betAway, points);
    }

    constructor(apiId: string, homeTeam: string, awayTeam: string, homeScore: number, awayScore: number, betHome: number, betAway: number, points: number) {
        this.apiId = apiId;
        this.homeTeam = homeTeam;
        this.awayTeam = awayTeam;
        this.homeScore = homeScore;
        this.awayScore = awayScore;
        this.betHome = betHome;
        this.betAway = betAway;
        this.points = points;
    }
}