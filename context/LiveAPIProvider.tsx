import React, { createContext, useContext, useState, useMemo, useCallback, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import type { Chat } from "@google/genai";
import type { Message, AnalysisReport } from '../types';

interface LiveAPIContextType {
  isConnected: boolean; // Represents if the chat session has been initialized
  messages: Message[];
  sendMessage: (message: string) => void;
  clearMessages: () => void;
  startChatSession: (report: AnalysisReport) => void;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  isStreaming: boolean;
}

const LiveAPIContext = createContext<LiveAPIContextType | null>(null);

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const LiveAPIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const chatRef = useRef<Chat | null>(null);

  const startChatSession = useCallback((report: AnalysisReport) => {
    const systemInstruction = `You are an expert audio mastering engineer. You have just provided the user with the following analysis report for their audio track. Now, you will answer their follow-up questions. Be helpful, concise, and professional.

    ANALYSIS SUMMARY:
    - Overall Score: ${report.overallScore}/10
    - Overall Feedback: ${report.overallFeedback}
    - Determined Genre: ${report.determinedGenre}
    - Determined Mood: ${report.determinedMood}
    
    DETAILED METRICS:
    - Dynamic Range (${report.dynamicRange.score}/10): ${report.dynamicRange.feedback}
    - Frequency Balance (${report.frequencyBalance.score}/10): ${report.frequencyBalance.feedback}
    - Stereo Image (${report.stereoImage.score}/10): ${report.stereoImage.feedback}
    - Clarity & Definition (${report.clarityAndDefinition.score}/10): ${report.clarityAndDefinition.feedback}
    - Genre Fitness (${report.genreFitness.score}/10): ${report.genreFitness.feedback}
    - Mood Congruence (${report.moodCongruence.score}/10): ${report.moodCongruence.feedback}

    The user's toolkit is Adobe Audition v25 with a specific list of UAD plugins. When making suggestions, refer to this toolkit if relevant.
    `;

    chatRef.current = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: systemInstruction,
        },
    });
    setIsConnected(true);
    console.log("AI chat session started with track context.");
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
    chatRef.current = null;
    setIsConnected(false);
  }, []);

  const sendMessage = useCallback(async (message: string) => {
    if (!isConnected || !chatRef.current) {
      console.error('[LiveAPIProvider] Cannot send message, chat not initialized.');
      setMessages((prev) => [...prev, {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: "Sorry, I'm having trouble connecting. Please try analyzing the track again.",
        timestamp: Date.now(),
      }]);
      return;
    }
    
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: message,
      timestamp: Date.now(),
    };

    const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: '',
        timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage, assistantMessage]);
    setIsStreaming(true);

    try {
      const stream = await chatRef.current.sendMessageStream({ message });
      
      for await (const chunk of stream) {
        setMessages(prev => prev.map(msg => 
            msg.id === assistantMessage.id 
            ? { ...msg, content: msg.content + chunk.text }
            : msg
        ));
      }

    } catch (error) {
      console.error("Error sending message to Gemini:", error);
      setMessages(prev => prev.map(msg => 
        msg.id === assistantMessage.id 
        ? { ...msg, content: "I encountered an error. Please try asking again." }
        : msg
      ));
    } finally {
        setIsStreaming(false);
    }

  }, [isConnected]);

  const value = useMemo(() => ({ isConnected, messages, sendMessage, clearMessages, startChatSession, setMessages, isStreaming }), [isConnected, messages, sendMessage, clearMessages, startChatSession, isStreaming]);

  return (
    <LiveAPIContext.Provider value={value}>
      {children}
    </LiveAPIContext.Provider>
  );
};

export const useLiveAPI = () => {
  const context = useContext(LiveAPIContext);
  if (!context) {
    throw new Error('useLiveAPI must be used within a LiveAPIProvider');
  }
  return context;
};