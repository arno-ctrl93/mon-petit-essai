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
        const previousMatches: PreviousMatchDto[] = [];
        const liveMatches: LiveMatchDto[] = [];
        const upcomingMatches: UpcomingMatchDto[] = [];
        for (const matchEntity of matchEntities) {
            const startedAt = matchEntity.getStartedAt();
            const closedAt = matchEntity.getClosedAt();
            const now = new Date();
            if (closedAt != null) {
                previousMatches.push(PreviousMatchDto.toDto(matchEntity));
            } else if (startedAt != null && startedAt < now) {
                liveMatches.push(LiveMatchDto.toDto(matchEntity));
            }
            else {
                upcomingMatches.push(UpcomingMatchDto.toDto(matchEntity));
            }
        }
        return new FetchPastLiveUpcomingMatchesOutboundDto(previousMatches, liveMatches, upcomingMatches);
    }

    constructor(previousMatches: PreviousMatchDto[], liveMatches: LiveMatchDto[], upcomingMatches: UpcomingMatchDto[]) {
        this.previousMatches = previousMatches;
        this.liveMatches = liveMatches;
        this.upcomingMatches = upcomingMatches;
    }
}