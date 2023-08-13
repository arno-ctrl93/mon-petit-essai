import { IsEmail, IsString, validate } from "class-validator";

export class CreateGroupInboundDto {

    @IsEmail()
    userEmail: string;

    @IsString()
    groupName: string;

    constructor(userEmail: string, groupName: string) {
        this.userEmail = userEmail;
        this.groupName = groupName;
    }
}