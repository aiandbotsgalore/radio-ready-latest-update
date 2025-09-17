import React, { useRef } from 'react';
import type { AnalysisItem } from '../types';
import { SpinnerIcon } from './icons/SpinnerIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { ExclamationTriangleIcon } from './icons/ExclamationTriangleIcon';
import { UploadIcon } from './icons/UploadIcon';
import { ResetIcon } from './icons/ResetIcon';

interface AnalysisQueueProps {
    analyses: AnalysisItem[];
    currentAnalysisId: string | null;
    onSelect: (id: string) => void;
    onAddFiles: (files: File[]) => void;
    onNewProject: () => void;
}

const QueueItem: React.FC<{ item: AnalysisItem; isSelected: boolean; onSelect: () => void }> = ({ item, isSelected, onSelect }) => {
    const getStatusInfo = () => {
        switch (item.status) {
            case 'pending':
                return { icon: <span className="w-2 h-2 rounded-full bg-gray-500"></span>, text: 'Pending', color: 'text-gray-400' };
            case 'analyzing':
                return { icon: <SpinnerIcon className="w-4 h-4 text-indigo-400" />, text: 'Analyzing...', color: 'text-indigo-300' };
            case 'success':
                return { icon: <CheckCircleIcon className="w-4 h-4 text-teal-400" />, text: `Score: ${item.report?.overallScore}/10`, color: 'text-teal-300' };
            case 'error':
                return { icon: <ExclamationTriangleIcon className="w-4 h-4 text-red-400" />, text: 'Error', color: 'text-red-400' };
        }
    };
    const { icon, text, color } = getStatusInfo();

    return (
        <li 
            onClick={onSelect}
            className={`p-3 rounded-lg cursor-pointer transition-all border ${isSelected ? 'bg-indigo-500/20 border-indigo-400/50' : 'bg-gray-800/50 border-gray-700/50 hover:bg-gray-800'}`}
        >
            <div className="flex justify-between items-center">
                <p className={`text-sm truncate pr-2 ${isSelected ? 'text-white' : 'text-gray-300'}`} title={item.fileName}>
                    {item.fileName}
                </p>
                <div className={`flex items-center gap-x-2 text-xs font-medium ${color}`}>
                    {icon}
                    <span>{text}</span>
                </div>
            </div>
        </li>
    );
};


export const AnalysisQueue: React.FC<AnalysisQueueProps> = ({ analyses, currentAnalysisId, onSelect, onAddFiles, onNewProject }) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) {
            onAddFiles(files);
        }
        // Reset input value to allow re-uploading the same file
        if(inputRef.current) inputRef.current.value = '';
    };

    return (
        <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/50 backdrop-blur-sm space-y-4">
            <h2 className="text-lg font-semibold text-white px-2">Analysis Queue</h2>
            {analyses.length > 0 ? (
                <ul className="space-y-2 max-h-60 overflow-y-auto pr-1">
                    {analyses.map(item => (
                        <QueueItem
                            key={item.id}
                            item={item}
                            isSelected={item.id === currentAnalysisId}
                            onSelect={() => onSelect(item.id)}
                        />
                    ))}
                </ul>
            ) : (
                <p className="text-sm text-gray-500 text-center py-4">No tracks uploaded.</p>
            )}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-700/50">
                 <input
                    ref={inputRef}
                    type="file"
                    accept="audio/*"
                    className="hidden"
                    onChange={handleFileChange}
                    multiple
                />
                 <button 
                    onClick={() => inputRef.current?.click()}
                    className="inline-flex items-center justify-center gap-x-2 rounded-md bg-indigo-600/80 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500/80 transition-colors"
                >
                    <UploadIcon className="w-5 h-5" />
                    Add Tracks
                </button>
                 <button 
                    onClick={onNewProject}
                    className="inline-flex items-center justify-center gap-x-2 rounded-md bg-red-600/20 px-3 py-2 text-sm font-semibold text-red-300 shadow-sm hover:bg-red-600/40 transition-colors"
                >
                    <ResetIcon className="w-5 h-5" />
                    New Project
                </button>
            </div>
        </div>
    );
};