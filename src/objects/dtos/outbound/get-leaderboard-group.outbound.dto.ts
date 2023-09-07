import { UserGroupJson } from "../../../repositories/group.repository";

type UserGroup = {
    userName: string;
    correctBet: number;
    closedBet: number
    perfectBet: number;
    totalScore: number;
}


export class GetLeaderboardGroupOutboundDto {
    UserGroups: UserGroup[];

    public static toDto(datas: UserGroupJson[]): GetLeaderboardGroupOutboundDto {
        const result = new GetLeaderboardGroupOutboundDto();
        for (const data of datas) {
            const userName = data.user_name;
            const correctBet = Number(data.correct_bets);
            const closedBet = Number(data.closed_bets);
            const perfectBet = Number(data.perfect_bets);
            const totalScore = Number(data.total_score);
            result.UserGroups.push({ userName, correctBet, closedBet, perfectBet, totalScore });
        }
        result.UserGroups.sort((a, b) => {
            if (a.totalScore > b.totalScore) {
                return -1;
            }
            if (a.totalScore < b.totalScore) {
                return 1;
            }
            return 0;
        });
        return result;
    }

    constructor() {
        this.UserGroups = [];
    }

}