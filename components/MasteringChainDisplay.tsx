import React, { useState } from 'react';
import type { MasteringChain, MasteringStep } from '../types';
import { ChevronDownIcon } from './icons/ChevronDownIcon';

const PluginStep: React.FC<{ step: MasteringStep, index: number, isOpen: boolean, onToggle: () => void }> = ({ step, index, isOpen, onToggle }) => {
    return (
        <div className="bg-gray-800/60 rounded-lg border border-gray-700/50 overflow-hidden">
            <button
                onClick={onToggle}
                className="w-full flex justify-between items-center p-4 text-left"
                aria-expanded={isOpen}
                aria-controls={`step-details-${index}`}
            >
                <h4 className="text-md font-semibold text-indigo-300">
                    Step {index + 1}: {step.pluginName}
                </h4>
                <ChevronDownIcon className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <div
                id={`step-details-${index}`}
                className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
            >
                <div className="px-4 pb-4 border-t border-gray-700/50">
                    <p className="mt-3 text-sm text-gray-300 leading-relaxed">{step.detailedReason}</p>
                    
                    <h5 className="mt-4 text-xs font-bold uppercase tracking-wider text-gray-400">Parameters</h5>
                    <div className="mt-2 space-y-1 pt-2">
                        {step.parameters.map((param) => (
                            <div key={param.name} className="flex justify-between text-xs">
                                <span className="text-gray-400">{param.name}:</span>
                                <span className="font-mono text-teal-300">{param.value}</span>
                            </div>
                        ))}
                    </div>

                    {step.alternatives && step.alternatives.length > 0 && (
                        <>
                            <h5 className="mt-4 text-xs font-bold uppercase tracking-wider text-gray-400">Alternatives</h5>
                            <div className="mt-2 space-y-2 pt-2">
                                {step.alternatives.map(alt => (
                                    <div key={alt.pluginName} className="text-xs">
                                        <p className="font-semibold text-gray-300">{alt.pluginName}</p>
                                        <p className="text-gray-400 italic">{alt.reason}</p>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export const MasteringChainDisplay: React.FC<{ chain: MasteringChain }> = ({ chain }) => {
    const [openIndex, setOpenIndex] = useState<number | null>(0); // Open the first step by default

    const handleToggle = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="animate-fade-in text-center w-full">
             <div className="space-y-3 text-left">
                {chain.map((step, index) => (
                    <PluginStep 
                        key={index} 
                        step={step} 
                        index={index} 
                        isOpen={openIndex === index}
                        onToggle={() => handleToggle(index)}
                    />
                ))}
             </div>
        </div>
    );
};
