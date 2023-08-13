import axios from 'axios';
import { Request, Response } from 'express';


const API_KEY = 'edvqsz4a6y58vznyjy5qernh';
const API_URL = 'https://api.sportradar.com/rugby-union/trial/v3/en';
const urn_season = 'sr:season:72847';

async function fetchMatches(request: Request, res: Response) {
    const summariesResponse = await axios.get(`${API_URL}/seasons/${urn_season}/summaries.json?api_key=${API_KEY}`);
    const data = summariesResponse.data;
    console.log("Match find length: " + data.summaries.length);
    let matches = [];
    for (let i = 0; i < data.summaries.length; i++) {
        const id = data.summaries[i].sport_event.id;
        const startTime = data.summaries[i].sport_event.start_time;
        console.log(data.summaries[i].sport_event.sport_event_context);
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
    res.status(200).send(matches);
}

export default {
    fetchMatches
}