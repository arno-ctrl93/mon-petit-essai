import axios from 'axios';
import { Request, Response } from 'express';


// Match France Australie match amical -> sr:sport_event:42027171
// Match done Japon Nouvelle-Zélande -> sr:sport_event:41307783

export type MatchEventStat = {
    api_id: string;
    is_ended: boolean;
    home_score: number;
    away_score: number;
};


export type Match = {
    id: string;
    startTime: string;
    stageName: string;
    firstTeam: {
        firstTeamName: string;
        firstTeamId: string;
    };
    secondTeam: {
        secondTeamName: string;
        secondTeamId: string;
    };
    probability: {
        firstTeam: number;
        secondTeam: number;
        draw: number;
    };
};


const API_KEY = 'edvqsz4a6y58vznyjy5qernh';
const API_URL = 'https://api.sportradar.com/rugby-union/trial/v3/en';
const urn_season = 'sr:season:72847';

async function fetchMatches(): Promise<Match[]> {
    const summariesResponse = await axios.get(`${API_URL}/seasons/${urn_season}/summaries.json?api_key=${API_KEY}`).catch((error) => {
        console.log(error);
        throw error;
    });
    const data = summariesResponse.data;
    console.log("Match find length: " + data.summaries.length);
    let matches: Match[] = [];
    for (let i = 0; i < data.summaries.length; i++) {
        const id = data.summaries[i].sport_event.id;
        const startTime = data.summaries[i].sport_event.start_time;
        // console.log(data.summaries[i].sport_event.sport_event_context);
        const stageType = data.summaries[i].sport_event.sport_event_context.stage.type;
        let stageName: string = "";
        if (stageType === "league") {
            stageName = "Group " + data.summaries[i].sport_event.sport_event_context.groups[0].group_name + " - J" + data.summaries[i].sport_event.sport_event_context.round.number;
        } else {
            stageName = data.summaries[i].sport_event.sport_event_context.round.name;
        }
        const firstTeamName = data.summaries[i].sport_event.competitors[0].name;
        const firstTeamId = data.summaries[i].sport_event.competitors[0].id;
        const secondTeamName = data.summaries[i].sport_event.competitors[1].name;
        const secondTeamId = data.summaries[i].sport_event.competitors[1].id;
        matches.push({ id, startTime, stageName, firstTeam: { firstTeamName, firstTeamId }, secondTeam: { secondTeamName, secondTeamId }, probability: { firstTeam: 0, secondTeam: 0, draw: 0 } });
    }

    console.log("====================================");

    //sleep during 1 second
    await new Promise(resolve => setTimeout(resolve, 1000));

    const probabilitiesResponse = await axios.get(`${API_URL}/seasons/${urn_season}/probabilities.json?api_key=${API_KEY}`);
    const data2 = probabilitiesResponse.data;
    console.log("Match find length: " + data2.sport_event_probabilities.length);
    console.log("probabilities: " + data2.sport_event_probabilities[0].markets[0].outcomes);
    for (let i = 0; i < data2.sport_event_probabilities.length; i++) {
        const probabilityFirstTeam = 100 - (data2.sport_event_probabilities[i].markets[0].outcomes[0].probability | 0);
        const probabilitySecondTeam = 100 - (data2.sport_event_probabilities[i].markets[0].outcomes[1].probability | 0);
        const probabilityDraw = 100 - (data2.sport_event_probabilities[i].markets[0].outcomes[2].probability | 0);
        matches[i].probability.firstTeam = probabilityFirstTeam;
        matches[i].probability.secondTeam = probabilitySecondTeam;
        matches[i].probability.draw = probabilityDraw;
    }
    return matches;
}

async function getMatchStatusById(eventApiId: string): Promise<MatchEventStat> {
    console.log("MatchRepository - getMatchById");
    const summariesResponse = await axios.get(`${API_URL}/sport_events/${eventApiId}/summary.json?api_key=${API_KEY}`).catch((error) => {
        console.log(error);
        throw error;
    });
    const data = summariesResponse.data;
    const apiId = data.sport_event.id;
    const isEnded = data.sport_event_status.match_status === "ended";
    if (!isEnded) {
        return {
            api_id: apiId,
            is_ended: false,
            home_score: 0,
            away_score: 0
        }
    }
    const homeScore = data.sport_event_status.home_score;
    const awayScore = data.sport_event_status.away_score;
    return {
        api_id: apiId,
        is_ended: true,
        home_score: homeScore,
        away_score: awayScore
    }
}

export default {
    fetchMatches,
    getMatchStatusById
}