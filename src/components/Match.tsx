import {ChangeEvent, useContext, useState} from "react";
import {LeagueContext} from "../context/LeagueContext";
import {Match as MatchType} from "../types/Match";
import {Button} from "./Button";

export const Match = () => {
    const {weekMatches, week, setWeekMatches} = useContext(LeagueContext);
    const [editMode, setEditMode] = useState<boolean>(false);

    const handleFirstTeamChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.value) {
            return;
        }
        if (+e.target.value < 0) {
            return;
        }
        const teamName = e.target.dataset.team;
        const idxTarget = e.target.dataset.idx ? +e.target.dataset.idx : null;

        setWeekMatches((prev: MatchType[]) => {
            return prev.map((match: MatchType, mIdx: number) => {
                if (match.firstTeam.name === teamName && mIdx === idxTarget) {
                    return {...match, firstTeam: {...match.firstTeam, score: e.target.value}}
                }

                return match;
            });
        });
    };

    const handleSecondTeamChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.value) {
            return;
        }
        if (+e.target.value < 0) {
            return;
        }
        const teamName = e.target.dataset.team;
        const idxTarget = e.target.dataset.idx ? +e.target.dataset.idx : null;

        setWeekMatches((prev: MatchType[]) => {
            return prev.map((match: MatchType, mIdx: number) => {
                if (match.secondTeam.name === teamName && mIdx === idxTarget) {
                    return {...match, secondTeam: {...match.secondTeam, score: e.target.value}}
                }

                return match;
            });
        });
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg w-[50%]">
            <h2 className="text-2xl font-bold mb-4">{week} Week Match Results</h2>
            {weekMatches.length > 0 && weekMatches.map((match: MatchType, index: number) => (
                <div key={index} className="grid grid-cols-3 gap-4 py-2 border-t">
                    <div>{match.firstTeam.name}</div>
                    {!editMode && <div className="text-center">{match.firstTeam.score} - {match.secondTeam.score}</div>}
                    {editMode && <div className="text-center">
                        <input className={'max-w-12'} type="number" onChange={handleFirstTeamChange} data-idx={index}
                               data-team={match.firstTeam.name} value={match.firstTeam.score}/>
                        -
                        <input className={'max-w-12'} type="number" onChange={handleSecondTeamChange} data-idx={index}
                               data-team={match.secondTeam.name} value={match.secondTeam.score}/>
                    </div>}
                    <div className="text-right">{match.secondTeam.name}</div>
                </div>
            ))}
            {weekMatches.length > 0 && !editMode && <Button handleClick={() => {setEditMode(true)}} text={'Edit'} />}
            {editMode && <Button handleClick={() => {setEditMode(false)}} text={'Ok'} />}
            {week > 0 && weekMatches.length === 0 && 'Game Over'}
            {week === 0 && 'Click Next Week or Play All please.'}
        </div>
    );
};