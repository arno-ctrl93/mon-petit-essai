import { Request, Response } from "express";
import groupService from "../services/group.service";
import { CreateGroupInboundDto } from "../objects/dtos/inbound/create-group.inbound.dto";
import { validate } from "class-validator";
import { GroupOutboundDto } from "../objects/dtos/outbound/group.outbound.dto";
import { JoinGroupInboundDto } from "../objects/dtos/inbound/join-group.inbound.dto";


async function createGroup(req: Request, res: Response) {
    console.log("GroupController - createGroup");
    console.log(req.params.email);

    const dto = new CreateGroupInboundDto(req.params.email, req.body.name);

    const errors = await validate(dto);

    console.log(errors);

    if (errors.length > 0) {
        console.log("GroupController - createGroup - errors");
        console.log(errors);
        res.status(400).send(errors);
        return;
    }

    try {
        const group = await groupService.createGroup(dto);
        console.log(group);
        const groupDto = GroupOutboundDto.toDto(group);
        res.status(200).send(groupDto);
    }

    catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
}

async function joinGroup(req: Request, res: Response) {
    console.log("GroupController - createGroup");
    console.log(req.params.email);

    const dto = new JoinGroupInboundDto(req.params.email, req.body.codeGroup);

    const errors = await validate(dto);

    console.log(errors);

    if (errors.length > 0) {
        console.log("GroupController - createGroup - errors");
        console.log(errors);
        res.status(400).send(errors);
        return;
    }

    try {
        await groupService.joinGroupByUniqueId(dto);
        res.status(200).send('group joined');
    }

    catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
}

export default {
    createGroup,
    joinGroup
}