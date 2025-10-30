"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  X, 
  ArrowRight, 
  ChevronDown, 
  Users, 
  CheckCircle2,
  Target,
  Star
} from 'lucide-react';

// Icon fallbacks
const Send = ArrowRight;
const Minimize2 = ChevronDown;
const User = Users;
const Clock = Target;

// Types
interface Message {
  id: string;
  type: 'user' | 'bot' | 'system' | 'operator';
  content: string;
  timestamp: Date;
  sender: string;
}

interface ChatSession {
  id: string;
  name: string;
  status: 'active' | 'ended' | 'timeout';
  messages: Message[];
}

interface LiveChatWidgetProps {
  position?: 'bottom-right' | 'bottom-left';
  theme?: 'light' | 'dark';
  primaryColor?: string;
}

const API_BASE = '/api';

export default function LiveChatWidget({ 
  position = 'bottom-right', 
  theme = 'dark',
  primaryColor = '#3b82f6'
}: LiveChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [session, setSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  
  // Form state for initial setup
  const [showForm, setShowForm] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [initialMessage, setInitialMessage] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && !isMinimized && !showForm) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized, showForm]);

  // Update unread count
  useEffect(() => {
    if (!isOpen || isMinimized) {
      const newMessages = messages.filter(msg => 
        msg.type !== 'user' && 
        new Date(msg.timestamp).getTime() > Date.now() - 5000
      );
      setUnreadCount(newMessages.length);
    } else {
      setUnreadCount(0);
    }
  }, [messages, isOpen, isMinimized]);

  // Start chat session
  const startChat = async () => {
    try {
      setIsLoading(true);
      
      const response = await fetch(`${API_BASE}/chat/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name || 'Anonymous',
          email,
          company,
          initialMessage
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSession(data.session);
        setMessages(data.session.messages);
        setShowForm(false);
        
        // Auto-scroll and focus
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
          inputRef.current?.focus();
        }, 100);
      } else {
        console.error('Failed to start chat:', data.error);
      }
    } catch (error) {
      console.error('Error starting chat:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Send message
  const sendMessage = async () => {
    if (!currentMessage.trim() || !session || isLoading) return;

    const messageText = currentMessage.trim();
    setCurrentMessage('');
    setIsLoading(true);
    setIsTyping(true);

    try {
      const response = await fetch(`${API_BASE}/chat/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: session.id,
          content: messageText
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessages(prev => [...prev, ...data.messages]);
      } else {
        console.error('Failed to send message:', data.error);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  // End chat
  const endChat = async () => {
    if (!session) return;

    try {
      await fetch(`${API_BASE}/chat/end`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: session.id,
          rating: rating || undefined,
          feedback: feedback || undefined
        }),
      });

      setSession(null);
      setMessages([]);
      setShowForm(true);
      setShowRating(false);
      setRating(0);
      setFeedback('');
      setName('');
      setEmail('');
      setCompany('');
      setInitialMessage('');
    } catch (error) {
      console.error('Error ending chat:', error);
    }
  };

  // Handle form submission
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startChat();
  };

  // Handle message submission
  const handleMessageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage();
  };

  // Position classes
  const positionClasses = {
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4'
  };

  // Theme classes
  const themeClasses = theme === 'dark' 
    ? 'bg-slate-900 text-white border-slate-700'
    : 'bg-white text-slate-900 border-slate-200';

  return (
    <div className={`fixed ${positionClasses[position]} z-50`}>
      {/* Chat Widget */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className={`w-80 h-96 ${themeClasses} border rounded-lg shadow-2xl mb-4 flex flex-col overflow-hidden`}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700" style={{ backgroundColor: primaryColor }}>
              <div className="flex items-center gap-3 text-white">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold">Live Chat</h3>
                  <p className="text-xs opacity-90">
                    {session ? 'Connected' : 'Get instant help'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-white">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1 hover:bg-white/20 rounded"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    if (session) {
                      setShowRating(true);
                    } else {
                      setIsOpen(false);
                    }
                  }}
                  className="p-1 hover:bg-white/20 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Chat Content */}
                <div className="flex-1 overflow-hidden">
                  {showForm ? (
                    /* Initial Form */
                    <div className="p-4 h-full overflow-y-auto">
                      <div className="text-center mb-4">
                        <h4 className="font-semibold mb-2">Start a conversation</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Get instant help from our team
                        </p>
                      </div>
                      
                      <form onSubmit={handleFormSubmit} className="space-y-3">
                        <input
                          type="text"
                          placeholder="Your name (optional)"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-transparent text-sm"
                        />
                        <input
                          type="email"
                          placeholder="Email (optional)"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-transparent text-sm"
                        />
                        <input
                          type="text"
                          placeholder="Company (optional)"
                          value={company}
                          onChange={(e) => setCompany(e.target.value)}
                          className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-transparent text-sm"
                        />
                        <textarea
                          placeholder="How can we help you today?"
                          value={initialMessage}
                          onChange={(e) => setInitialMessage(e.target.value)}
                          rows={3}
                          className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-transparent text-sm resize-none"
                        />
                        <button
                          type="submit"
                          disabled={isLoading}
                          className="w-full py-2 px-4 text-white rounded-md font-medium disabled:opacity-50"
                          style={{ backgroundColor: primaryColor }}
                        >
                          {isLoading ? 'Starting chat...' : 'Start Chat'}
                        </button>
                      </form>
                    </div>
                  ) : showRating ? (
                    /* Rating Form */
                    <div className="p-4 h-full flex flex-col justify-center">
                      <div className="text-center mb-4">
                        <h4 className="font-semibold mb-2">Rate your experience</h4>
                        <div className="flex justify-center gap-1 mb-4">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              onClick={() => setRating(star)}
                              className={`text-2xl ${rating >= star ? 'text-yellow-400' : 'text-slate-300'}`}
                            >
                              <Star className={`w-6 h-6 ${rating >= star ? 'fill-current' : ''}`} />
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <textarea
                        placeholder="Any feedback? (optional)"
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        rows={3}
                        className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-transparent text-sm resize-none mb-4"
                      />
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => setShowRating(false)}
                          className="flex-1 py-2 px-4 border border-slate-300 dark:border-slate-600 rounded-md text-sm"
                        >
                          Back to Chat
                        </button>
                        <button
                          onClick={endChat}
                          className="flex-1 py-2 px-4 text-white rounded-md text-sm"
                          style={{ backgroundColor: primaryColor }}
                        >
                          End Chat
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Messages */
                    <div className="h-full flex flex-col">
                      <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {messages.map((message) => (
                          <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div
                              className={`max-w-[80%] rounded-lg p-2 ${
                                message.type === 'user'
                                  ? 'bg-blue-500 text-white'
                                  : message.type === 'system'
                                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-center'
                                  : 'bg-slate-100 dark:bg-slate-800'
                              }`}
                            >
                              <p className="text-sm">{message.content}</p>
                              <p className="text-xs opacity-70 mt-1">
                                {new Date(message.timestamp).toLocaleTimeString([], { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                              </p>
                            </div>
                          </div>
                        ))}
                        
                        {isTyping && (
                          <div className="flex justify-start">
                            <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-2">
                              <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        <div ref={messagesEndRef} />
                      </div>

                      {/* Message Input */}
                      <form onSubmit={handleMessageSubmit} className="p-4 border-t border-slate-200 dark:border-slate-700">
                        <div className="flex gap-2">
                          <input
                            ref={inputRef}
                            type="text"
                            value={currentMessage}
                            onChange={(e) => setCurrentMessage(e.target.value)}
                            placeholder="Type your message..."
                            disabled={isLoading}
                            className="flex-1 p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-transparent text-sm"
                          />
                          <button
                            type="submit"
                            disabled={!currentMessage.trim() || isLoading}
                            className="p-2 text-white rounded-md disabled:opacity-50"
                            style={{ backgroundColor: primaryColor }}
                          >
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full text-white shadow-lg flex items-center justify-center relative"
        style={{ backgroundColor: primaryColor }}
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <>
            <MessageCircle className="w-6 h-6" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </>
        )}
      </motion.button>
    </div>
  );
}
