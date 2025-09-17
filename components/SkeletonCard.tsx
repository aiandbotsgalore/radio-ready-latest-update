import React from 'react';

interface SkeletonCardProps {
    className?: string;
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({ className }) => {
    return (
        <div className={`bg-gray-800/50 p-6 rounded-lg border border-gray-700/50 ${className}`}>
            <div className="animate-pulse">
                <div className="flex justify-between items-start">
                    <div className="h-4 bg-gray-700/80 rounded w-1/3"></div>
                    <div className="h-6 bg-gray-700/80 rounded-full w-12"></div>
                </div>
                <div className="mt-6 space-y-3">
                    <div className="h-3 bg-gray-700/80 rounded w-full"></div>
                    <div className="h-3 bg-gray-700/80 rounded w-5/6"></div>
                    <div className="h-3 bg-gray-700/80 rounded w-3/4"></div>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-700/50 flex justify-center">
                    <div className="h-8 bg-gray-700/80 rounded-md w-2/5"></div>
                </div>
            </div>
        </div>
    );
};
