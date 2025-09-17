export interface AnalysisMetric {
  score: number;
  feedback: string;
}

export interface AnalysisReport {
  overallScore: number;
  overallFeedback: string;
  determinedGenre: string;
  determinedMood: string;
  dynamicRange: AnalysisMetric;
  frequencyBalance: AnalysisMetric;
  stereoImage: AnalysisMetric;
  clarityAndDefinition: AnalysisMetric;
  genreFitness: AnalysisMetric;
  moodCongruence: AnalysisMetric;
}

export type Role = 'user' | 'assistant';

export interface Message {
  id: string;
  role: Role;
  content: string;
  timestamp: number;
}

export interface FixSuggestion {
  suggestion: string;
  parameters: { name: string; value: string; }[];
}

export interface MasteringStep {
  pluginName: string;
  detailedReason: string; // Changed from 'reason' for clarity
  parameters: { name: string; value: string; }[];
  alternatives: {
    pluginName: string;
    reason: string;
  }[];
}

export type MasteringChain = MasteringStep[];

export interface SavedAudioData {
    buffer: ArrayBuffer;
    name: string;
    type: string;
}

export type AppState = 'idle' | 'loading' | 'success' | 'error';
export type ActiveTab = 'analysis' | 'chat';
export type MasteringStyle = 'Transparent' | 'Warm' | 'Loud';
export type ChainComplexity = 'Simple' | 'Standard' | 'Complex';

export interface AnalysisItem {
    id: string;
    fileName: string;
    status: 'pending' | 'analyzing' | 'success' | 'error';
    // Analysis results
    report: AnalysisReport | null;
    error: string | null;
    chatSuggestions: string[];
    // Post-analysis data
    albumArt: string | null;
    masteringChain: MasteringChain | null;
    chainError: string | null;
    // Mastering Brief settings
    masteringStyle: MasteringStyle;
    chainComplexity: ChainComplexity;
    creativeDirection: string;
    // Chat
    messages: Message[];
    // Audio data for player
    audioData?: SavedAudioData;
}


// Represents the data structure for a project, whether saved or in a session.
export interface ProjectData {
    analyses: AnalysisItem[];
    currentAnalysisId: string | null;
    userPlugins: string;
}

// Represents the auto-saved session in IndexedDB.
export interface CurrentSession extends ProjectData {
    id: 'current_session';
}

// Represents a user-saved, named project in IndexedDB.
export interface NamedProject extends ProjectData {
    id: string;
    name: string;
    timestamp: number;
}