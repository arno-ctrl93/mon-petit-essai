import { UserGroupJson } from "../../../repositories/user.repository";

type UserGroup = {
    userEmail: string;
    userName: string;
    totalBet: number;
    successfulBet: number;
    perfectBet: number;
    totalScore: number;
}


export class GetLeaderboardGroupOutboundDto {
    UserGroups: UserGroup[];

    public static toDto(datas: UserGroupJson[]): GetLeaderboardGroupOutboundDto {
        const result = new GetLeaderboardGroupOutboundDto();
        for (const data of datas) {
            const userEmail = data.user_email;
            const userName = data.user_name;
            const totalBet = Number(data.total_bets);
            const successfulBet =Number(data.successful_bets);
            const perfectBet = Number(data.perfect_bets);
            const totalScore = Number(data.total_score);
            result.UserGroups.push({ userEmail, userName, totalBet, successfulBet, perfectBet, totalScore });
        }
        return result;
    }
    constructor() {
        this.UserGroups = [];
    }

}