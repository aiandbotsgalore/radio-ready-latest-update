import React from 'react';
import type { AnalysisItem, MasteringStyle, ChainComplexity } from '../types';
import { MagicWandIcon } from './icons/MagicWandIcon';
import { ResetIcon } from './icons/ResetIcon'; // Using ResetIcon for re-generation

interface MasteringChainGeneratorProps {
    analysis: AnalysisItem;
    isGenerating: boolean;
    onGenerate: () => void;
    onUpdate: (updates: Partial<AnalysisItem>) => void;
}

const RadioPill: React.FC<{
    id: string;
    name: string;
    value: string;
    label: string;
    checked: boolean;
    onChange: (value: any) => void;
}> = ({ id, name, value, label, checked, onChange }) => (
    <div>
        <input
            type="radio"
            id={id}
            name={name}
            value={value}
            checked={checked}
            onChange={(e) => onChange(e.target.value)}
            className="sr-only"
        />
        <label
            htmlFor={id}
            className={`cursor-pointer px-3 py-1 text-xs font-medium rounded-full transition-all block text-center ${
                checked
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
            }`}
        >
            {label}
        </label>
    </div>
);

export const MasteringChainGenerator: React.FC<MasteringChainGeneratorProps> = ({
    analysis,
    isGenerating,
    onGenerate,
    onUpdate
}) => {
    const hasExistingChain = !!analysis.masteringChain;

    return (
        <div className="flex flex-col items-center text-center space-y-4 w-full">
            <h3 className="text-xl font-semibold text-white">
                {hasExistingChain ? 'Mastering Chain' : 'AI Mastering Brief'}
            </h3>

            {!hasExistingChain && <p className="text-xs text-gray-400 mt-1">Guide the AI to create your custom mastering chain.</p>}

            <div className="w-full space-y-4 pt-2">
                {/* Mastering Style */}
                <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">Mastering Style</label>
                    <div className="grid grid-cols-3 gap-2">
                        {(['Transparent', 'Warm', 'Loud'] as MasteringStyle[]).map((style) => (
                           <RadioPill
                                key={style}
                                id={`style-${style}`}
                                name="mastering-style"
                                value={style}
                                label={style}
                                checked={analysis.masteringStyle === style}
                                onChange={(value) => onUpdate({ masteringStyle: value })}
                           />
                        ))}
                    </div>
                </div>

                {/* Chain Complexity */}
                <div>
                     <label className="block text-sm font-medium text-gray-200 mb-2">Chain Complexity</label>
                    <div className="grid grid-cols-3 gap-2">
                         {(['Simple', 'Standard', 'Complex'] as ChainComplexity[]).map((c) => (
                           <RadioPill
                                key={c}
                                id={`complexity-${c}`}
                                name="chain-complexity"
                                value={c}
                                label={c}
                                checked={analysis.chainComplexity === c}
                                onChange={(value) => onUpdate({ chainComplexity: value })}
                           />
                        ))}
                    </div>
                </div>

                {/* Creative Direction */}
                <div>
                    <label htmlFor="creative-direction" className="block text-sm font-medium text-gray-200">Creative Direction (Optional)</label>
                    <textarea
                        id="creative-direction"
                        value={analysis.creativeDirection}
                        onChange={(e) => onUpdate({ creativeDirection: e.target.value })}
                        rows={2}
                        placeholder="e.g., Make it punchy for club play"
                        className="mt-2 block w-full rounded-md bg-gray-900/70 border-gray-600 text-gray-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                </div>
            </div>

            <button 
                onClick={onGenerate} 
                disabled={isGenerating} 
                className="mt-4 inline-flex w-full justify-center items-center gap-x-2 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors disabled:bg-gray-600 disabled:cursor-wait"
            >
                {hasExistingChain 
                    ? <ResetIcon className={`w-5 h-5 ${isGenerating ? 'animate-spin' : ''}`} />
                    : <MagicWandIcon className={`w-5 h-5 ${isGenerating ? 'animate-spin' : ''}`} />
                }
                {isGenerating 
                    ? 'Designing...' 
                    : hasExistingChain ? 'Re-generate Chain' : 'Generate AI Mastering Chain'
                }
            </button>
        </div>
    );
};
