import { Request, Response } from "express";
import { UserInboundDto } from "../objects/dtos/inbound/user.inbound.dto";
import { UserOutboundDto } from "../objects/dtos/outbound/user.outbound.dto";
import { ValidationError, validate } from "class-validator";
import UserEntity from "../objects/entities/user.entity";
import UserService from "../services/user.service";
import url from 'url';
import querystring from 'querystring';
import userService from "../services/user.service";


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

async function getUser(req: Request, res: Response) {
    console.log("UserController - getUser");
    console.log(req.params.email);
    
    const email = req.params.email;
    try {
        const user = await userService.getUser(email);
        console.log(user);
        const userDto = new UserOutboundDto(user.name, user.email);
      res.status(200).send(userDto);
    }

    catch (error) {
        console.log(error);
        res.status(400).send(error);  
    }
}





export default {
    postUser,
    getUser
}