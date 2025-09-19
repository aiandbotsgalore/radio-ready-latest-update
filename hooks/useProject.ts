import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { getAnalysisReport, generateAlbumArt, getChatSuggestions, getMasteringChain } from '../services/geminiService';
import type {
    AnalysisReport,
    AppState,
    ActiveTab,
    AnalysisItem,
    ProjectData,
} from '../types';
import { useLiveAPI } from '../context/LiveAPIProvider';
import { useAudioProcessor } from './useAudioProcessor';
import { getAllManuals } from '../lib/db';
import { useDebouncedEffect } from './useDebouncedEffect';
import { DEFAULT_PLUGINS } from '../constants/defaultPlugins';
import { AnalysisCollectionManager } from '../managers/AnalysisCollectionManager';
import { ProjectPersistenceManager } from '../managers/ProjectPersistenceManager';
import { AnalysisQueueManager } from '../managers/AnalysisQueueManager';
import { AnalysisEnhancementManager } from '../managers/AnalysisEnhancementManager';

const fileToArrayBuffer = (file: File): Promise<ArrayBuffer> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.onload = () => resolve(reader.result as ArrayBuffer);
        reader.onerror = (error) => reject(error);
    });

const createAnalysisItem = (file: File, buffer: ArrayBuffer): AnalysisItem => ({
    id: crypto.randomUUID(),
    fileName: file.name,
    status: 'pending',
    report: null,
    error: null,
    chatSuggestions: [],
    albumArt: null,
    masteringChain: null,
    chainError: null,
    messages: [],
    audioData: { buffer, name: file.name, type: file.type },
    masteringStyle: 'Transparent',
    chainComplexity: 'Standard',
    creativeDirection: '',
});

const formatExportFilename = (projectName: string) => {
    const safeName = projectName ? projectName.replace(/\s+/g, '_').toLowerCase() : 'project';
    return `radio-ready-project-${safeName}.json`;
};

