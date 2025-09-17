import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { getAnalysisReport, generateAlbumArt, getChatSuggestions, getMasteringChain } from '../services/geminiService';
import type { AnalysisReport, AppState, ActiveTab, NamedProject, AnalysisItem, ChainComplexity, MasteringStyle, ProjectData } from '../types';
import { useLiveAPI } from '../context/LiveAPIProvider';
import { useAudioProcessor } from './useAudioProcessor';
import { 
    saveCurrentSession, loadCurrentSession, clearCurrentSession, 
    getAllManuals, saveNamedProject, loadNamedProject
} from '../lib/db';

const DEFAULT_PLUGINS = `
- Auburn Sounds - Graillon 2
- Audiofied - T A Equalizer
- Audiofied - T A Equalizer Pro
- Audiofied - T C Amplification 3 Pro
- Audiofied - Mxl Checker Ultra
- Audiofied - Mxl Checker Pro
- Audiofied - RX2k2k Equalizer
- Audiofied - RX2k2b Equalizer
- Audiofied - UT3b Compressor
- Audiofied - UT3 Saturator
- iZotope - Neutron 5 Clipper
- iZotope - Neutron 5 Compressor
- iZotope - Neutron 5 Density
- iZotope - Neutron 5 Equalizer
- iZotope - Neutron 5 Exciter
- iZotope - Neutron 5 Gate
- iZotope - Neutron 5 Limiter
- iZotope - Neutron 5 Phase
- iZotope - Neutron 5 Sculptor
- iZotope - Neutron 5 Transient Shaper
- iZotope - Neutron 5 Unmask
- iZotope - Neutron 5 Visual Mixer
- iZotope - Ozone Imager 2
- iZotope - RX 11 Breath Control
- iZotope - RX 11 Connect
- iZotope - RX 11 De-click
- iZotope - RX 11 De-crackle
- iZotope - RX 11 De-ess
- iZotope - RX 11 De-hum
- iZotope - RX 11 De-plosive
- iZotope - RX 11 De-reverb
- iZotope - RX 11 De-noise
- iZotope - RX 11 Dialogue Isolate
- iZotope - RX 11 Guitar De-noise
- iZotope - RX 11 Monitor
- iZotope - RX 11 Mouth De-click
- iZotope - RX 11 Repair Assistant
- iZotope - RX 11 Spectral De-noise
- iZotope - RX 11 Voice De-noise
- iZotope - Ozone 9 Dynamic EQ
- iZotope - Ozone 9 Exciter
- iZotope - Ozone 9 Imager
- iZotope - Ozone 9 Low End Focus
- iZotope - Ozone 9 Master Rebalance
- iZotope - Ozone 9 Spectral Shaper
- iZotope - Ozone 9 Vintage Compressor
- iZotope - Ozone 9 Vintage EQ
- iZotope - Ozone 9 Vintage Limiter
- iZotope - Ozone 9 Vintage Tape
- LANDR - LANDR Mastering Pro
- LANDR - LANDR Mastering Standard
- LANDR - LANDR Mastering
- LANDR - LANDR MixChain
- LANDR - LANDR MixDeEss
- LANDR - LANDR MixTune
- MeldaProduction - MAGG
- MeldaProduction - MAnalyzer
- MeldaProduction - MBandPass
- MeldaProduction - MBandStop
- MeldaProduction - MCCGenerator
- MeldaProduction - MChannelMatrix
- MeldaProduction - MComb
- MeldaProduction - MCompressor
- MeldaProduction - MConvolutionEZ
- MeldaProduction - MDrumEnhancer
- MeldaProduction - MDynamicEQ
- MeldaProduction - MDynamics
- MeldaProduction - MEcho
- MeldaProduction - MEq
- MeldaProduction - MEqualizer
- MeldaProduction - MFlanger
- MeldaProduction - MFreeFormPhase
- MeldaProduction - MFreqShifter
- MeldaProduction - MGain
- MeldaProduction - MGate
- MeldaProduction - MGenerator
- MeldaProduction - MInstant
- MeldaProduction - MLimiter
- MeldaProduction - MLoudnessAnalyzer
- MeldaProduction - MMaximizer
- MeldaProduction - MMeter
- MeldaProduction - MMidSide
- MeldaProduction - MMixer
- MeldaProduction - MModernCompressor
- MeldaProduction - MModernEQ
- MeldaProduction - MModernSaturation
- MeldaProduction - MMultiBandCompressor
- MeldaProduction - MNoiseGenerator
- MeldaProduction - MNoiseSuppressor
- MeldaProduction - MOscillator
- MeldaProduction - MOscilloscope
- MeldaProduction - MPassiveEQ
- MeldaProduction - MPhaser
- MeldaProduction - MPitch
- MeldaProduction - MPitchShift
- MeldaProduction - MPreAmp
- MeldaProduction - MReverb
- MeldaProduction - MRotary
- MeldaProduction - MRhythmizer
- MeldaProduction - MSaturator
- MeldaProduction - MSpectralDynamics
- MeldaProduction - MSpectralFX
- MeldaProduction - MStereoAnalyzer
- MeldaProduction - MStereoExpander
- MeldaProduction - MTurboComp
- MeldaProduction - MTuner
- MeldaProduction - MTransient
- MeldaProduction - MTube
- MeldaProduction - MUtility
- MeldaProduction - MVibrato
- MeldaProduction - MVintageRotary
- MeldaProduction - MVintageWah
- MeldaProduction - MWaveShaper
- MeldaProduction - MWide
- MeldaProduction - MXLoudness
- MeldaProduction - MXLoudness2
- Mercuriall - MT-A
- ML Sound Lab - Amped Roots
- Musik Hack - FUEL
- Nomad Factory - AMT Amp Leveling v2
- Nomad Factory - AMT Max Warm v2
- Nomad Factory - AMT Mini Warmer v2
- PLUGIN ALLIANCE-BRAINWORX - Shadow Hills Class A Mastering Comp
- PLUGIN ALLIANCE-BRAINWORX - Shadow Hills Mastering Compressor
- Softube - Drawmer S73
- Softube - Marshall Plexi Classic
- Softube - Saturation Knob
- Softube - Tube Delay
- Softube - Tube-Tech CL 1B mkII
- Techivation - AI-De-Esser
- Techivation - AI-Impactor
- Techivation - T-De-Esser 2
- Tokyo Dawn Labs - TDR Molotok
- ToneBoosters - TB Equalizer Pro v4
- ToneBoosters - TB Barricade v4
- ToneBoosters - TB BitJuggler v4
- ToneBoosters - TB Compressor v4
- ToneBoosters - TB Dual VCF v4
- ToneBoosters - TB Enhancer v4
- ToneBoosters - TB Equalizer v4
- ToneBoosters - TB Ezcomp v4
- ToneBoosters - TB EzQ v4
- ToneBoosters - TB Ezverb v4
- ToneBoosters - TB Gate v4
- ToneBoosters - TB MBC v1
- ToneBoosters - TB Morphit v4
- ToneBoosters - TB Reverb v4
- ToneBoosters - TB Reverb V2
- ToneBoosters - TB Sibalance v4
- ToneBoosters - TB Spectrogram v4
- ToneBoosters - TB VocalPitcher v4
- Universal Audio - UADx 1176 FET Compressor
- Universal Audio - UADx 1176 Rev A Compressor
- Universal Audio - UADx 1176AE Compressor
- Universal Audio - UADx 1176LN Rev E Compressor
- Universal Audio - UADx 175-B Compressor
- Universal Audio - UADx 176 Compressor
- Universal Audio - UADx A-Type Multiband Enhancer
- Universal Audio - UADx Avalon VT-737 Channel Strip
- Universal Audio - UADx Brigade Chorus
- Universal Audio - UADx Capitol Chambers
- Universal Audio - UADx Capitol Mastering Compressor
- Universal Audio - UADx dbx 160 Compressor
- Universal Audio - UADx Empirical Labs Distressor
- Universal Audio - UADx Fairchild 660 Compressor
- Universal Audio - UADx Fairchild 670 Compressor
- Universal Audio - UADx Helios Type 69 Preamp and EQ
- Universal Audio - UADx Hitsville EQ
- Universal Audio - UADx Hitsville EQ Mastering
- Universal Audio - UADx LA-2A Tube Compressor
- Universal Audio - UADx LA-3A Compressor
- Universal Audio - UADx LA-6176 Channel Strip
- Universal Audio - UADx Lexicon 224 Digital Reverb
- Universal Audio - UADx Manley Massive Passive EQ
- Universal Audio - UADx Manley Massive Passive MST
- Universal Audio - UADx Manley Variable Mu Compressor
- Universal Audio - UADx Manley VOXBOX Channel Strip
- Universal Audio - UADx SSL E Channel Strip
- Universal Audio - UADx SSL G Bus Compressor
- Universal Audio - UADx Studio D Chorus
- Universal Audio - UADx Topline Vocal Suite
- Universal Audio - UADx Verve Analog Machines
- Universal Audio - UADx Waterfall Rotary Speaker
- VOXENGO - Boogex
- VOXENGO - CurveEQ
- VOXENGO - Voxformer
`.trim();

