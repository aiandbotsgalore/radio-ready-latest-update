import React from 'react';

export const ChatBubbleLeftRightIcon: React.FC<{ className?: string }> = ({ className }) => (
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
            d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193l-3.72.372a11.25 11.25 0 0 1-5.58 0l-3.72-.372A2.25 2.25 0 0 1 3.75 14.894V10.608c0-.97.616-1.813 1.5-2.097m16.5 0-2.25-2.25m0 0-2.25 2.25m2.25-2.25v9l-2.25-2.25M3.75 8.511l2.25-2.25m0 0 2.25 2.25M6 6.261V15.25l2.25-2.25" 
        />
    </svg>
);
