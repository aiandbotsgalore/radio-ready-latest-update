import type { Dispatch, SetStateAction } from 'react';
import type { AnalysisItem } from '../types';

/**
 * Centralizes non-React mutations to the analysis collection so the
 * application can reason about updates in a single place.
 */
export class AnalysisCollectionManager {
    constructor(
        private readonly setAnalyses: Dispatch<SetStateAction<AnalysisItem[]>>,
    ) {}

    /**
     * Updates a single analysis entry in the state tree.
     */
    public update = (id: string, updates: Partial<AnalysisItem>) => {
        this.setAnalyses((previous) =>
            previous.map((item) => (item.id === id ? { ...item, ...updates } : item)),
        );
    };

    /**
     * Adds new analyses to the queue while preserving the prior order.
     */
    public append = (items: AnalysisItem[]) => {
        this.setAnalyses((previous) => [...previous, ...items]);
    };

    /**
     * Returns the first pending analysis, if any.
     */
    public getFirstPending = (analyses: AnalysisItem[]): AnalysisItem | undefined => {
        return analyses.find((item) => item.status === 'pending');
    };
}
