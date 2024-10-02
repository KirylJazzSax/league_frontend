import React, {act} from 'react';
import { waitFor } from '@testing-library/react';
import { Actions } from './Actions';
import { LeagueContext } from '../context/LeagueContext';
import { calculate } from '../api/LeagueService';
import {createRoot} from "react-dom/client";

jest.mock('../api/LeagueService', () => ({
    calculate: jest.fn(),
}));

const mockCalculate = calculate as jest.MockedFunction<typeof calculate>;

const mockContext = {
    league: { id: 1 },
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


describe('Actions component', () => {
    let container: HTMLDivElement;
    beforeEach(async () => {
        mockCalculate.mockResolvedValue({league: {id: 'uuid', teams: []}});
        container = document.createElement('div');
        document.body.appendChild(container);

        await act(() => {
            createRoot(container).render(
                <LeagueContext.Provider value={mockContext}>
                    <Actions />
                </LeagueContext.Provider>
            );

        });
    });

    it('renders the Play All and Next Week buttons', async () => {
        const buttons = container.querySelectorAll('button');
        expect(buttons.length).toBe(2);
    });


    it('handles the "Next Week" button click', async () => {
        const nextWeekButton = container.querySelector<HTMLButtonElement>('button:nth-child(2)');
        await act(() => {
            nextWeekButton?.click();
        });

        expect(nextWeekButton?.textContent).toBe('Next Week')
        await waitFor(() => expect(mockContext.setLeague).toHaveBeenCalled());
    });

    it('handles the "Play All" button click and auto-play', async () => {
        const playAllButton = container.querySelector<HTMLButtonElement>('button:first-child');
        await act(() => {
            playAllButton?.click()
        });

        expect(playAllButton).toBeDisabled();
        await waitFor(() => expect(calculate).toHaveBeenCalled(), {timeout: 1000});
    });
});
