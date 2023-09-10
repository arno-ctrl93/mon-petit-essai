import PreviousMatchDto from "../previous-match.dto";
import LiveMatchDto from "../live-match.dto";
import UpcomingMatchDto from "../upcoming-match.dto";
import BetEntity, { BetWithUser, BetWithUserAndMatch } from "../../entities/bet.entity";
import MatchEntity from "../../entities/match.entity";

export default class FetchPastLiveUpcomingMatchesOutboundDto {

    previousMatches: PreviousMatchDto[];

    liveMatches: LiveMatchDto[];

    upcomingMatches: UpcomingMatchDto[];

    public static toDto(matchEntities: MatchEntity[]) {
        const previousMatches: MatchEntity[] = [];
        const liveMatches: MatchEntity[] = [];
        const upcomingMatches: MatchEntity[] = [];
        for (const matchEntity of matchEntities) {
            const startedAt = matchEntity.getStartedAt();
            const closedAt = matchEntity.getClosedAt();
            const now = new Date();
            if (closedAt != null) {
                previousMatches.push(matchEntity);
            } else if (startedAt != null && startedAt < now) {
                liveMatches.push(matchEntity);
            }
            else {
                upcomingMatches.push(matchEntity);
            }
        }
        previousMatches.sort((a: MatchEntity, b: MatchEntity) => a.getStartedAt().getTime() - b.getStartedAt().getTime());
        return new FetchPastLiveUpcomingMatchesOutboundDto(previousMatches, liveMatches, upcomingMatches);
    }

    constructor(previousMatches: MatchEntity[], liveMatches: MatchEntity[], upcomingMatches: MatchEntity[]) {
        this.previousMatches = previousMatches.map((matchEntity) => PreviousMatchDto.toDto(matchEntity));
        this.liveMatches = liveMatches.map((matchEntity) => LiveMatchDto.toDto(matchEntity));
        this.upcomingMatches = upcomingMatches.map((matchEntity) => UpcomingMatchDto.toDto(matchEntity));
    }
}