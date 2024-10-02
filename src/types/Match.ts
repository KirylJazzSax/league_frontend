export type Team = {
    name: string;
    score: number;
};

export type Match = {
    firstTeam: Team;
    secondTeam: Team;
    played?: boolean;
};