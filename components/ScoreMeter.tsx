
import React from 'react';

interface ScoreMeterProps {
  score: number;
  size?: number;
  strokeWidth?: number;
}

export const ScoreMeter: React.FC<ScoreMeterProps> = ({
  score,
  size = 180,
  strokeWidth = 16,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 10) * circumference;

  const getStrokeColor = (value: number) => {
    if (value >= 8) return 'stroke-teal-400';
    if (value >= 5) return 'stroke-yellow-400';
    return 'stroke-red-500';
  };

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          className="stroke-gray-700"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <circle
          className={`${getStrokeColor(score)} transition-all duration-1000 ease-out`}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-5xl font-bold tracking-tight text-white">{score}</span>
        <span className="text-sm font-medium text-gray-400">/ 10</span>
      </div>
    </div>
  );
};
