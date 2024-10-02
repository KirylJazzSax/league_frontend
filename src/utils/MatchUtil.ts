import {League} from "../types/League";
import {Match} from "../types/Match";
import {Team} from "../types/Team";

export const generateMatchesFromLeague = (league: League): Match[] => {
    const matches = [];
    const teams = Object.values<Team>(league.teams)

    for (let i = 0; i < teams.length; i++) {
        for (let j = i + 1; j < teams.length; j++) {
            matches.push({
                firstTeam: {
                    name: teams[i].name,
                    score: 0,
                },
                secondTeam: {
                    name: teams[j].name,
                    score: 0,
                },
                played: false,
            });
        }
    }

    return matches;
};

export const pickMatchesForWeek = (matches: Match[]): Match[] => {
    let notPlayed = matches.filter((m: Match) => !m.played);

    const idx = Math.floor(Math.random() * notPlayed.length);
    const first = notPlayed[idx];
    notPlayed.splice(idx, 1);
    const second = notPlayed[Math.floor(Math.random() * notPlayed.length)];
    const result = [first, second].filter((m: Match) => typeof m !== 'undefined');

    return result.map((m: Match) => {
        m.firstTeam.score = Math.floor(Math.random() * 10);
        m.secondTeam.score = Math.floor(Math.random() * 10);
        return m;
    });
};
