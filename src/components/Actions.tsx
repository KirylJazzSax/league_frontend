import {useCallback, useContext, useEffect, useMemo, useRef, useState} from "react";
import {LeagueContext} from "../context/LeagueContext";
import {pickMatchesForWeek} from "../utils/MatchUtil";
import {Match} from "../types/Match";
import {Button} from "./Button";
import {calculate} from "../api/LeagueService";
import {debounce} from 'lodash';

export const Actions = () => {
    const {
        league,
        setLeague,
        matches,
        weekMatches,
        setWeekMatches,
        week,
        setWeek,
        setMatches
    } = useContext(LeagueContext);
    const [err, setErr] = useState<string | null>(null);
    const [playAllDisabled, setPlayAllDisabled] = useState<boolean>(false);
    const intervalRef = useRef<number | NodeJS.Timer | null>(null);
    const buttonRef = useRef<HTMLButtonElement | null>(null);

    const allPlayed = useMemo(() => {
        return matches.filter((m: Match) => !m.played).length === 0;
    }, [matches]);

    useEffect(() => {
        // pick teams for match when week changed
        if (week > 0) {
            setWeekMatches(pickMatchesForWeek(matches));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [week]);

    const handleNextWeekClick = useCallback(async () => {
        setErr(null);
        if (!allPlayed) {
            setWeek((prev: number) => prev + 1);
        }
        if (week > 0) {
            // persisting data
            calculateMatches(false, weekMatches);
        }

        // mark matches as played
        setMatches((prev: Match[]) => {
            return prev.map((match: Match) => {
                if (weekMatches.find((weekMatch: Match) => {
                    return weekMatch.firstTeam.name === match.firstTeam.name
                        && weekMatch.secondTeam.name === match.secondTeam.name;
                })) {
                    return {...match, played: true};
                }
                return match;
            });
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [matches, weekMatches]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const calculateMatchesDelayed = useCallback(
        debounce(async (dryRun: boolean, weekMatches: Match[]) => {
            calculateMatches(dryRun, weekMatches);
        }, 100) as (dryRun: boolean, weekMatches: Match[]) => void,
        []
    );

    const calculateMatches = useCallback(
        async (dryRun: boolean, weekMatches: Match[]) => {
            const calculateResponse = await calculate({
                id: league.id,
                dryRun,
                matches: weekMatches.map(({firstTeam, secondTeam}: Match) => ({firstTeam, secondTeam})),
            });

            if (calculateResponse.league) {
                setLeague(calculateResponse.league);
                return;
            }

            setErr(calculateResponse?.message || null);
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    useEffect(() => {
        if (!playAllDisabled) {
            return;
        }

        const notPlayed = matches.filter((m: Match) => !m.played).length
        if (!intervalRef.current && notPlayed > 0) {
            intervalRef.current = setInterval(() => {
                if (buttonRef.current) {
                    buttonRef.current.click();
                }
            }, 1000);
        }

        if (intervalRef.current && notPlayed === 0) {
            clearInterval(intervalRef.current);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [playAllDisabled, weekMatches]);

    const handlePlayAllClick = () => {
        setPlayAllDisabled(true);
    };

    useEffect(() => {
        if (week > 0) {
            // dry run delayed because it tries fetch before data actually saved.
            calculateMatchesDelayed(true, weekMatches);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [weekMatches]);

    useEffect(() => {
        if (allPlayed) {
            setPlayAllDisabled(true);
        }
    }, [allPlayed]);

    return (
        <div className={'flex justify-between w-full'}>
            <Button ref={buttonRef} handleClick={handlePlayAllClick} text={'Play All'} disabled={playAllDisabled} />
            {err && err}
            <Button ref={buttonRef} handleClick={handleNextWeekClick} disabled={allPlayed} text={'Next Week'}/>
        </div>
    );
};