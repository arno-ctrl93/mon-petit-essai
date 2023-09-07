import UserEntity from "../../entities/user.entity";
import { GroupOutboundDto } from "./group.outbound.dto";

type BetResult = {
    loser: number;
    correct: number;
    closed: number;
    perfect: number;
}

export class UserOutboundDto {
    name: string;

    email: string;

    score: number;

    group: GroupOutboundDto | null;

    betResult: BetResult | null;

    static toDto(user: UserEntity): UserOutboundDto {
        const userDto: UserOutboundDto = new UserOutboundDto(user.getName(), user.getEmail(), user.getScoreBet());
        const group = user.getGroup();
        if (group !== null) {
            userDto.group = GroupOutboundDto.toDto(group);
        }
        const bets = user.fetchBet()
        if (bets !== null) {
            userDto.betResult = {
                loser: bets.filter(bet => bet.getBetScoreResult() == "LOSE").length,
                correct: bets.filter(bet => bet.getBetScoreResult() == "WIN").length,
                closed: bets.filter(bet => bet.getBetScoreResult() == "CLOSED").length,
                perfect: bets.filter(bet => bet.getBetScoreResult() == "PERFECT").length,
            }
        }
        return userDto;
    }

    constructor(name: string, email: string, score: number) {
        this.name = name;
        this.email = email;
        this.group = null;
        this.betResult = null;
        this.score = score;
    }
}