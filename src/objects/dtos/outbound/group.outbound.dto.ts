import GroupEntity from "../../entities/group.entity";

export class GroupOutboundDto {
    name: string;
    uniquePublicId: string;

    static toDto(group: GroupEntity): GroupOutboundDto {
        const groupDto: GroupOutboundDto = new GroupOutboundDto(group.name, group.uniquePublicId);
        return groupDto;
    }

    constructor(name: string, uniquePublicId: string) {
        this.name = name;
        this.uniquePublicId = uniquePublicId;
    }
}
