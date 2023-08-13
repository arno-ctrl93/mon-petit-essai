import { CreateGroupInboundDto } from "../objects/dtos/inbound/create-group.inbound.dto";
import UserEntity from "../objects/entities/user.entity";
import groupRepository from "../repositories/group.repository";
import userService from "./user.service";



async function createGroup(dto: CreateGroupInboundDto) {
    console.log("GroupController - createGroup");

    const userEntity: UserEntity = await userService.getUser(dto.userEmail);
    console.log(userEntity);

    if (userEntity.getGroup() != null) {
        throw new Error("GroupController - createGroup - user already has a group");
    }

    try {
        const group = await groupRepository.createGroup(dto, userEntity.getId());
        console.log(group);
        return group;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export default {
    createGroup
}
