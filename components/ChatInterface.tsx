import React, { useState, useRef, useEffect } from 'react';
import { useLiveAPI } from '../context/LiveAPIProvider';
import { SendIcon } from './icons/SendIcon';
import type { Message } from '../types';

interface ChatInterfaceProps {
    suggestedQuestions: string[];
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ suggestedQuestions }) => {
  const { messages, isConnected, sendMessage, isStreaming } = useLiveAPI();
  const [currentMessage, setCurrentMessage] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentMessage.trim() || !isConnected || isStreaming) return;
    sendMessage(currentMessage);
    setCurrentMessage('');
  };

  const handleSuggestionClick = (question: string) => {
    if (!isConnected || isStreaming) return;
    sendMessage(question);
  };

  const renderMessageContent = (msg: Message, index: number) => {
      const isLastMessage = index === messages.length - 1;
      const isStreamingAssistantMessage = isLastMessage && msg.role === 'assistant' && isStreaming;

      if (isStreamingAssistantMessage) {
        if (msg.content === '') {
            // "Thinking" state before the first chunk arrives
            return <span className="animate-pulse">...</span>;
        }
        // "Typing" state while chunks are streaming in
        return (
            <>
              {msg.content}
              <span className="inline-block w-0.5 h-4 bg-gray-300 animate-pulse ml-1 align-bottom"></span>
            </>
        );
      }
      // Default state for all other messages
      return msg.content;
  };

  return (
    <div className="bg-gray-900/50 rounded-lg">
      <h3 className="text-xl font-semibold mb-4 text-white text-center">Ask the AI Engineer</h3>
      <div className="h-96 overflow-y-auto pr-4 space-y-6 flex flex-col" aria-live="polite">
        {messages.map((msg, index) => (
            <div key={msg.id} className={`flex items-end gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-max max-w-lg p-3 rounded-2xl ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-gray-700 text-gray-200 rounded-bl-none'}`}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {renderMessageContent(msg, index)}
                </p>
              </div>
            </div>
          )
        )}
       
        {!isConnected && messages.length > 0 && (
            <div className="flex items-end gap-3 flex-row">
              <div className="w-max max-w-lg p-3 rounded-2xl bg-red-900/50 text-red-300 rounded-bl-none">
                <p className="text-sm">Connection lost. Please wait or restart analysis.</p>
              </div>
            </div>
        )}
        <div ref={chatEndRef} />
      </div>
      
       <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
         {messages.length === 0 && suggestedQuestions.map((q) => (
             <button
                 key={q}
                 onClick={() => handleSuggestionClick(q)}
                 disabled={!isConnected || isStreaming}
                 className="px-3 py-1 text-xs font-medium rounded-full bg-gray-700 hover:bg-gray-600 text-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
             >
                 {q}
             </button>
         ))}
       </div>

       <form onSubmit={handleSendMessage} className="mt-6 flex items-center gap-x-2">
            <input
                type="text"
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                placeholder={isStreaming ? "AI is thinking..." : "Ask a follow-up question..."}
                className="block w-full rounded-md bg-gray-900/70 border-gray-600 text-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:bg-gray-800/50 disabled:cursor-wait"
                aria-label="Your message"
                disabled={isStreaming}
            />
            <button
                type="submit"
                className="inline-flex items-center justify-center rounded-full h-10 w-10 bg-indigo-600 text-white shadow-sm hover:bg-indigo-500 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 disabled:bg-gray-600 disabled:cursor-not-allowed"
                aria-label="Send message"
                disabled={!currentMessage.trim() || isStreaming}
            >
                <SendIcon className="h-5 w-5" />
            </button>
        </form>
    </div>
  );
};
