import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { useProject } from '../hooks/useProject';
import type { NamedProject } from '../types';
import { getAllNamedProjects, deleteNamedProject } from '../lib/db';
import { XCircleIcon } from './icons/XCircleIcon';
import { TrashIcon } from './icons/TrashIcon';
import { SaveIcon } from './icons/SaveIcon';
import { ArrowDownTrayIcon } from './icons/ArrowDownTrayIcon';
import { UploadIcon } from './icons/UploadIcon';
import { SpinnerIcon } from './icons/SpinnerIcon';


interface ProjectsModalProps {
    isOpen: boolean;
    onClose: () => void;
    projectHook: ReturnType<typeof useProject>;
}

export const ProjectsModal: React.FC<ProjectsModalProps> = ({ isOpen, onClose, projectHook }) => {
    const [projects, setProjects] = useState<NamedProject[]>([]);
    const [projectName, setProjectName] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [notification, setNotification] = useState<string | null>(null);
    const importInputRef = useRef<HTMLInputElement>(null);
    
    const { 
        handleSaveProject, 
        handleLoadProject,
        handleExportProject,
        handleImportProject,
        currentProjectName 
    } = projectHook;

    const showNotification = (message: string) => {
        setNotification(message);
        setTimeout(() => setNotification(null), 3000);
    };

    const fetchProjects = useCallback(async () => {
        setIsLoading(true);
        try {
            const allProjects = await getAllNamedProjects();
            setProjects(allProjects);
        } catch (err) {
            setError("Could not load projects from the database.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (isOpen) {
            fetchProjects();
            setProjectName(currentProjectName === 'Unsaved Session' ? '' : currentProjectName);
        }
    }, [isOpen, fetchProjects, currentProjectName]);

    const onSave = async () => {
        if (!projectName.trim()) {
            setError("Please enter a project name.");
            return;
        }
        setError(null);
        try {
            await handleSaveProject(projectName.trim());
            showNotification(`Project "${projectName.trim()}" saved successfully.`);
            fetchProjects(); // Refresh the list
        } catch (err) {
            setError("Failed to save project.");
        }
    };
    
    const onLoad = async (id: string) => {
        try {
            await handleLoadProject(id);
            onClose();
        } catch (err) {
             setError("Failed to load the selected project.");
        }
    };
    
    const onDelete = async (id: string, name: string) => {
        if (window.confirm(`Are you sure you want to delete the project "${name}"? This cannot be undone.`)) {
            try {
                await deleteNamedProject(id);
                showNotification(`Project "${name}" deleted.`);
                fetchProjects();
            } catch (err) {
                setError("Failed to delete project.");
            }
        }
    };
    
    const onImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            try {
                await handleImportProject(file);
                showNotification(`Project "${file.name}" imported successfully. Save it to keep it.`);
                onClose();
            } catch (err) {
                setError(err instanceof Error ? err.message : "Import failed.");
            }
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/80 backdrop-blur-sm animate-fade-in" aria-modal="true" role="dialog">
            <div className="relative bg-gray-800 border border-gray-700/50 rounded-lg shadow-xl w-full max-w-2xl m-4">
                <div className="flex items-start justify-between p-4 border-b border-gray-700">
                    <h2 className="text-xl font-semibold text-white">Manage Projects</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors" aria-label="Close modal">
                        <XCircleIcon className="w-7 h-7" />
                    </button>
                </div>
                
                <div className="p-6 space-y-6">
                    {/* Actions Section */}
                    <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700/50 space-y-4">
                        <div className="flex flex-col sm:flex-row items-center gap-3">
                            <input
                                type="text"
                                value={projectName}
                                onChange={(e) => setProjectName(e.target.value)}
                                placeholder="Enter project name..."
                                className="block w-full rounded-md bg-gray-800 border-gray-600 text-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                             <button onClick={onSave} className="w-full sm:w-auto inline-flex items-center justify-center gap-x-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors flex-shrink-0">
                                <SaveIcon className="w-5 h-5"/>
                                Save Session
                            </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-gray-700/50">
                            <input type="file" ref={importInputRef} accept=".json" className="hidden" onChange={onImport} />
                            <button onClick={() => importInputRef.current?.click()} className="inline-flex items-center justify-center gap-x-2 rounded-md bg-gray-600/50 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-600/80 transition-colors">
                                <UploadIcon className="w-5 h-5" /> Import from File...
                            </button>
                             <button onClick={handleExportProject} className="inline-flex items-center justify-center gap-x-2 rounded-md bg-gray-600/50 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-600/80 transition-colors">
                                <ArrowDownTrayIcon className="w-5 h-5" /> Export Session...
                            </button>
                        </div>
                    </div>

                    {/* Project List */}
                    <div className="space-y-2">
                         <h3 className="text-md font-semibold text-gray-200 px-1">Saved Projects</h3>
                        <div className="max-h-60 overflow-y-auto pr-2 bg-gray-900/30 rounded-lg border border-gray-700/50">
                           {isLoading ? (
                                <div className="flex items-center justify-center p-8 text-gray-400">
                                    <SpinnerIcon className="w-6 h-6 mr-2" /> Loading...
                                </div>
                           ) : projects.length === 0 ? (
                               <div className="text-center p-8 text-sm text-gray-500">No saved projects found.</div>
                           ) : (
                               <ul className="divide-y divide-gray-700/50">
                                   {projects.map(p => (
                                       <li key={p.id} className="p-3 flex justify-between items-center">
                                           <div>
                                                <p className="font-medium text-gray-200">{p.name}</p>
                                                <p className="text-xs text-gray-400">
                                                    Saved: {new Date(p.timestamp).toLocaleString()}
                                                </p>
                                           </div>
                                           <div className="flex items-center gap-x-3">
                                               <button onClick={() => onLoad(p.id)} className="text-indigo-400 hover:text-indigo-300 font-semibold text-sm transition-colors">Load</button>
                                               <button onClick={() => onDelete(p.id, p.name)} className="text-gray-500 hover:text-red-400 transition-colors" aria-label={`Delete ${p.name}`}>
                                                   <TrashIcon className="w-5 h-5"/>
                                               </button>
                                           </div>
                                       </li>
                                   ))}
                               </ul>
                           )}
                        </div>
                    </div>
                </div>

                {(error || notification) && (
                    <div className="p-3 border-t border-gray-700">
                        {error && <p className="text-sm text-red-400 text-center">{error}</p>}
                        {notification && <p className="text-sm text-teal-300 text-center animate-fade-in">{notification}</p>}
                    </div>
                )}
            </div>
        </div>
    );
};