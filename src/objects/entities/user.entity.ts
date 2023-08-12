
import { User } from "@prisma/client";

export default class UserEntity {

    name: string;

    email: string;

    public static toEntity(user: User): UserEntity {
        return {
            name: user.name,
            email: user.email
        };
    }

    constructor(name: string, email: string) {
        this.name = name;
        this.email = email;
    }
}