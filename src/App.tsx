import React, {useEffect, useState} from 'react';
import './App.css';
import {LeagueContext} from "./context/LeagueContext";
import {create} from "./api/LeagueService";
import {v4 as uuidv4} from 'uuid';
import {League} from "./types/League";
import {Match as MatchType} from "./types/Match";
import {Table} from "./components/Table";
import {Match} from "./components/Match";
import {Prediction} from "./components/Prediction";
import {generateMatchesFromLeague} from "./utils/MatchUtil";
import {Actions} from "./components/Actions";

function App() {
    const [league, setLeague] = useState<League | null>(null);
    // Total matches
    const [matches, setMatches] = useState<MatchType[]>([]);
    const [weekMatches, setWeekMatches] = useState<MatchType[]>([]);
    const [week, setWeek] = useState<number>(0);

    const [loading, setLoading] = useState<boolean>(true);
    const [err, setErr] = useState<string | null>(null);

    const createLeague = async () => {
        setLoading(true);
        const l = await create(uuidv4());
        if (l.league) {
            setLeague(l.league);
            setMatches(generateMatchesFromLeague(l.league));
            setLoading(false);
            return;
        }

        setErr(l.message || '');

        setLoading(false);
    };

    useEffect(() => {
        createLeague();
    }, []);

    return (
        <LeagueContext.Provider value={{
            league,
            setLeague,
            matches,
            setMatches,
            week,
            setWeek,
            weekMatches,
            setWeekMatches,
        }}>
            {loading && 'Loading...'}
            {err && err}
            {!loading && !err &&
                <div className={'flex'}>
                    <div className={'flex flex-wrap'}>
                        <Table/>
                        <Match/>
                        <Actions />
                    </div>
                    <Prediction/>
                </div>
            }
        </LeagueContext.Provider>
    );
}

export default App;
