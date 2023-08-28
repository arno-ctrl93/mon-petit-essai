export function calculateDifferenceBetweenScoreAndBet(homeScore: number, awayScore: number, betHomeScore: number, betAwayScore: number) {
    console.log("MatchService - calculateDifferenceBetweenScoresAndBet");

    const differenceHomeScore = Math.abs(homeScore - betHomeScore);
    const differenceAwayScore = Math.abs(awayScore - betAwayScore);

    return differenceHomeScore + differenceAwayScore;
}
