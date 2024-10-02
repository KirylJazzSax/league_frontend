import {League} from "./League";

export type ErrorResponse = {
    message: string;
    league?: League;
};

export type LeagueResponse = {
    league: League;
    message?: string;
};