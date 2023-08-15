import UserEntity from "../../entities/user.entity";
import { GroupOutboundDto } from "./group.outbound.dto";

export class UserOutboundDto {
    name: string;

    email: string;
    group: GroupOutboundDto | null;

    static toDto(user: UserEntity): UserOutboundDto {
        const userDto: UserOutboundDto = new UserOutboundDto(user.getName(), user.getEmail());
        const group = user.getGroup();
        if (group != null) {
            userDto.group = GroupOutboundDto.toDto(group);
        }
        return userDto;
    }

    constructor(name: string, email: string) {
        this.name = name;
        this.email = email;
        this.group = null;
    }
}