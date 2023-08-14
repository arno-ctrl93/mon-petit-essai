import { Request, Response } from "express";
import matchService from "../services/match.service";



async function fetchAndCreateOrUpdateMatches(req: Request, res: Response) {
    console.log("MatchController - fetchAndCreateOrUpdateMatches");

    try {
        await matchService.fetchAndCreateOrUpdateMatches();
        res.status(200).send('matches created or updated');
    } catch (error) {
        console.log(error);
        res.status(400).json(error);
    }
}

export default {
    fetchAndCreateOrUpdateMatches
}