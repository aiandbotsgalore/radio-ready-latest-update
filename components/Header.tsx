import React from 'react';
import { RobotIcon } from './icons/RobotIcon';
import type { AnalysisItem } from '../types';
import { FolderOpenIcon } from './icons/FolderOpenIcon';

interface HeaderProps {
    analyses?: AnalysisItem[];
    isProcessingQueue?: boolean;
    status?: 'error';
    projectName?: string;
    onOpenProjects?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
    analyses = [], 
    isProcessingQueue = false, 
    status, 
    projectName,
    onOpenProjects
}) => {
    
    const renderStatus = () => {
        if (status === 'error') {
            return <span className="text-red-400">An error occurred. Please see details below.</span>;
        }

        if (!isProcessingQueue && analyses.every(a => a.status === 'success' || a.status === 'error')) {
             const successCount = analyses.filter(a => a.status === 'success').length;
             return <span className="text-teal-400">Analysis complete for {successCount} of {analyses.length} tracks.</span>;
        }

        if (isProcessingQueue) {
            const currentlyAnalyzing = analyses.find(a => a.status === 'analyzing');
            const total = analyses.length;
            const currentIndex = analyses.findIndex(a => a.status === 'analyzing');
            if (currentlyAnalyzing) {
                return <span className="text-indigo-400">Analyzing track {currentIndex + 1} of {total}: "{currentlyAnalyzing.fileName}"...</span>;
            }
        }
        
        if(analyses.length > 0) {
            return <span className="text-gray-400">{analyses.length} tracks queued for analysis.</span>
        }

        return null;
    };

    return (
        <header className="text-center relative">
            <div className="flex items-center justify-center gap-x-3">
                <RobotIcon className="w-10 h-10 text-indigo-400" />
                <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                    Radio Ready AI Analyzer
                </h1>
            </div>
             {projectName && (
                <div className="mt-2 text-sm text-center text-indigo-300 font-medium tracking-wide">
                    {projectName}
                </div>
             )}

            {(analyses.length > 0 || status) && (
                <p className="mt-4 text-lg text-gray-300">{renderStatus()}</p>
            )}

            {onOpenProjects && (
                 <button 
                    onClick={onOpenProjects}
                    className="absolute top-0 right-0 inline-flex items-center justify-center gap-x-2 rounded-md bg-gray-700/50 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-700/80 transition-colors"
                >
                    <FolderOpenIcon className="w-5 h-5" />
                    Projects
                </button>
            )}
        </header>
    );
};