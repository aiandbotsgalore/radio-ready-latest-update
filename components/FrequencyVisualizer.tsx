import React, { useRef, useEffect } from 'react';

interface FrequencyVisualizerProps {
  analyserNode: AnalyserNode | null;
  feedbackOverlay?: {
    startHz: number;
    endHz: number;
    label: string;
  } | null;
}

export const FrequencyVisualizer: React.FC<FrequencyVisualizerProps> = ({ analyserNode, feedbackOverlay }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const smoothedDataArrayRef = useRef<Float32Array | null>(null);

  useEffect(() => {
    if (!analyserNode || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (!context) return;
    
    const bufferLength = analyserNode.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    if (!smoothedDataArrayRef.current || smoothedDataArrayRef.current.length !== bufferLength) {
        smoothedDataArrayRef.current = new Float32Array(bufferLength).fill(0);
    }

    const sampleRate = analyserNode.context.sampleRate;
    const smoothingFactor = 0.1; // Lower value = smoother animation

    let animationFrameId: number;

    const draw = () => {
      animationFrameId = requestAnimationFrame(draw);
      
      analyserNode.getByteFrequencyData(dataArray);
      
      const { width, height } = canvas.getBoundingClientRect();
      if(canvas.width !== width || canvas.height !== height){
          canvas.width = width;
          canvas.height = height;
      }

      context.clearRect(0, 0, width, height);

      const gradient = context.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, '#6366f1'); // Indigo-500
      gradient.addColorStop(0.5, '#818cf8'); // Indigo-400
      gradient.addColorStop(1, '#a5b4fc'); // Indigo-300
      context.fillStyle = gradient;

      const minLogFreq = Math.log10(20);
      const maxLogFreq = Math.log10(sampleRate / 2);
      const logRange = maxLogFreq - minLogFreq;
      
      const barWidth = (width / (bufferLength * 0.7));

      for (let i = 0; i < bufferLength; i++) {
        const targetValue = dataArray[i];
        const lastValue = smoothedDataArrayRef.current![i];
        const smoothedValue = lastValue + (targetValue - lastValue) * smoothingFactor;
        smoothedDataArrayRef.current![i] = smoothedValue;

        const freq = (i * sampleRate) / (bufferLength * 2);
        if (freq < 20) continue;

        const logFreq = Math.log10(freq);
        const x = ((logFreq - minLogFreq) / logRange) * width;
        
        const barHeight = (smoothedValue / 255) * height;
        context.fillRect(x, height - barHeight, barWidth, barHeight);
      }

      if (feedbackOverlay) {
          const { startHz, endHz, label } = feedbackOverlay;
          const startX = ((Math.log10(startHz) - minLogFreq) / logRange) * width;
          const endX = ((Math.log10(endHz) - minLogFreq) / logRange) * width;

          context.fillStyle = 'rgba(239, 68, 68, 0.2)'; // red-500 with alpha
          context.fillRect(startX, 0, endX - startX, height);

          context.fillStyle = 'rgba(252, 165, 165, 0.9)'; // red-300
          context.font = '12px sans-serif';
          context.textAlign = 'center';
          context.fillText(label, startX + (endX - startX) / 2, 20);
      }
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [analyserNode, feedbackOverlay]);

  return <canvas ref={canvasRef} className="w-full h-full" />;
};
