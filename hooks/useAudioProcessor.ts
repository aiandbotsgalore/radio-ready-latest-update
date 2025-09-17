import { useState, useRef, useCallback, useEffect } from 'react';

export const useAudioProcessor = () => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);

    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserNodeRef = useRef<AnalyserNode | null>(null);
    const audioSourceRef = useRef<MediaElementAudioSourceNode | null>(null);
    const audioElementRef = useRef<HTMLAudioElement | null>(null);

    // FIX: Moved the cleanup function definition before its usage to prevent a "used before declaration" error.
    const cleanup = useCallback(() => {
        audioElementRef.current?.pause();
        audioSourceRef.current?.disconnect();
        analyserNodeRef.current?.disconnect();
        audioContextRef.current?.close().catch(() => {}); // Suppress harmless promise rejection on rapid cleanup

        setIsLoaded(false);
        setIsPlaying(false);
        setDuration(0);
        setCurrentTime(0);

        audioContextRef.current = null;
        analyserNodeRef.current = null;
        audioSourceRef.current = null;
        if (audioElementRef.current && audioElementRef.current.src.startsWith('blob:')) {
             URL.revokeObjectURL(audioElementRef.current.src);
             audioElementRef.current = null;
        }
    }, []);

    const setupAudioGraph = useCallback((audioElement: HTMLAudioElement) => {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        audioContextRef.current = audioContext;

        const analyserNode = audioContext.createAnalyser();
        analyserNode.fftSize = 2048;
        analyserNodeRef.current = analyserNode;

        const source = audioContext.createMediaElementSource(audioElement);
        audioSourceRef.current = source;
        
        source.connect(analyserNode);
        analyserNode.connect(audioContext.destination);
    }, []);

    const loadAudioFromFile = useCallback(async (file: File) => {
        cleanup(); // Clean up previous audio
        
        const audioElement = new Audio();
        audioElement.src = URL.createObjectURL(file);
        audioElementRef.current = audioElement;

        setupAudioGraph(audioElement);

        return new Promise<void>((resolve) => {
             audioElement.addEventListener('loadedmetadata', () => {
                setDuration(audioElement.duration);
                setIsLoaded(true);
                resolve();
            });
        });
    }, [cleanup, setupAudioGraph]);

    const loadAudioFromBuffer = useCallback(async (audioData: { buffer: ArrayBuffer, type: string }) => {
        cleanup();
        
        const blob = new Blob([audioData.buffer], { type: audioData.type });
        const url = URL.createObjectURL(blob);

        const audioElement = new Audio();
        audioElement.src = url;
        audioElementRef.current = audioElement;

        setupAudioGraph(audioElement);

        return new Promise<void>((resolve) => {
             audioElement.addEventListener('loadedmetadata', () => {
                setDuration(audioElement.duration);
                setIsLoaded(true);
                resolve();
            });
        });

    }, [cleanup, setupAudioGraph]);


    const togglePlayPause = useCallback(() => {
        const { current: audioContext } = audioContextRef;
        const { current: audioElement } = audioElementRef;

        if (!audioContext || !audioElement) return;

        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }

        if (isPlaying) {
            audioElement.pause();
        } else {
            audioElement.play();
        }
        setIsPlaying(!isPlaying);
    }, [isPlaying]);

    const seek = useCallback((time: number) => {
        if (audioElementRef.current) {
            audioElementRef.current.currentTime = time;
            setCurrentTime(time);
        }
    }, []);


    useEffect(() => {
        const audioElement = audioElementRef.current;
        if (!audioElement) return;

        const handleTimeUpdate = () => setCurrentTime(audioElement.currentTime);
        const handleEnded = () => {
             setIsPlaying(false);
             setCurrentTime(0); // Reset to start on end
        }

        audioElement.addEventListener('timeupdate', handleTimeUpdate);
        audioElement.addEventListener('ended', handleEnded);

        return () => {
            audioElement.removeEventListener('timeupdate', handleTimeUpdate);
            audioElement.removeEventListener('ended', handleEnded);
        };
    }, [isLoaded]);

    return {
        isLoaded,
        isPlaying,
        duration,
        currentTime,
        analyserNode: analyserNodeRef.current,
        loadAudio: loadAudioFromFile,
        loadAudioFromBuffer,
        togglePlayPause,
        seek,
        cleanup,
    };
};