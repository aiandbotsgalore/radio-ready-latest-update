import React, { useState, useRef, useEffect, useCallback } from 'react';
import { addManual, getAllManuals, deleteManual } from '../lib/db';
import { extractTextFromFile } from '../lib/fileProcessor';
import { TrashIcon } from './icons/TrashIcon';
import { UploadIcon } from './icons/UploadIcon';
import { XCircleIcon } from './icons/XCircleIcon';
import { ProgressBar } from './ProgressBar';

interface PluginManagerProps {
  plugins: string;
  setPlugins: (plugins: string) => void;
  onKnowledgeBaseUpdate: () => void;
}

interface Manual {
    name: string;
    content: string;
}

interface UploadProgress {
    type: 'reading' | 'parsing';
    percentage: number;
    text: string;
}

const LARGE_FILE_THRESHOLD_MB = 25;
const LARGE_FILE_THRESHOLD_BYTES = LARGE_FILE_THRESHOLD_MB * 1024 * 1024;

export const PluginManager: React.FC<PluginManagerProps> = ({ plugins, setPlugins, onKnowledgeBaseUpdate }) => {
    const [manuals, setManuals] = useState<Manual[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null);
    const [processingFile, setProcessingFile] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    
    const inputRef = useRef<HTMLInputElement>(null);
    const abortControllerRef = useRef<AbortController | null>(null);

    const loadManuals = useCallback(async () => {
        try {
            const loadedManuals = await getAllManuals();
            setManuals(loadedManuals);
        } catch (err) {
            console.error("Failed to load manuals:", err);
            setError("Could not load knowledge base from your browser's storage.");
        }
    }, []);

    useEffect(() => {
        loadManuals();
    }, [loadManuals]);
    
    const handleCancelUpload = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        setIsProcessing(false);
        setUploadProgress(null);
        setProcessingFile(null);
        setError("Upload cancelled by user.");
    };
    
    const processFile = async (file: File) => {
        if (file.size > LARGE_FILE_THRESHOLD_BYTES) {
            if (!window.confirm(`The file "${file.name}" is over ${LARGE_FILE_THRESHOLD_MB}MB. Processing may be slow. Continue?`)) {
                return;
            }
        }

        setIsProcessing(true);
        setProcessingFile(file.name);
        setError(null);
        setUploadProgress({ type: 'reading', percentage: 0, text: 'Preparing to read file...' });
        
        abortControllerRef.current = new AbortController();
        const signal = abortControllerRef.current.signal;

        try {
            const content = await extractTextFromFile(file, (update) => {
                const percentage = (update.loaded / update.total) * 100;
                let text = '';
                if (update.type === 'reading') {
                    text = `Reading file... ${Math.round(percentage)}%`;
                } else {
                    text = `Parsing page ${update.loaded} of ${update.total}...`;
                }
                setUploadProgress({ type: update.type, percentage, text });
            }, signal);
            
            await addManual(file.name, content);
            await loadManuals(); // Refresh list
            onKnowledgeBaseUpdate(); // Notify parent
        } catch (err) {
            if ((err as DOMException).name === 'AbortError') {
                console.log("File processing was aborted.");
            } else {
                 const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
                 if (errorMessage.toLowerCase().includes('quota')) {
                    setError("Browser storage limit reached. Please remove some manuals to make space.");
                 } else {
                    setError(errorMessage);
                 }
            }
        } finally {
            setIsProcessing(false);
            setUploadProgress(null);
            setProcessingFile(null);
            abortControllerRef.current = null;
        }
    };

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            processFile(file);
        }
        if(inputRef.current) inputRef.current.value = '';
    };

    const handleDeleteManual = async (name: string) => {
        if (window.confirm(`Are you sure you want to delete the manual for "${name}"?`)) {
            try {
                await deleteManual(name);
                await loadManuals();
                onKnowledgeBaseUpdate();
            } catch (err) {
                setError("Failed to delete the manual.");
            }
        }
    };

    return (
        <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/50 backdrop-blur-sm space-y-4">
            <div>
                <label htmlFor="plugin-list" className="block text-sm font-medium text-gray-200 px-2">Your Plugin List</label>
                <textarea
                    id="plugin-list"
                    value={plugins}
                    onChange={(e) => setPlugins(e.target.value)}
                    rows={6}
                    placeholder="Paste your plugin list here..."
                    className="mt-2 block w-full rounded-md bg-gray-900/70 border-gray-600 text-gray-300 text-xs shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
            </div>
            <div className="space-y-3 pt-3 border-t border-gray-700/50">
                <h3 className="text-md font-semibold text-white px-2">Knowledge Base (Manuals)</h3>
                
                {manuals.length > 0 && (
                    <ul className="space-y-2 max-h-40 overflow-y-auto pr-1">
                        {manuals.map(manual => (
                            <li key={manual.name} className="flex justify-between items-center bg-gray-900/50 p-2 rounded-md">
                                <span className="text-sm text-gray-300 truncate pr-2" title={manual.name}>{manual.name}</span>
                                <button onClick={() => handleDeleteManual(manual.name)} className="text-gray-500 hover:text-red-400 transition-colors">
                                    <TrashIcon className="w-4 h-4" />
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
                
                {isProcessing && uploadProgress && (
                    <div className="p-3 bg-gray-900/50 rounded-lg space-y-2">
                        <div className="flex justify-between items-center">
                            <p className="text-sm text-indigo-300 truncate pr-2" title={processingFile || ''}>
                                {processingFile}
                            </p>
                             <button onClick={handleCancelUpload} className="text-gray-400 hover:text-white transition-colors">
                                <XCircleIcon className="w-6 h-6"/>
                            </button>
                        </div>
                        <ProgressBar progress={uploadProgress.percentage} />
                        <p className="text-xs text-center text-gray-400">{uploadProgress.text}</p>
                    </div>
                )}
                
                {error && (
                    <div className="mt-2 p-3 bg-red-900/30 border border-red-500/50 rounded-md text-center">
                        <p className="text-sm text-red-300">{error}</p>
                    </div>
                )}
                
                <div className="grid grid-cols-1 gap-2">
                    <input ref={inputRef} type="file" accept=".pdf,.txt" className="hidden" onChange={handleFileSelect} />
                    <button
                        onClick={() => !isProcessing && inputRef.current?.click()}
                        disabled={isProcessing}
                        className="inline-flex items-center justify-center gap-x-2 rounded-md bg-indigo-600/80 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500/80 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
                    >
                        <UploadIcon className="w-5 h-5" />
                        Add Manual
                    </button>
                </div>
            </div>
        </div>
    );
};
