import {useCallback, useContext, useEffect, useState} from "react";
import {LeagueContext} from "../context/LeagueContext";
import {Prediction as PredictionType} from "../types/Prediction";

const weights = {
    PTS: 0.5,
    GD: 0.3,
    W: 0.2,
};

type Score = {[key: string]: number};

export const Prediction = () => {
    const [predictions, setPredictions] = useState<PredictionType[]>([]);
    const {league, week} = useContext(LeagueContext);

    const predict = useCallback(() => {
        const teams = league.teams;
        let totalScore = 0;
        const scores: Score = {};

        for (const team in teams) {
            const data = teams[team].scores;
            const GD = data.GS - data.GC;
            const score = (weights.PTS * data.PTS) + (weights.GD * GD) + (weights.W * data.W);
            scores[team] = score;
            totalScore += score;
        }

        const predictions: PredictionType[] = [];
        for (const team in scores) {
            const chance: number = Math.floor((scores[team] / totalScore) * 100);
            predictions.push(
                {name: team, chance}
            );
        }

        setPredictions(predictions);
    }, [league]);

    useEffect(() => {
        predict();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [league]);
    
    return (
        <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">{week} Week Predictions of Championship</h2>
            {predictions.map((prediction: PredictionType, index) => (
                <div key={index} className="flex justify-between py-2 border-t">
                    <span>{prediction.name}</span>
                    <span>{isNaN(prediction.chance) ? 0 : prediction.chance}%</span>
                </div>
            ))}
        </div>
    );
};