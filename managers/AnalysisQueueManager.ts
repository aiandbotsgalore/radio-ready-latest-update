import type { AnalysisItem, AnalysisReport } from '../types';

interface QueueProcessingDependencies {
    getAnalyses: () => AnalysisItem[];
    isProcessing: () => boolean;
    setProcessing: (value: boolean) => void;
    updateAnalysis: (id: string, updates: Partial<AnalysisItem>) => void;
    getAnalysisReport: (fileName: string, audioBase64: string, mimeType: string) => Promise<AnalysisReport>;
    getChatSuggestions: (report: AnalysisReport) => Promise<string[]>;
}

/**
 * Coordinates queue processing to ensure only one analysis runs at a time.
 */
export class AnalysisQueueManager {
    constructor(private readonly deps: QueueProcessingDependencies) {}

    public async processNext() {
        const analyses = this.deps.getAnalyses();
        const pendingItem = analyses.find((item) => item.status === 'pending');
        if (!pendingItem || this.deps.isProcessing()) {
            if (!pendingItem) {
                this.deps.setProcessing(false);
            }
            return;
        }

        this.deps.setProcessing(true);
        this.deps.updateAnalysis(pendingItem.id, { status: 'analyzing' });

        try {
            if (!pendingItem.audioData) {
                throw new Error('Audio data is missing for analysis.');
            }

            const audioBase64 = this.arrayBufferToBase64(pendingItem.audioData.buffer);
            const report = await this.deps.getAnalysisReport(
                pendingItem.fileName,
                audioBase64,
                pendingItem.audioData.type,
            );
            this.deps.updateAnalysis(pendingItem.id, { report, status: 'success' });

            const suggestions = await this.deps.getChatSuggestions(report);
            this.deps.updateAnalysis(pendingItem.id, { chatSuggestions: suggestions });
        } catch (error) {
            const message = error instanceof Error ? error.message : 'An unknown error occurred during analysis.';
            this.deps.updateAnalysis(pendingItem.id, { error: message, status: 'error' });
        } finally {
            this.deps.setProcessing(false);
        }
    }

    private arrayBufferToBase64(buffer: ArrayBuffer) {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        for (let index = 0; index < bytes.byteLength; index += 1) {
            binary += String.fromCharCode(bytes[index]);
        }
        return window.btoa(binary);
    }
}
