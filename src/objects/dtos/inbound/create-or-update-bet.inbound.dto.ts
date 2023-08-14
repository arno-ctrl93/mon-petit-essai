import { IsEmail, IsInt, IsPositive, IsString, isString } from "class-validator";


export default class createOrUpdateBetInboundDto {

    @IsEmail()
    userEmail: string;

    @IsInt()
    @IsPositive()
    betHomeTeam: number;

    @IsInt()
    @IsPositive()
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