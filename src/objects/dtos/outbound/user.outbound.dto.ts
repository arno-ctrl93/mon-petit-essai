
export class UserOutboundDto {
    name: string;

    email: string;

    constructor(name: string, email: string) {
        this.name = name;
        this.email = email;
    }
}
