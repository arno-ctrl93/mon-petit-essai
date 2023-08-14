import { Request, Response } from "express";
import matchService from "../services/match.service";
import MatchEntity from "../objects/entities/match.entity";
import FetchPastLiveUpcomingMatchesOutboundDto from "../objects/dtos/outbound/fetch-past-live-upcoming-matches.outbound.dto";



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

async function fetchPastLiveUpcomingMatches(req: Request, res: Response) {
    console.log("MatchController - fetchPastLiveUpcomingMatches");

    const userEmail = req.params.email;

    try {
        const matches: MatchEntity[] = await matchService.fetchMatchesWithBet(userEmail);
        const dto: FetchPastLiveUpcomingMatchesOutboundDto = FetchPastLiveUpcomingMatchesOutboundDto.toDto(matches);
        res.status(200).send(dto);
    } catch (error) {
        console.log(error);
        res.status(400).json(error);
    }
}

export default {
    fetchAndCreateOrUpdateMatches,
    fetchTodayPastAndNotClosedMatches,
    updateEndedMatches,
    fetchPastLiveUpcomingMatches
}