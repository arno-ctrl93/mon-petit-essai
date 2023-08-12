import { Request, Response } from "express";
import { UserInboundDto } from "../dto/inbound/user.inbound.dto";
import { ValidationError, validate } from "class-validator";


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

    res.send("UserController - postUser");
}


export default {
    postUser
}