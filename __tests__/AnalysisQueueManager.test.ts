import { describe, expect, it, vi } from 'vitest';
import { AnalysisQueueManager } from '../managers/AnalysisQueueManager';
import type { AnalysisItem, AnalysisReport } from '../types';

const createMockAnalysis = (): AnalysisItem => ({
    id: 'analysis-1',
    fileName: 'track.wav',
    status: 'pending',
    report: null,
    error: null,
    chatSuggestions: [],
    albumArt: null,
    masteringChain: null,
    chainError: null,
    messages: [],
    audioData: {
        buffer: new Uint8Array([1, 2, 3]).buffer,
        name: 'track.wav',
        type: 'audio/wav',
    },
    masteringStyle: 'Transparent',
    chainComplexity: 'Standard',
    creativeDirection: '',
});

const reportFixture: AnalysisReport = {
    overallScore: 8,
    overallFeedback: 'Strong mix with room for polish.',
    determinedGenre: 'Pop',
    determinedMood: 'Energetic',
    dynamicRange: { score: 7, feedback: 'Balanced dynamics.' },
    frequencyBalance: { score: 8, feedback: 'Tight low-end.' },
    stereoImage: { score: 8, feedback: 'Wide and consistent.' },
    clarityAndDefinition: { score: 7, feedback: 'Vocals slightly masked.' },
    genreFitness: { score: 8, feedback: 'Matches pop standards.' },
    moodCongruence: { score: 9, feedback: 'Energy translates well.' },
};

describe('AnalysisQueueManager', () => {
    it('processes the next pending analysis and stores AI results', async () => {
        let isProcessing = false;
        let analyses = [createMockAnalysis()];

        const manager = new AnalysisQueueManager({
            getAnalyses: () => analyses,
            isProcessing: () => isProcessing,
            setProcessing: (value) => {
                isProcessing = value;
            },
            updateAnalysis: (id, updates) => {
                analyses = analyses.map((analysis) =>
                    analysis.id === id ? { ...analysis, ...updates } : analysis,
                );
            },
            getAnalysisReport: vi.fn(async () => reportFixture),
            getChatSuggestions: vi.fn(async () => ['q1', 'q2', 'q3']),
        });

        await manager.processNext();

        expect(analyses[0].status).toBe('success');
        expect(analyses[0].report).toEqual(reportFixture);
        expect(analyses[0].chatSuggestions).toEqual(['q1', 'q2', 'q3']);
        expect(isProcessing).toBe(false);
    });

    it('records an error when the AI pipeline fails', async () => {
        let isProcessing = false;
        let analyses = [createMockAnalysis()];

        const manager = new AnalysisQueueManager({
            getAnalyses: () => analyses,
            isProcessing: () => isProcessing,
            setProcessing: (value) => {
                isProcessing = value;
            },
            updateAnalysis: (id, updates) => {
                analyses = analyses.map((analysis) =>
                    analysis.id === id ? { ...analysis, ...updates } : analysis,
                );
            },
            getAnalysisReport: vi.fn(async () => {
                throw new Error('API unavailable');
            }),
            getChatSuggestions: vi.fn(async () => ['fallback']),
        });

        await manager.processNext();

        expect(analyses[0].status).toBe('error');
        expect(analyses[0].error).toBe('API unavailable');
        expect(isProcessing).toBe(false);
    });
});
