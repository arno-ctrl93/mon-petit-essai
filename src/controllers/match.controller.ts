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

async function fetchTodayPastAndNotClosedMatches(req: Request, res: Response) {
    console.log("MatchController - fetchTodayPastAndNotClosedMatches");

    try {
        const matches = await matchService.fetchTodayPastAndNotClosedMatches();
        res.status(200).json(matches);
    } catch (error) {
        console.log(error);
        res.status(400).json(error);
    }
}

async function updateEndedMatches(req: Request, res: Response) {
    console.log("MatchController - updateEndedMatches");

    try {
        await matchService.updateEndedMatches();
        res.status(200).send('matches updated');
    } catch (error) {
        console.log(error);
        res.status(400).json(error);
    }
}

export default {
    fetchAndCreateOrUpdateMatches,
    fetchTodayPastAndNotClosedMatches,
    updateEndedMatches,
}