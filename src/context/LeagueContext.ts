import {createContext} from "react";

type LeadContextType = {
    league?: any,
    setLeague?: any,
    matches?: any,
    setMatches?: any,
    week?: any,
    setWeek?: any,
    weekMatches?: any,
    setWeekMatches?: any,
};

export const LeagueContext = createContext<LeadContextType>({});
