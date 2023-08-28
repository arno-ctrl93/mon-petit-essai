import { Group } from "@prisma/client";

export default class GroupEntity {

    private readonly id: string;
    
    private name: string;
    
    private uniquePublicId: string;
    
    private ownerId: string;

    public static toEntity(group: Group): GroupEntity {
        const groupEntity = new GroupEntity(group.id, group.name, group.unique_public_id, group.owner_id);
        return groupEntity;
    }

    constructor(id: string, name: string, uniquePublicId: string, ownerId: string) {
        this.id = id;
        this.name = name;
        this.uniquePublicId = uniquePublicId;
        this.ownerId = ownerId;
    }

    public getId(): string {
        return this.id;
    }

    public getName(): string {
        return this.name;
    }

    public getUniquePublicId(): string {
        return this.uniquePublicId;
    }

    public getOwnerId(): string {
        return this.ownerId;
    }

}