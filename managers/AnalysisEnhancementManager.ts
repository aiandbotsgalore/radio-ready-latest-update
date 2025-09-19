import type { AnalysisItem, MasteringChain } from '../types';

interface EnhancementDependencies {
    updateAnalysis: (id: string, updates: Partial<AnalysisItem>) => void;
    generateAlbumArt: (trackName: string, genre: string, mood: string, feedbackSummary: string) => Promise<string>;
    getMasteringChain: (
        report: AnalysisItem['report'],
        pluginList: string,
        knowledgeBaseText: string,
        style: AnalysisItem['masteringStyle'],
        complexity: AnalysisItem['chainComplexity'],
        creativeDirection: string,
    ) => Promise<MasteringChain>;
}

/**
 * Orchestrates long-running AI enhancement tasks (album art, mastering chain).
 */
export class AnalysisEnhancementManager {
    constructor(private readonly deps: EnhancementDependencies) {}

    public async generateAlbumArt(id: string, analysis: AnalysisItem) {
        if (!analysis.report) {
            return;
        }

        this.deps.updateAnalysis(id, { isGeneratingArt: true });
        try {
            const { report, fileName } = analysis;
            const feedbackSummary = `Overall: ${report.overallFeedback}. Dynamics: ${report.dynamicRange.feedback}. Frequency: ${report.frequencyBalance.feedback}.`;
            const artUrl = await this.deps.generateAlbumArt(
                fileName,
                report.determinedGenre,
                report.determinedMood,
                feedbackSummary,
            );
            this.deps.updateAnalysis(id, { albumArt: artUrl });
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to generate art.';
            this.deps.updateAnalysis(id, { error: message });
        } finally {
            this.deps.updateAnalysis(id, { isGeneratingArt: false });
        }
    }

    public async generateMasteringChain(
        id: string,
        analysis: AnalysisItem,
        pluginList: string,
        knowledgeBaseText: string,
    ) {
        if (!analysis.report) {
            return;
        }

        this.deps.updateAnalysis(id, { isGeneratingChain: true, chainError: null });
        try {
            const chain = await this.deps.getMasteringChain(
                analysis.report,
                pluginList,
                knowledgeBaseText,
                analysis.masteringStyle,
                analysis.chainComplexity,
                analysis.creativeDirection,
            );
            this.deps.updateAnalysis(id, { masteringChain: chain });
        } catch (error) {
            const message = error instanceof Error ? error.message : 'An unknown error occurred.';
            this.deps.updateAnalysis(id, { chainError: message });
        } finally {
            this.deps.updateAnalysis(id, { isGeneratingChain: false });
        }
    }
}
