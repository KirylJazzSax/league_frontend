import React, {act} from 'react';
import App from './App';
import {LeagueContext} from "./context/LeagueContext";
import {create} from "./api/LeagueService";
import {createRoot} from "react-dom/client";

jest.mock('./api/LeagueService', () => ({
    create: jest.fn(),
}));

const mockCreate = create as jest.MockedFunction<typeof create>;

const mockContext = {
    league: null,
    setLeague: jest.fn(),
    matches: [
        { firstTeam: { name: 'Team A' }, secondTeam: { name: 'Team B' }, played: false },
        { firstTeam: { name: 'Team C' }, secondTeam: { name: 'Team D' }, played: false },
    ],
    weekMatches: [],
    setWeekMatches: jest.fn(),
    week: 1,
    setWeek: jest.fn(),
    setMatches: jest.fn(),
};

describe('Test app component', () => {
    it('should show error message', async () => {
        mockCreate.mockResolvedValue({message: 'Error occurred'});

        const container = document.createElement('div');
        document.body.appendChild(container);

        await act(() => {
            createRoot(container).render(
                <LeagueContext.Provider value={mockContext}>
                    <App />
                </LeagueContext.Provider>
            );

        });
        expect(container.textContent).toBe('Error occurred');
    });

    it('should show error message', async () => {
        mockCreate.mockResolvedValue({league: {id: 'asd', teams: []}});

        const container = document.createElement('div');
        document.body.appendChild(container);

        await act(() => {
            createRoot(container).render(
                <LeagueContext.Provider value={mockContext}>
                    <App />
                </LeagueContext.Provider>
            );
        });

        const elem = document.querySelector('h2');
        expect(elem?.textContent).toBe('League Table');
    });
});
