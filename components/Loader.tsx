
import React from 'react';

const messages = [
  "Tuning the frequencies...",
  "Calibrating the compressors...",
  "Analyzing stereo width...",
  "Measuring LUFS levels...",
  "Checking for phase issues...",
  "Polishing the final mix...",
];

export const Loader: React.FC = () => {
    const [message, setMessage] = React.useState(messages[0]);

    React.useEffect(() => {
        const intervalId = setInterval(() => {
            setMessage(prevMessage => {
                const currentIndex = messages.indexOf(prevMessage);
                const nextIndex = (currentIndex + 1) % messages.length;
                return messages[nextIndex];
            });
        }, 2000);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center text-center p-8 space-y-6">
            <div className="relative flex items-center justify-center w-24 h-24">
                <div className="absolute w-full h-full bg-indigo-500 rounded-full animate-ping opacity-75"></div>
                <div className="relative w-16 h-16 bg-indigo-600 rounded-full"></div>
            </div>
            <p className="text-xl font-semibold text-indigo-300 transition-all duration-500">{message}</p>
            <p className="text-gray-400">Our AI engineer is listening closely...</p>
        </div>
    );
};
