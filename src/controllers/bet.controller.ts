import { Request, Response } from "express";
import CreateOrUpdateBetInboundDto from "../objects/dtos/inbound/create-or-update-bet.inbound.dto";
import { validate } from "class-validator";
import betService from "../services/bet.service";


async function createOrUpdateBet(req: Request, res: Response) {
    console.log("BetController - createOrUpdateBet");

    const dto = new CreateOrUpdateBetInboundDto(req.params.email, req.body.betHomeTeam, req.body.betAwayTeam, req.body.matchId);

    const errors = await validate(dto);

    if (errors.length > 0) {
        console.log("BetController - createOrUpdateBet - errors");
        console.log(errors);
        res.status(400).json(errors);
        return;
    }

    try {
        await betService.createOrUpdateBet(dto);
        res.status(200).send('bet created or updated');
    } catch (error) {
        console.log(error);
        res.status(400).json(error);
    }
}

export default {
    createOrUpdateBet
}