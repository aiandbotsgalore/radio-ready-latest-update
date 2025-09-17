import React from 'react';

interface ProgressBarProps {
  progress: number; // 0 to 100
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  return (
    <div className="w-full bg-gray-700 rounded-full h-2.5">
      <div
        className="bg-indigo-500 h-2.5 rounded-full transition-all duration-300 ease-linear"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};
