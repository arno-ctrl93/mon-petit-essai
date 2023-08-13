
import { Prisma, User } from "@prisma/client";
import GroupEntity from "./group.entity";

const userWithGroup = Prisma.validator<Prisma.UserArgs>()({
    include: {
        group: true
    }
});

export type UserWithGroup = Prisma.UserGetPayload<typeof userWithGroup>;

export default class UserEntity {

    private readonly id: string;

    private name: string;

    private email: string;

    private group: GroupEntity | null;

    public static toEntity(user: User): UserEntity;
    public static toEntity(user: UserWithGroup): UserEntity {

        const userEntity: UserEntity = new UserEntity(user.id, user.name, user.email);

        if (user.group != null) {
            userEntity.group = GroupEntity.toEntity(user.group);
        }

        return userEntity;
    }

    constructor(id: string, name: string, email: string) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.group = null;
    }

    // getters and setters

    public getId(): string {
        return this.id;
    }

    public getName(): string {
        return this.name;
    }

    public getEmail(): string {
        return this.email;
    }

    public getGroup(): GroupEntity | null {
        return this.group;
    }

}