import React, { useState } from 'react';
import type { AnalysisMetric, FixSuggestion } from '../types';
import { getFixSuggestion } from '../services/geminiService';
import { WrenchIcon } from './icons/WrenchIcon';

const getScoreColor = (score: number) => {
  if (score >= 8) return 'bg-teal-500/10 text-teal-400';
  if (score >= 5) return 'bg-yellow-500/10 text-yellow-400';
  return 'bg-red-500/10 text-red-400';
};

interface AnalysisReportCardProps {
    title: string;
    metric: AnalysisMetric;
    pluginList: string;
    knowledgeBaseText: string;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
}

export const AnalysisReportCard: React.FC<AnalysisReportCardProps> = ({ title, metric, pluginList, knowledgeBaseText, onMouseEnter, onMouseLeave }) => {
    const [suggestion, setSuggestion] = useState<FixSuggestion | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSuggestFix = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await getFixSuggestion(title, metric.score, metric.feedback, pluginList, knowledgeBaseText);
            setSuggestion(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

  return (
    <div 
        className="bg-gray-800/50 p-6 rounded-lg border border-gray-700/50 backdrop-blur-sm transition-all hover:border-indigo-500/50 hover:bg-gray-800 flex flex-col h-full"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
    >
      <div className="flex items-start justify-between">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <span className={`px-3 py-1 text-sm font-bold rounded-full ${getScoreColor(metric.score)}`}>
          {metric.score}/10
        </span>
      </div>
      
      <div className="mt-4 flex-grow flex flex-col justify-between">
        <div>
          <p className="text-sm text-gray-400">{metric.feedback}</p>
          {suggestion && (
              <div className="mt-4 bg-gray-900/50 p-4 rounded-md border border-gray-700 animate-fade-in">
                  <p className="text-sm font-semibold text-indigo-300">AI Engineer's Suggestion:</p>
                  <p className="mt-1 text-sm text-gray-300">{suggestion.suggestion}</p>
                  <div className="mt-3 space-y-1 border-t border-gray-700/50 pt-3">
                    {suggestion.parameters.map((param) => (
                      <div key={param.name} className="flex justify-between text-xs">
                        <span className="text-gray-400">{param.name}:</span>
                        <span className="font-mono text-teal-300">{param.value}</span>
                      </div>
                    ))}
                  </div>
              </div>
          )}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-700/50 text-center">
        {!suggestion && (
             <button 
                onClick={handleSuggestFix} 
                disabled={isLoading}
                className="inline-flex w-full sm:w-auto justify-center items-center gap-x-2 rounded-md bg-indigo-600/80 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500/80 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
             >
                <WrenchIcon className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                {isLoading ? 'Thinking...' : 'Suggest a Fix'}
             </button>
        )}
        {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
      </div>
    </div>
  );
};