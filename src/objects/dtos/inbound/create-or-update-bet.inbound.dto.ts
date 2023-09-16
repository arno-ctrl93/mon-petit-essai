import { IsEmail, IsInt, IsPositive, IsString, Min } from "class-validator";


export default class CreateOrUpdateBetInboundDto {

    @IsEmail()
    userEmail: string;

    @IsInt()
    @Min(0)
    betHomeTeam: number;

    @IsInt()
    @Min(0)
    betAwayTeam: number;

    @IsString()
    matchApiId: string;

    constructor(userEmail: string, betHomeTeam: number, betAwayTeam: number, matchApiId: string) {
        this.userEmail = userEmail;
        this.betHomeTeam = betHomeTeam;
        this.betAwayTeam = betAwayTeam;
        this.matchApiId = matchApiId;
    }

}