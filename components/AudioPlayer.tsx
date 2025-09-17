import React, { useState, useRef, useCallback } from 'react';
import type { useAudioProcessor } from '../hooks/useAudioProcessor';
import { UploadIcon } from './icons/UploadIcon';
import { MusicIcon } from './icons/MusicIcon';

const PlayIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.647c1.295.742 1.295 2.545 0 3.286L7.279 20.99c-1.25.717-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
    </svg>
);

const PauseIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 00-.75.75v12a.75.75 0 00.75.75h3a.75.75 0 00.75-.75v-12a.75.75 0 00-.75-.75h-3zm7.5 0a.75.75 0 00-.75.75v12a.75.75 0 00.75.75h3a.75.75 0 00.75-.75v-12a.75.75 0 00-.75-.75h-3z" clipRule="evenodd" />
    </svg>
);

const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

interface AudioPlayerProps {
    audioProcessor: ReturnType<typeof useAudioProcessor>;
    onFilesSelect?: (files: File[]) => void;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioProcessor, onFilesSelect }) => {
    const { isLoaded, isPlaying, duration, currentTime, togglePlayPause, seek } = audioProcessor;
    const [isDragging, setIsDragging] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const progressBarRef = useRef<HTMLDivElement>(null);

    const handleFilesSelected = (files: File[]) => {
        if (files.length > 0 && onFilesSelect) {
            onFilesSelect(files);
        }
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') setIsDragging(true);
        else if (e.type === 'dragleave') setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        const files = Array.from(e.dataTransfer.files);
        handleFilesSelected(files);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        handleFilesSelected(files);
    };
    
    const handleScrub = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (!progressBarRef.current) return;
        const rect = progressBarRef.current.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const width = rect.width;
        const percentage = Math.max(0, Math.min(1, offsetX / width));
        seek(percentage * duration);
    }, [duration, seek]);

    const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        handleScrub(e);
        const onMouseMove = (moveEvent: MouseEvent) => {
             handleScrub(moveEvent as unknown as React.MouseEvent<HTMLDivElement>);
        };
        const onMouseUp = () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    }, [handleScrub]);

    if (!isLoaded) {
        return (
            <div onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop} onClick={() => inputRef.current?.click()}
              className={`w-full p-10 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300 ${isDragging ? 'border-indigo-400 bg-indigo-500/10' : 'border-gray-600 hover:border-gray-500 hover:bg-gray-800/50'}`}
            >
              <input ref={inputRef} type="file" accept="audio/*" className="hidden" onChange={handleChange} multiple />
              <div className="flex flex-col items-center justify-center space-y-4 text-gray-400">
                  <UploadIcon className="w-12 h-12" />
                  <p className="text-lg font-semibold"><span className="text-indigo-400">Click to upload</span> or drag and drop your tracks</p>
                  <p className="text-sm">MP3, WAV, FLAC, etc. You can select multiple files.</p>
              </div>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-4 w-full">
            <button
                onClick={togglePlayPause}
                className="p-2 bg-indigo-600 rounded-full text-white hover:bg-indigo-500 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
                aria-label={isPlaying ? 'Pause' : 'Play'}
            >
                {isPlaying ? <PauseIcon className="w-6 h-6" /> : <PlayIcon className="w-6 h-6" />}
            </button>
            <div className="flex-1 flex items-center gap-3">
                <span className="text-sm font-mono text-gray-400">{formatTime(currentTime)}</span>
                <div 
                    ref={progressBarRef}
                    onMouseDown={handleMouseDown}
                    className="w-full h-2 bg-gray-700 rounded-full cursor-pointer group"
                >
                    <div 
                        className="h-full bg-indigo-500 rounded-full relative" 
                        style={{ width: `${(currentTime / duration) * 100}%` }}
                    >
                         <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-indigo-300 rounded-full transform scale-0 group-hover:scale-100 transition-transform duration-200"></div>
                    </div>
                </div>
                <span className="text-sm font-mono text-gray-400">{formatTime(duration)}</span>
            </div>
        </div>
    );
};