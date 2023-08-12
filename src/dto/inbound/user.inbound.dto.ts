import { IsEmail, IsString, Max, Min } from 'class-validator';

export class UserInboundDto {
    @IsString()
    name: string;

    @IsEmail()
    email: string;

    constructor(name: string, email: string) {
        this.name = name;
        this.email = email;
    }
}
