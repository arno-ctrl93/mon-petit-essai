import { Request, Response } from "express";
import { UserInboundDto } from "../objects/dtos/inbound/user.inbound.dto";
import { UserOutboundDto } from "../objects/dtos/outbound/user.outbound.dto";
import { ValidationError, validate } from "class-validator";
import UserService from "../services/user.service";
import userService from "../services/user.service";



async function postUser(req: Request, res: Response) {
    console.log("UserController - postUser");

    const userDto: UserInboundDto = new UserInboundDto(req.body.name, req.body.email);

    const errors: ValidationError[] = await validate(userDto);

    if (errors.length > 0) {
        console.log("UserController - postUser - errors");
        console.log(errors);
        res.status(400).json(errors);
        return;
    }

    try {
        await UserService.postUser(userDto);
        res.status(201).send('User created');
    }
    catch (error) {
        console.log(error);
        res.status(401).json(error);
    }
}

async function getUser(req: Request, res: Response) {
    console.log("UserController - getUser");
    console.log(req.params.email);

    const email = req.params.email;
    try {
        const user = await userService.getUser(email);
        console.log(user);
        const userDto = UserOutboundDto.toDto(user);
        res.status(200).send(userDto);
    }

    catch (error) {
        console.log(error);
        res.status(400).json(error);
    }
}

async function deleteUser(req: Request, res: Response) {
    console.log("UserController - deleteUser");
    console.log(req.params.email);

    const email = req.params.email;
    try {
        const user = await userService.deleteUser(email);
        console.log(user);
        res.status(200).send('User deleted');
    }

    catch (error) {
        console.log(error);
        res.status(400).json(error);

    }

}

async function patchUser(req: Request, res: Response) {
    console.log("UserController - patchUser");

    const userDto: UserInboundDto = new UserInboundDto(req.body.name, req.body.email);
    const errors: ValidationError[] = await validate(userDto);

    if (errors.length > 0) {
        console.log("UserController - patchUser - errors");
        console.log(errors);
        res.status(400).json(errors);
        return;
    }

    try {
        await UserService.patchUser(userDto)
        res.status(201).send('User updated');
    }
    catch (error) {
        console.log(error);
        res.status(401).json(error);
    }

}

async function getUserScore(req: Request, res: Response) {
    console.log("UserController - getUserScore");

    const email = req.params.email;
    try {
        const score = await userService.getUserScore(email);
        console.log(score);
        res.status(200).send("User score: " + score + " points");
    }
    catch (error) {
        console.log(error);
        res.status(400).json(error);
    }
}




export default {
    postUser,
    getUser,
    deleteUser,
    patchUser,
    getUserScore
}