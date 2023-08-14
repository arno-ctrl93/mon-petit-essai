import { Request, Response } from "express";
import rugbyApiService from "../services/rugby-api.service";
import { Match } from "../repositories/rugby-api.repository";
import matchService from "../services/match.service";

async function fetchMatches(req: Request, res: Response) {
    console.log("TestController - fetchMatches");

    try {
        const matches = await rugbyApiService.fetchMatches();
        return res.status(200).json(matches);
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
}

async function createOrUpdateMatches(req: Request, res: Response) {
    console.log("TestController - createOrUpdateMatches");

    const formatrequest: Match[] = req.body.matches;
    console.log(formatrequest);

    try {
        await matchService.createOrUpdateMatches(formatrequest);
        return res.status(200).json('test - matches created or updated');
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
}

export default {
    fetchMatches,
    createOrUpdateMatches
}