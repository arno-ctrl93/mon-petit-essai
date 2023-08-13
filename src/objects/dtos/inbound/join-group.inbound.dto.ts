import { IsBase64, IsByteLength, IsEmail, IsHexadecimal, IsString, validate } from "class-validator";

export class JoinGroupInboundDto {

    @IsString()
    @IsByteLength(8, 8)
    codeGroup: string;

    @IsEmail()
    userEmail: string;

    constructor(userEmail: string, codeGroup: string) {
        this.userEmail = userEmail;
        this.codeGroup = codeGroup;
    }
}