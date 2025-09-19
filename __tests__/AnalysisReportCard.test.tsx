import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { AnalysisReportCard } from '../components/AnalysisReportCard';
import type { FixSuggestion } from '../types';

vi.mock('../services/geminiService', () => ({
    getFixSuggestion: vi.fn(),
}));

import { getFixSuggestion } from '../services/geminiService';
const mockedGetFixSuggestion = vi.mocked(getFixSuggestion);

const baseMetric = {
    score: 5,
    feedback: 'Low-mids are muddy.',
};

const renderComponent = () =>
    render(
        <AnalysisReportCard
            title="Frequency Balance"
            metric={baseMetric}
            pluginList="- Plugin"
            knowledgeBaseText="Manual"
        />,
    );

describe('AnalysisReportCard', () => {
    beforeEach(() => {
        mockedGetFixSuggestion.mockReset();
    });

    it('requests a plugin recommendation when prompted', async () => {
        const suggestion: FixSuggestion = {
            suggestion: 'Use EQ',
            parameters: [
                { name: 'Gain', value: '-2dB' },
            ],
        };
        mockedGetFixSuggestion.mockResolvedValue(suggestion);

        renderComponent();

        fireEvent.click(screen.getByRole('button', { name: /suggest a fix/i }));

        await waitFor(() => expect(screen.getByText(/Use EQ/)).toBeInTheDocument());
        expect(screen.getByText('-2dB')).toBeInTheDocument();
        expect(mockedGetFixSuggestion).toHaveBeenCalledWith(
            'Frequency Balance',
            baseMetric.score,
            baseMetric.feedback,
            '- Plugin',
            'Manual',
        );
    });

    it('shows an error when the AI service fails', async () => {
        mockedGetFixSuggestion.mockRejectedValue(new Error('Service down'));

        renderComponent();
        fireEvent.click(screen.getByRole('button', { name: /suggest a fix/i }));

        await waitFor(() => expect(screen.getByText(/Service down/)).toBeInTheDocument());
    });
});
