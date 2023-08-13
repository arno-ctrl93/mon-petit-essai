import { Group } from "@prisma/client";

export default class GroupEntity {

    name: string;
    uniquePublicId: string;
    ownerId: string;

    public static toEntity(group: Group): GroupEntity {
        return {
            name: group.name,
            uniquePublicId: group.unique_public_id,
            ownerId: group.owner_id
        };
    }

    constructor(name: string, uniquePublicId: string, ownerId: string) {
        this.name = name;
        this.uniquePublicId = uniquePublicId;
        this.ownerId = ownerId;
    }
}