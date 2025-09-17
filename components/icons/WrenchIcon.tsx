import React from 'react';

export const WrenchIcon: React.FC<{ className?: string }> = ({ className }) => (
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
            d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17 7.47 11.22a2.652 2.652 0 1 0-3.75 3.75L11.42 15.17Zm0 0L8.622 12.378l3.75-3.75a2.652 2.652 0 0 1 3.75 0l-2.846 2.846m0 0l2.846-2.846" 
        />
    </svg>
);
