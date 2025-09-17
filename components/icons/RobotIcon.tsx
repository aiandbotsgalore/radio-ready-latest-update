import React from 'react';

export const RobotIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
        strokeWidth={1.5} 
        stroke="currentColor" 
        className={className}
    >
        <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.03 1.125 0 1.131.094 1.976 1.057 1.976 2.192V7.5M8.25 7.5h7.5M8.25 7.5v3.75c0 1.135.845 2.098 1.976 2.192.373.03.748.03 1.125 0 1.131-.094 1.976-1.057 1.976-2.192V7.5" 
        />
        <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            d="M3 9.75a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Zm0 6a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Z" 
        />
        <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            d="M9.75 6.75h4.5v10.5h-4.5V6.75Z" 
        />
    </svg>
);
