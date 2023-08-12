import { Request, Response } from "express";


async function createGroup(Req: Request, res: Response) {
    console.log("GroupController - createGroup");
    res.status(200).send('Group created');
}

export default {
    createGroup
}