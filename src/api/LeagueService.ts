import {ErrorResponse, LeagueResponse} from "../types/Response";
import {PlayRequest} from "../types/Request";
const baseUrl = process.env.REACT_APP_API_URL + '/api';
export const create = async (id: string): Promise<LeagueResponse | ErrorResponse> => {
    const response = await fetch(baseUrl + '/league/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({id}),
    });
    if (response.ok) {
        return await response.json();
    }

    return {
        message: 'Failed to create League',
    };
};

export const calculate = async (req: PlayRequest): Promise<LeagueResponse | ErrorResponse> => {
    const response = await fetch(baseUrl + `/league/${req.id}/play`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(req),
    });
    if (response.ok) {
        return await response.json();
    }

    return {
        message: "Could not calculate score",
    };
};