import React from 'react';
import { Header } from './Header';
import { ResetIcon } from './icons/ResetIcon';
import { KeyIcon } from './icons/KeyIcon';
import { ClockIcon } from './icons/ClockIcon';
import { ExclamationTriangleIcon } from './icons/ExclamationTriangleIcon';

interface ErrorScreenProps {
    error: string | null;
    onReset: () => void;
}

const categorizeError = (errorMessage: string | null): { title: string; message: string; icon: React.ReactNode } => {
    const lowerCaseError = (errorMessage || '').toLowerCase();

    if (lowerCaseError.includes('api_key') || lowerCaseError.includes('permission denied')) {
        return {
            title: "API Key Issue",
            message: "It seems there's a problem connecting to the AI service. This is often due to an invalid or missing API key. Please ensure it's configured correctly.",
            icon: <KeyIcon className="w-12 h-12 text-yellow-400" />
        };
    }

    if (lowerCaseError.includes('429') || lowerCaseError.includes('resource_exhausted') || lowerCaseError.includes('too many requests')) {
        return {
            title: "Request Limit Reached",
            message: "You've made a number of requests in a short time, and the AI needs a quick break. Please wait for a minute before trying again.",
            icon: <ClockIcon className="w-12 h-12 text-blue-400" />
        };
    }
    
    if (
        lowerCaseError.includes('failed to get analysis') || 
        lowerCaseError.includes('engineer is busy') || 
        lowerCaseError.includes(`couldn't design a mastering chain`)
    ) {
         return {
            title: "AI Processing Error",
            message: "The AI engineer had trouble processing your request. This can sometimes happen with complex audio or high server load. Trying again after a moment often solves the issue.",
            icon: <ExclamationTriangleIcon className="w-12 h-12 text-orange-400" />
        };
    }

    return {
        title: "An Unexpected Error Occurred",
        message: errorMessage || "Something went wrong, but we're not sure what. Please try analyzing your track again. If the problem persists, the file might be unsupported.",
        icon: <ExclamationTriangleIcon className="w-12 h-12 text-red-400" />
    };
};

export const ErrorScreen: React.FC<ErrorScreenProps> = ({ error, onReset }) => {
    const { title, message, icon } = categorizeError(error);

    return (
      <div className="w-full max-w-2xl mx-auto text-center p-8">
        <Header status="error" />
        <div 
            className="mt-8 p-8 bg-gray-800/50 border border-red-500/30 rounded-lg animate-fade-in flex flex-col items-center"
            role="alert"
            aria-live="assertive"
        >
            {icon}
            <h2 className="mt-4 text-2xl font-semibold text-white">{title}</h2>
            <p className="mt-2 text-gray-300 leading-relaxed">{message}</p>
            <button 
                onClick={onReset} 
                className="mt-8 inline-flex items-center gap-x-2 rounded-md bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500"
            >
                <ResetIcon className="w-5 h-5" />
                Analyze Another Track
            </button>
        </div>
      </div>
    );
};
