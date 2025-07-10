"use client";
import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, Minimize2, Trash2 } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatSession {
  id: string;
  messages: Message[];
  createdAt: Date;
  lastUpdated: Date;
}

interface AIChatbotProps {
  apiKey: string;
  endpoint: string;
}

const AIChatbot: React.FC<AIChatbotProps> = ({ apiKey, endpoint }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! I\'m your AI assistant. How can I help you today?',
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const STORAGE_KEY = 'ai_chatbot_sessions';
  const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

  // Generate a unique session ID
  const generateSessionId = () => {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  // Load chat sessions from localStorage
  const loadSessions = (): ChatSession[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];
      
      const sessions = JSON.parse(stored) as ChatSession[];
      // Convert timestamp strings back to Date objects
      return sessions.map(session => ({
        ...session,
        createdAt: new Date(session.createdAt),
        lastUpdated: new Date(session.lastUpdated),
        messages: session.messages.map(msg => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }))
      }));
    } catch (error) {
      console.error('Error loading sessions:', error);
      return [];
    }
  };

  // Save chat sessions to localStorage
  const saveSessions = (sessions: ChatSession[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    } catch (error) {
      console.error('Error saving sessions:', error);
    }
  };

  // Clean up expired sessions (older than 24 hours)
  const cleanupExpiredSessions = () => {
    const sessions = loadSessions();
    const now = new Date();
    const validSessions = sessions.filter(session => {
      const timeDiff = now.getTime() - session.lastUpdated.getTime();
      return timeDiff < SESSION_DURATION;
    });
    
    if (validSessions.length !== sessions.length) {
      saveSessions(validSessions);
      console.log(`Cleaned up ${sessions.length - validSessions.length} expired sessions`);
    }
  };

  // Save current session
  const saveCurrentSession = () => {
    if (!currentSessionId || messages.length <= 1) return; // Don't save if only initial message
    
    const sessions = loadSessions();
    const now = new Date();
    
    const existingSessionIndex = sessions.findIndex(s => s.id === currentSessionId);
    const sessionData: ChatSession = {
      id: currentSessionId,
      messages: messages,
      createdAt: existingSessionIndex >= 0 ? sessions[existingSessionIndex].createdAt : now,
      lastUpdated: now
    };

    if (existingSessionIndex >= 0) {
      sessions[existingSessionIndex] = sessionData;
    } else {
      sessions.push(sessionData);
    }

    saveSessions(sessions);
  };

  // Load the most recent session or create a new one
  const loadMostRecentSession = () => {
    cleanupExpiredSessions();
    const sessions = loadSessions();
    
    if (sessions.length > 0) {
      // Sort by lastUpdated and get the most recent
      const mostRecent = sessions.sort((a, b) => 
        b.lastUpdated.getTime() - a.lastUpdated.getTime()
      )[0];
      
      setCurrentSessionId(mostRecent.id);
      setMessages(mostRecent.messages);
    } else {
      // Create new session
      const newSessionId = generateSessionId();
      setCurrentSessionId(newSessionId);
      setMessages([
        {
          id: '1',
          content: 'Hello! I\'m your AI assistant. How can I help you today?',
          isUser: false,
          timestamp: new Date(),
        },
      ]);
    }
  };

  // Clear current session and start new one
  const startNewSession = () => {
    const newSessionId = generateSessionId();
    setCurrentSessionId(newSessionId);
    setMessages([
      {
        id: '1',
        content: 'Hello! I\'m your AI assistant. How can I help you today?',
        isUser: false,
        timestamp: new Date(),
      },
    ]);
  };

  // Initialize session on component mount
  useEffect(() => {
    loadMostRecentSession();
  }, []);

  // Save session whenever messages change
  useEffect(() => {
    if (currentSessionId && messages.length > 1) {
      saveCurrentSession();
    }
  }, [messages, currentSessionId]);

  // Clean up expired sessions periodically
  useEffect(() => {
    const interval = setInterval(cleanupExpiredSessions, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Azure AI Foundry API call
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': apiKey,
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: 'You are a helpful AI assistant. Be concise and friendly.',
            },
            {
              role: 'user',
              content: inputMessage,
            },
          ],
          max_tokens: 500,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('API Error:', response.status, errorData);
        throw new Error(`API Error: ${response.status} - ${errorData}`);
      }

      const data = await response.json();
      const aiResponse = data.choices?.[0]?.message?.content || 'Sorry, I couldn\'t process that request.';

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I\'m having trouble connecting right now. Please try again later.',
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating AI Icon */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-[9999] bg-blue-600 hover:bg-blue-700 text-white p-6 rounded-full shadow-lg transition-all duration-200 hover:scale-110 flex items-center justify-center min-w-[64px] min-h-[64px] cursor-pointer"
          style={{ pointerEvents: 'auto' }}
        >
          <Bot size={28} />
        </button>
      )}

      {/* Chat Modal */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-[9999] bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-96 h-[500px] flex flex-col border border-gray-200 dark:border-gray-700">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-blue-600 text-white rounded-t-lg">
            <div className="flex items-center gap-2">
              <Bot size={20} />
              <span className="font-semibold">xAIzen</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={startNewSession}
                className="hover:bg-blue-700 p-1 rounded"
                title="Start new conversation"
              >
                <Trash2 size={16} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-blue-700 p-1 rounded"
              >
                <Minimize2 size={16} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-blue-700 p-1 rounded"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.isUser
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-bl-none'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <span className="text-xs opacity-70 mt-1 block">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg rounded-bl-none">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            {/* Status Text */}
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-3 text-center">
              Chat saved for 24 hours • Session: {currentSessionId.split('_')[1]}
            </div>
            <div className="flex gap-2">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                rows={1}
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white p-2 rounded-lg transition-colors"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AIChatbot;