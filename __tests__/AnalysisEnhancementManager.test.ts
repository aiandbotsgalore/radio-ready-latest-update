import { describe, expect, it, vi } from 'vitest';
import { AnalysisEnhancementManager } from '../managers/AnalysisEnhancementManager';
import type { AnalysisItem, MasteringChain } from '../types';

const baseAnalysis: AnalysisItem = {
    id: 'analysis-1',
    fileName: 'track.wav',
    status: 'success',
    report: {
        overallScore: 8,
        overallFeedback: 'Solid performance.',
        determinedGenre: 'House',
        determinedMood: 'Upbeat',
        dynamicRange: { score: 7, feedback: 'Needs glue compression.' },
        frequencyBalance: { score: 6, feedback: 'Low end a touch heavy.' },
        stereoImage: { score: 8, feedback: 'Pleasant width.' },
        clarityAndDefinition: { score: 7, feedback: 'Slight vocal masking.' },
        genreFitness: { score: 8, feedback: 'Club-ready.' },
        moodCongruence: { score: 9, feedback: 'Energy matches mood.' },
    },
    error: null,
    chatSuggestions: [],
    albumArt: null,
    masteringChain: null,
    chainError: null,
    messages: [],
    audioData: undefined,
    masteringStyle: 'Warm',
    chainComplexity: 'Standard',
    creativeDirection: 'Keep the groove warm and analog.',
};

describe('AnalysisEnhancementManager', () => {
    it('persists generated album art to the analysis entry', async () => {
        const recordedUpdates: Partial<AnalysisItem>[] = [];
        const manager = new AnalysisEnhancementManager({
            updateAnalysis: (_, partial) => {
                recordedUpdates.push(partial);
            },
            generateAlbumArt: vi.fn(async () => 'data:image/png;base64,abc123'),
            getMasteringChain: vi.fn(),
        });

        await manager.generateAlbumArt(baseAnalysis.id, baseAnalysis);

        expect(recordedUpdates.some((update) => update.albumArt === 'data:image/png;base64,abc123')).toBe(true);
        // FIX: Replaced .at(-1) with bracket notation for wider compatibility.
        expect(recordedUpdates[recordedUpdates.length - 1]).toMatchObject({ isGeneratingArt: false });
    });

    it('records mastering chain results', async () => {
        const chain: MasteringChain = [
            {
                pluginName: 'EQ',
                detailedReason: 'Shape tonal balance.',
                parameters: [{ name: 'Gain', value: '+1dB' }],
                alternatives: [{ pluginName: 'Alt EQ', reason: 'Similar tone' }],
            },
        ];

        const recordedUpdates: Partial<AnalysisItem>[] = [];
        const manager = new AnalysisEnhancementManager({
            updateAnalysis: (_, partial) => {
                recordedUpdates.push(partial);
            },
            generateAlbumArt: vi.fn(),
            getMasteringChain: vi.fn(async () => chain),
        });

        await manager.generateMasteringChain(baseAnalysis.id, baseAnalysis, '- Plugin', 'KB');

        expect(recordedUpdates.some((update) => update.masteringChain === chain)).toBe(true);
        // FIX: Replaced .at(-1) with bracket notation for wider compatibility.
        expect(recordedUpdates[recordedUpdates.length - 1]).toMatchObject({ isGeneratingChain: false });
    });

    it('stores an error message when chain generation fails', async () => {
        const recordedUpdates: Partial<AnalysisItem>[] = [];
        const manager = new AnalysisEnhancementManager({
            updateAnalysis: (_, partial) => {
                recordedUpdates.push(partial);
            },
            generateAlbumArt: vi.fn(),
            getMasteringChain: vi.fn(async () => {
                throw new Error('Chain failure');
            }),
        });

        await manager.generateMasteringChain(baseAnalysis.id, baseAnalysis, '- Plugin', 'KB');

        expect(recordedUpdates.some((update) => update.chainError === 'Chain failure')).toBe(true);
        // FIX: Replaced .at(-1) with bracket notation for wider compatibility.
        expect(recordedUpdates[recordedUpdates.length - 1]).toMatchObject({ isGeneratingChain: false });
    });
});