const useDebouncedEffect = (callback: () => void, delay: number, deps: React.DependencyList) => {
    const callbackRef = useRef(callback);
    useEffect(() => {
        callbackRef.current = callback;
    });
    useEffect(() => {
        const handler = setTimeout(() => {
            callbackRef.current();
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [...deps, delay]);
};

export const useProject = () => {
    // Overall App State
    const [appState, setAppState] = useState<AppState>('idle');
    const [isRestoring, setIsRestoring] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null); // For global errors

    // Project and Queue State
    const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
    const [currentProjectName, setCurrentProjectName] = useState<string>('Unsaved Session');
    const [analyses, setAnalyses] = useState<AnalysisItem[]>([]);
    const [currentAnalysisId, setCurrentAnalysisId] = useState<string | null>(null);
    const [isProcessingQueue, setIsProcessingQueue] = useState<boolean>(false);
    
    // UI and Config State
    const [userPlugins, setUserPlugins] = useState<string>(DEFAULT_PLUGINS);
    const [activeTab, setActiveTab] = useState<ActiveTab>('analysis');
    const [knowledgeBaseText, setKnowledgeBaseText] = useState<string>('');
    const [hoveredMetricKey, setHoveredMetricKey] = useState<keyof AnalysisReport | null>(null);

    // Services and Hooks
    const { clearMessages, startChatSession, setMessages: setChatMessages, messages: liveMessages } = useLiveAPI();
    const audioProcessor = useAudioProcessor();

    const currentAnalysis = useMemo(() => {
        return analyses.find(a => a.id === currentAnalysisId) || null;
    }, [analyses, currentAnalysisId]);
    
    // --- UTILITY FUNCTIONS ---
    const updateAnalysis = useCallback((id: string, updates: Partial<AnalysisItem>) => {
        setAnalyses(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
    }, []);

    const fileToArrayBuffer = (file: File): Promise<ArrayBuffer> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsArrayBuffer(file);
            reader.onload = () => resolve(reader.result as ArrayBuffer);
            reader.onerror = error => reject(error);
        });

    const arrayBufferToBase64 = (buffer: ArrayBuffer) => {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    }
    
    const applyProjectData = (data: ProjectData, name?: string, id?: string) => {
        setAnalyses(data.analyses || []);
        setCurrentAnalysisId(data.currentAnalysisId || null);
        setUserPlugins(data.userPlugins || DEFAULT_PLUGINS);
        setCurrentProjectName(name || 'Unsaved Session');
        setCurrentProjectId(id || null);
        setAppState(data.analyses.length > 0 ? 'success' : 'idle');
    };

    // --- KNOWLEDGE BASE ---
    const loadKnowledgeBase = useCallback(async () => {
        try {
            const manuals = await getAllManuals();
            const combinedText = manuals.map(m => `Manual for ${m.name}:\n${m.content}`).join('\n\n---\n\n');
            setKnowledgeBaseText(combinedText);
            console.log(`Knowledge base loaded with ${manuals.length} manuals.`);
        } catch (err) {
            console.error("Failed to load knowledge base from IndexedDB:", err);
        }
    }, []);

    // --- QUEUE PROCESSING ---
    const processQueue = useCallback(async () => {
        const pendingItem = analyses.find(a => a.status === 'pending');
        if (!pendingItem || isProcessingQueue) {
            if (!pendingItem) setIsProcessingQueue(false);
            return;
        }

        setIsProcessingQueue(true);
        updateAnalysis(pendingItem.id, { status: 'analyzing' });

        try {
            if (!pendingItem.audioData) throw new Error("Audio data is missing for analysis.");
            const audioBase64 = arrayBufferToBase64(pendingItem.audioData.buffer);
            
            const report = await getAnalysisReport(pendingItem.fileName, audioBase64, pendingItem.audioData.type);
            updateAnalysis(pendingItem.id, { report, status: 'success' });
            
            const suggestions = await getChatSuggestions(report);
            updateAnalysis(pendingItem.id, { chatSuggestions: suggestions });

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred during analysis.';
            updateAnalysis(pendingItem.id, { error: errorMessage, status: 'error' });
        }
    }, [analyses, isProcessingQueue, updateAnalysis]);
    
    useEffect(() => {
        processQueue();
    }, [analyses, processQueue]);


    // --- PROJECT & SESSION HANDLERS ---
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
        clearCurrentSession();
    }, [clearMessages, audioProcessor]);

    const handleSaveProject = useCallback(async (name: string): Promise<string> => {
        const projectData: ProjectData = {
            analyses,
            currentAnalysisId,
            userPlugins,
        };
        const savedProject = await saveNamedProject(name, projectData, currentProjectId || undefined);
        setCurrentProjectId(savedProject.id);
        setCurrentProjectName(savedProject.name);
        return savedProject.id;
    }, [analyses, currentAnalysisId, userPlugins, currentProjectId]);

    const handleLoadProject = useCallback(async (id: string) => {
        const project = await loadNamedProject(id);
        if (project) {
            applyProjectData(project, project.name, project.id);
        } else {
            throw new Error("Project not found.");
        }
    }, []);
    
    const handleExportProject = useCallback(() => {
        const state: ProjectData = {
            analyses,
            currentAnalysisId,
            userPlugins
        };
        const jsonString = JSON.stringify(state, null, 2);
        const blob = new Blob([jsonString], {type: "application/json"});
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        const formattedName = (currentProjectName || 'project').replace(/\s+/g, '_').toLowerCase();
        link.download = `radio-ready-project-${formattedName}.json`;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
    }, [analyses, currentAnalysisId, userPlugins, currentProjectName]);

    const handleImportProject = useCallback(async (file: File) => {
        try {
            const text = await file.text();
            const projectData = JSON.parse(text) as ProjectData;
            // Basic validation
            if (Array.isArray(projectData.analyses) && 'userPlugins' in projectData) {
                applyProjectData(projectData, `${file.name.replace('.json', '')} (imported)`);
            } else {
                throw new Error("Invalid project file format.");
            }
        } catch (err) {
            console.error("Failed to import project:", err);
            throw new Error("Could not import project. The file may be corrupt or in the wrong format.");
        }
    }, []);


    // --- FILE & AI HANDLERS ---
    const handleFilesSelected = useCallback(async (files: File[]) => {
        setAppState('loading');

        const newAnalysisItems: AnalysisItem[] = await Promise.all(
            files.map(async (file) => {
                const buffer = await fileToArrayBuffer(file);
                return {
                    id: crypto.randomUUID(),
                    fileName: file.name,
                    status: 'pending' as const,
                    report: null,
                    error: null,
                    chatSuggestions: [],
                    albumArt: null,
                    masteringChain: null,
                    chainError: null,
                    messages: [],
                    audioData: { buffer, name: file.name, type: file.type },
                    masteringStyle: 'Transparent' as MasteringStyle,
                    chainComplexity: 'Standard' as ChainComplexity,
                    creativeDirection: '',
                };
            })
        );
        
        setAnalyses(prev => [...prev, ...newAnalysisItems]);
        
        // If nothing is selected yet, select the first new file
        if (!currentAnalysisId) {
            setCurrentAnalysisId(newAnalysisItems[0].id);
        }
    }, [currentAnalysisId]);

    const handleGenerateArt = useCallback(async (id: string) => {
        const analysis = analyses.find(a => a.id === id);
        if (!analysis || !analysis.report) return;
        updateAnalysis(id, { isGeneratingArt: true } as any);
        try {
            const { report, fileName } = analysis;
            const feedbackSummary = `Overall: ${report.overallFeedback}. Dynamics: ${report.dynamicRange.feedback}. Frequency: ${report.frequencyBalance.feedback}.`;
            const artUrl = await generateAlbumArt(fileName, report.determinedGenre, report.determinedMood, feedbackSummary);
            updateAnalysis(id, { albumArt: artUrl });
        } catch (err) {
             const errorMessage = err instanceof Error ? err.message : 'Failed to generate art.';
             updateAnalysis(id, { error: errorMessage });
        } finally {
            updateAnalysis(id, { isGeneratingArt: false } as any);
        }
    }, [analyses, updateAnalysis]);

    const handleGenerateChain = useCallback(async (id: string) => {
        const analysis = analyses.find(a => a.id === id);
        if (!analysis || !analysis.report) return;
        updateAnalysis(id, { isGeneratingChain: true, chainError: null } as any);
        try {
            const chain = await getMasteringChain(
                analysis.report, 
                userPlugins, 
                knowledgeBaseText, 
                analysis.masteringStyle, 
                analysis.chainComplexity,
                analysis.creativeDirection
            );
            updateAnalysis(id, { masteringChain: chain });
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
            updateAnalysis(id, { chainError: errorMessage });
        } finally {
             updateAnalysis(id, { isGeneratingChain: false } as any);
        }
    }, [analyses, userPlugins, knowledgeBaseText, updateAnalysis]);

    // --- PERSISTENCE AND STATE SYNC ---
    
    // Restore session on initial load
    useEffect(() => {
        const restoreState = async () => {
            const savedState = await loadCurrentSession();
            if (savedState) {
                console.log("Restoring previous session...");
                applyProjectData(savedState);
            }
            setIsRestoring(false);
        };
        restoreState();
        loadKnowledgeBase();
    }, [loadKnowledgeBase]);

    // Save current session on change (debounced)
    useDebouncedEffect(() => {
        if (isRestoring) return;

        const stateToSave: Omit<ProjectData, 'id'> = {
            analyses,
            currentAnalysisId,
            userPlugins,
        };
        saveCurrentSession(stateToSave).catch(err => console.error("Failed to save session:", err));
    }, 1000, [analyses, currentAnalysisId, userPlugins]);

    // Sync audio player with current analysis
    useEffect(() => {
        if (currentAnalysis?.audioData) {
            audioProcessor.loadAudioFromBuffer(currentAnalysis.audioData);
        } else {
            audioProcessor.cleanup();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentAnalysisId, currentAnalysis?.audioData]);
    
    // Sync chat with current analysis
    useEffect(() => {
        if (currentAnalysis && currentAnalysis.report) {
            startChatSession(currentAnalysis.report);
            setChatMessages(currentAnalysis.messages);
        } else {
            clearMessages();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentAnalysisId, currentAnalysis?.report]);

    // Sync back live messages to the current analysis item
    useEffect(() => {
        if (currentAnalysisId && liveMessages.length > 0) {
            const currentMessages = analyses.find(a => a.id === currentAnalysisId)?.messages || [];
            if (JSON.stringify(liveMessages) !== JSON.stringify(currentMessages)) {
                 updateAnalysis(currentAnalysisId, { messages: liveMessages });
            }
        }
    }, [liveMessages, currentAnalysisId, analyses, updateAnalysis]);


    return {
        appState, analyses, currentAnalysis, isProcessingQueue, currentAnalysisId,
        error, userPlugins, setUserPlugins, activeTab, setActiveTab, audioProcessor,
        knowledgeBaseText, isRestoring, currentProjectId, currentProjectName,
        handleFilesSelected, handleGenerateArt, handleGenerateChain, handleNewProject,
        loadKnowledgeBase, setHoveredMetricKey, setCurrentAnalysisId, updateAnalysis,
        handleSaveProject, handleLoadProject, handleExportProject, handleImportProject
    };
};