import { Group, PrismaClient } from "@prisma/client";
import { randomUUID } from "crypto";
import GroupEntity from "../objects/entities/group.entity";
import { CreateGroupInboundDto } from "../objects/dtos/inbound/create-group.inbound.dto";
import hashIdMisc from "../helper/hash-id.misc";

const prisma = new PrismaClient();


async function createGroup(dto: CreateGroupInboundDto, userId: string) {
    console.log("GroupRepository - createGroup");

    try {
        const group: Group = await prisma.group.create({
            data: {
                name: dto.groupName,
                unique_public_id: hashIdMisc.generateUniqueGroupId(userId),
                owner_id: userId
            }
        });

        const groupEntity: GroupEntity = GroupEntity.toEntity(group);

        return groupEntity;
    }
    catch (error) {
        console.log(error);
        throw error;
    }

}

export default {
    createGroup
}