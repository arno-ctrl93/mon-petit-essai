import rugbyApiRepository, { Match } from "../repositories/rugby-api.repository";



async function fetchMatches(): Promise<Match[]> {
    console.log("RugbyApiRepository - fetchMatches");

    try {
        const matches: Match[] = await rugbyApiRepository.fetchMatches();
        return matches;
    }
    catch (error) {
        console.log(error);
        throw error;
    }
}

export default {
    fetchMatches
}