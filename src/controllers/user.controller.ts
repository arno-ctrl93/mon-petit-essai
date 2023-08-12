import { Request, Response } from "express";
import { UserInboundDto } from "../objects/dtos/inbound/user.inbound.dto";
import { ValidationError, validate } from "class-validator";
import UserEntity from "../objects/entities/user.entity";
import UserService from "../services/user.service";


async function postUser(req: Request, res: Response) {
    console.log("UserController - postUser");

    const userDto: UserInboundDto = new UserInboundDto(req.body.name, req.body.email);

    const errors: ValidationError[] = await validate(userDto);

    if (errors.length > 0) {
        console.log("UserController - postUser - errors");
        console.log(errors);
        res.status(400).send(errors);
        return;
    }

    try {
        await UserService.postUser(userDto);
        res.status(201).send('User created');
    }
    catch (error) {
        console.log(error);
        res.status(401).send(error);
    }
}


export default {
    postUser
}