export const useProject = () => {
    const [appState, setAppState] = useState<AppState>('idle');
    const [isRestoring, setIsRestoring] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
    const [currentProjectName, setCurrentProjectName] = useState('Unsaved Session');
    const [analyses, setAnalyses] = useState<AnalysisItem[]>([]);
    const [currentAnalysisId, setCurrentAnalysisId] = useState<string | null>(null);
    const [isProcessingQueue, setIsProcessingQueue] = useState(false);

    const [userPlugins, setUserPlugins] = useState(DEFAULT_PLUGINS);
    const [activeTab, setActiveTab] = useState<ActiveTab>('analysis');
    const [knowledgeBaseText, setKnowledgeBaseText] = useState('');
    const [hoveredMetricKey, setHoveredMetricKey] = useState<keyof AnalysisReport | null>(null);

    const { clearMessages, startChatSession, setMessages: setChatMessages, messages: liveMessages } = useLiveAPI();
    const audioProcessor = useAudioProcessor();

    const currentAnalysis = useMemo(
        () => analyses.find((analysis) => analysis.id === currentAnalysisId) ?? null,
        [analyses, currentAnalysisId],
    );

    const applyProjectData = useCallback((data: ProjectData, name?: string, id?: string) => {
        setAnalyses(data.analyses ?? []);
        setCurrentAnalysisId(data.currentAnalysisId ?? null);
        setUserPlugins(data.userPlugins ?? DEFAULT_PLUGINS);
        setCurrentProjectName(name ?? 'Unsaved Session');
        setCurrentProjectId(id ?? null);
        setAppState(data.analyses.length > 0 ? 'success' : 'idle');
        setIsProcessingQueue(false);
        setError(null);
    }, []);

    const analysisManager = useMemo(() => new AnalysisCollectionManager(setAnalyses), []);

    const persistenceManager = useMemo(
        () => new ProjectPersistenceManager({ onApply: applyProjectData }),
        [applyProjectData],
    );

    const analysesRef = useRef<AnalysisItem[]>([]);
    useEffect(() => {
        analysesRef.current = analyses;
    }, [analyses]);

    const processingRef = useRef(false);
    useEffect(() => {
        processingRef.current = isProcessingQueue;
    }, [isProcessingQueue]);

    const queueManager = useMemo(
        () =>
            new AnalysisQueueManager({
                getAnalyses: () => analysesRef.current,
                isProcessing: () => processingRef.current,
                setProcessing: (value: boolean) => {
                    processingRef.current = value;
                    setIsProcessingQueue(value);
                },
                updateAnalysis: analysisManager.update,
                getAnalysisReport,
                getChatSuggestions,
            }),
        [analysisManager],
    );

    const enhancementManager = useMemo(
        () =>
            new AnalysisEnhancementManager({
                updateAnalysis: analysisManager.update,
                generateAlbumArt,
                getMasteringChain,
            }),
        [analysisManager],
    );

    const loadKnowledgeBase = useCallback(async () => {
        try {
            const manuals = await getAllManuals();
            const combinedText = manuals.map((manual) => `Manual for ${manual.name}:\n${manual.content}`).join('\n\n---\n\n');
            setKnowledgeBaseText(combinedText);
            console.log(`Knowledge base loaded with ${manuals.length} manuals.`);
        } catch (err) {
            console.error('Failed to load knowledge base from IndexedDB:', err);
        }
    }, []);

    const handleNewProject = useCallback(() => {
        setAppState('idle');
        setAnalyses([]);
        setCurrentAnalysisId(null);
        setError(null);
        setCurrentProjectId(null);
        setCurrentProjectName('Unsaved Session');
        clearMessages();
        setIsProcessingQueue(false);
        audioProcessor.cleanup();
        persistenceManager.clearSessionState();
    }, [audioProcessor, clearMessages, persistenceManager]);

    const handleFilesSelected = useCallback(
        async (files: File[]) => {
            if (files.length === 0) {
                return;
            }

            setAppState('loading');
            const newItems = await Promise.all(files.map(async (file) => {
                const buffer = await fileToArrayBuffer(file);
                return createAnalysisItem(file, buffer);
            }));

            analysisManager.append(newItems);
            if (!currentAnalysisId) {
                setCurrentAnalysisId(newItems[0].id);
            }
        },
        [analysisManager, currentAnalysisId],
    );

    const handleGenerateArt = useCallback(
        (id: string) => {
            const target = analysesRef.current.find((analysis) => analysis.id === id);
            if (!target) {
                return;
            }

            enhancementManager.generateAlbumArt(id, target);
        },
        [enhancementManager],
    );

    const handleGenerateChain = useCallback(
        (id: string) => {
            const target = analysesRef.current.find((analysis) => analysis.id === id);
            if (!target) {
                return;
            }

            enhancementManager.generateMasteringChain(id, target, userPlugins, knowledgeBaseText);
        },
        [enhancementManager, knowledgeBaseText, userPlugins],
    );

    const handleSaveProject = useCallback(
        async (name: string) => {
            const state: ProjectData = {
                analyses,
                currentAnalysisId,
                userPlugins,
            };
            return persistenceManager.saveNamedProject(name, state, currentProjectId ?? undefined);
        },
        [analyses, currentAnalysisId, currentProjectId, persistenceManager, userPlugins],
    );

    const handleLoadProject = useCallback(async (id: string) => persistenceManager.loadNamedProject(id), [persistenceManager]);

    const handleExportProject = useCallback(() => {
        const state: ProjectData = { analyses, currentAnalysisId, userPlugins };
        const filename = formatExportFilename(currentProjectName);
        persistenceManager.exportProject(state, filename);
    }, [analyses, currentAnalysisId, persistenceManager, userPlugins, currentProjectName]);

    const handleImportProject = useCallback(async (file: File) => {
        try {
            await persistenceManager.importProject(file);
        } catch (err) {
            console.error('Failed to import project:', err);
            throw new Error('Could not import project. The file may be corrupt or in the wrong format.');
        }
    }, [persistenceManager]);

    useEffect(() => {
        const restoreState = async () => {
            try {
                await persistenceManager.restoreLastSession();
            } finally {
                setIsRestoring(false);
            }
        };
        restoreState();
        loadKnowledgeBase();
    }, [loadKnowledgeBase, persistenceManager]);

    useEffect(() => {
        // TECH DEBT: queue processing happens on the main thread. If AI latency
        // grows we should move this orchestration into a Web Worker to avoid UI
        // jank from large audio payloads.
        queueManager.processNext();
    }, [analyses, queueManager]);

    useEffect(() => {
        if (analyses.length > 0) {
            setAppState('success');
        }
    }, [analyses.length]);

    useDebouncedEffect(() => {
        if (isRestoring) {
            return;
        }
        const stateToSave: Omit<ProjectData, 'id'> = {
            analyses,
            currentAnalysisId,
            userPlugins,
        };
        persistenceManager.persistSession(stateToSave).catch((err) =>
            console.error('Failed to save session:', err),
        );
    }, 1000, [analyses, currentAnalysisId, userPlugins, isRestoring, persistenceManager]);

    useEffect(() => {
        if (currentAnalysis?.audioData) {
            audioProcessor.loadAudioFromBuffer(currentAnalysis.audioData);
        } else {
            audioProcessor.cleanup();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentAnalysisId, currentAnalysis?.audioData]);

    useEffect(() => {
        if (currentAnalysis && currentAnalysis.report) {
            startChatSession(currentAnalysis.report);
            setChatMessages(currentAnalysis.messages);
        } else {
            clearMessages();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentAnalysisId, currentAnalysis?.report]);

    useEffect(() => {
        if (currentAnalysisId && liveMessages.length > 0) {
            const existingMessages = analysesRef.current.find((analysis) => analysis.id === currentAnalysisId)?.messages ?? [];
            if (JSON.stringify(liveMessages) !== JSON.stringify(existingMessages)) {
                analysisManager.update(currentAnalysisId, { messages: liveMessages });
            }
        }
    }, [analysisManager, currentAnalysisId, liveMessages]);

    return {
        appState,
        analyses,
        currentAnalysis,
        isProcessingQueue,
        currentAnalysisId,
        error,
        userPlugins,
        setUserPlugins,
        activeTab,
        setActiveTab,
        audioProcessor,
        knowledgeBaseText,
        isRestoring,
        currentProjectId,
        currentProjectName,
        hoveredMetricKey,
        handleFilesSelected,
        handleGenerateArt,
        handleGenerateChain,
        handleNewProject,
        loadKnowledgeBase,
        setHoveredMetricKey,
        setCurrentAnalysisId,
        updateAnalysis: analysisManager.update,
        handleSaveProject,
        handleLoadProject,
        handleExportProject,
        handleImportProject,
    };
};
