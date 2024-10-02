import {useContext} from "react";
import {LeagueContext} from "../context/LeagueContext";
import {Team} from "../types/Team";

export const Table = () => {
    const {league} = useContext(LeagueContext);

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg w-[50%]">
            <h2 className="text-2xl font-bold mb-4">League Table</h2>
            <div className="grid grid-cols-6 gap-4 font-semibold mb-2">
                <div>Team</div>
                <div>PTS</div>
                <div>P</div>
                <div>W</div>
                <div>D</div>
                <div>GD</div>
            </div>
            {Object.values<Team>(league.teams).map((team: Team) => (
                <div key={team.name} className="grid grid-cols-6 gap-4 py-2 border-t">
                    <div>{team.name}</div>
                    <div>{team.scores.PTS}</div>
                    <div>{team.scores.P}</div>
                    <div>{team.scores.W}</div>
                    <div>{team.scores.D}</div>
                    <div>{team.scores.GS - team.scores.GC}</div>
                </div>
            ))}
        </div>
    );
};