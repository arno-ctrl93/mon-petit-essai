
import { Prisma, User } from "@prisma/client";
import GroupEntity from "./group.entity";
import BetEntity from "./bet.entity";

const userWithGroup = Prisma.validator<Prisma.UserArgs>()({
    include: {
        group: true
    }
});

const userWithBets = Prisma.validator<Prisma.UserArgs>()({
    include: {
        bets: true
    }
});



export type UserWithGroup = Prisma.UserGetPayload<typeof userWithGroup>;

export type UserWithBets = Prisma.UserGetPayload<typeof userWithBets>;

export type UserWithGroupAndBets = Prisma.UserGetPayload<typeof userWithGroup> & Prisma.UserGetPayload<typeof userWithBets>;

export default class UserEntity {

    private readonly id: string;

    private name: string;

    private email: string;

    private group: GroupEntity | null;

    private bets: BetEntity[] | null;

    public static toEntity(user: User): UserEntity;
    public static toEntity(user: UserWithBets): UserEntity;
    public static toEntity(user: UserWithGroupAndBets): UserEntity {

        const userEntity: UserEntity = new UserEntity(user.id, user.name, user.email);

        if (user.group != null) {
            userEntity.group = GroupEntity.toEntity(user.group);
        }

        if (user.bets != null) {
            userEntity.bets = user.bets.map(bet => BetEntity.toEntity(bet));
        }

        return userEntity;
    }

    constructor(id: string, name: string, email: string) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.group = null;
        this.bets = null;
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

    public removeBetNotOver(): void {
        if (this.bets == null)
            return;
        this.bets = this.bets.filter(bet => bet.getMatch()?.getClosedAt() != null);
    }

    public getScoreBet(): number {
        if (this.bets == null)
            return 0;

        const score: number = this.bets.reduce((accumulator, bet) => accumulator + bet.getBetScore(), 0);

        return score;
    }

}