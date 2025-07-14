import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, X, Brain, Send, Folder, Globe, ChevronDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface Message {
  role: 'ai' | 'user';
  text: string;
  timestamp: Date;
}

interface ChatSession {
  user: string;
  language: string;
  mood: string;
  messages: Message[];
  timestamp: string;
  id: string;
}

interface SageAIProps {
  className?: string;
}

export default function SageAI({ className }: SageAIProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [language, setLanguage] = useState('English');
  const [showChatHistory, setShowChatHistory] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatSession[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const languages = [
    'English', 'Hindi', 'Hinglish', 'French', 'Spanish', 
    'Marathi', 'Tamil', 'Bengali', 'Arabic'
  ];

  const userName = 'Ayush'; // TODO: Get from auth system

  const handleDragEnd = (event: any, info: any) => {
    setPosition({ x: info.point.x, y: info.point.y });
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Add welcome message when first opened
      const welcomeMessage: Message = {
        role: 'ai',
        text: `Hello ${userName}, I am your personal emotional financial advisor.`,
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
      startNewSession();
    }
  }, [isOpen, userName]);

  useEffect(() => {
    // Load chat history on mount
    loadChatHistory();
  }, []);

  const startNewSession = () => {
    const sessionId = `chat_${Date.now()}`;
    setCurrentSessionId(sessionId);
  };

  const loadChatHistory = async () => {
    try {
      const response = await fetch('/api/sage/chat-history');
      if (response.ok) {
        const history = await response.json();
        setChatHistory(history);
      }
    } catch (error) {
      console.error('Failed to load chat history:', error);
    }
  };

  const saveChatSession = async () => {
    if (messages.length <= 1) return; // Don't save if only welcome message

    const session: ChatSession = {
      user: userName,
      language,
      mood: 'Friendly',
      messages,
      timestamp: new Date().toISOString(),
      id: currentSessionId
    };

    try {
      await fetch('/api/sage/save-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(session),
      });
      loadChatHistory(); // Refresh history
    } catch (error) {
      console.error('Failed to save chat:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!currentInput.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      text: currentInput.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/sage/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userInput: userMessage.text,
          language,
          emotionalState: 'Friendly',
          financialContext: {},
          recentDecisions: []
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const aiMessage: Message = {
          role: 'ai',
          text: data.message,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiMessage]);
        
        // Auto-save session after each exchange
        setTimeout(() => saveChatSession(), 500);
      }
    } catch (error) {
      console.error('Failed to get AI response:', error);
      const errorMessage: Message = {
        role: 'ai',
        text: 'I apologize, but I cannot respond right now. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const loadChatSession = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/sage/load-chat/${sessionId}`);
      if (response.ok) {
        const session: ChatSession = await response.json();
        setMessages(session.messages.map(msg => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        })));
        setLanguage(session.language);
        setCurrentSessionId(sessionId);
        setShowChatHistory(false);
      }
    } catch (error) {
      console.error('Failed to load chat session:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentInput(e.target.value);
    
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      const maxHeight = 80; // 2 lines max
      textareaRef.current.style.height = Math.min(scrollHeight, maxHeight) + 'px';
    }
  };

  const formatChatPreview = (session: ChatSession) => {
    const firstUserMessage = session.messages.find(msg => msg.role === 'user');
    const preview = firstUserMessage?.text || 'New conversation';
    return preview.length > 30 ? preview.substring(0, 30) + '...' : preview;
  };

  return (
    <>
      {/* Draggable Sage Icon */}
      <motion.div
        drag
        dragMomentum={false}
        onDragEnd={handleDragEnd}
        initial={{ bottom: 20, right: 20 }}
        style={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          width: 64,
          height: 64,
          borderRadius: '50%',
          background: '#e1eaff',
          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          cursor: 'grab',
          padding: '10px'
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={className}
      >
        <Brain className="w-6 h-6" style={{ color: '#3a4d8f' }} />
      </motion.div>

      {/* Sage Chat Interface */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          style={{
            position: 'fixed',
            bottom: 100,
            right: 20,
            zIndex: 1001,
            width: 380,
            maxWidth: '90vw',
            height: 500,
            maxHeight: '80vh'
          }}
        >
          <Card style={{ 
            background: '#1f2433', 
            borderRadius: '16px',
            padding: '16px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
          }} className="border-slate-700 h-full flex flex-col">
            <CardHeader className="pb-3 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: '#e1eaff' }}>
                    <Brain className="w-4 h-4" style={{ color: '#3a4d8f' }} />
                  </div>
                  <CardTitle className="text-lg font-semibold text-white">
                    Sage AI
                  </CardTitle>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowChatHistory(!showChatHistory)}
                    className="h-8 px-2 text-white hover:text-gray-200"
                  >
                    <Folder className="w-4 h-4 mr-1" />
                    <span className="text-xs">History</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    className="h-8 w-8 p-0 text-white hover:text-gray-200"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              {/* Language Selector */}
              <div className="flex items-center space-x-2 mt-2">
                <Globe className="w-4 h-4 text-white" />
                <span className="text-xs text-white">Language:</span>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="w-32 h-6 text-xs bg-white border-gray-300 text-gray-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-300">
                    {languages.map((lang) => (
                      <SelectItem key={lang} value={lang} className="text-gray-700 hover:bg-gray-100">
                        {lang}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Chat History Dropdown */}
              {showChatHistory && (
                <div className="mt-2 max-h-32 overflow-y-auto bg-white rounded-lg border border-gray-300">
                  {chatHistory.length === 0 ? (
                    <div className="p-2 text-xs text-gray-500">No previous chats</div>
                  ) : (
                    chatHistory.slice(0, 10).map((session) => (
                      <button
                        key={session.id}
                        onClick={() => loadChatSession(session.id)}
                        className="w-full p-2 text-left text-xs text-gray-700 hover:bg-gray-100 border-b border-gray-200 last:border-b-0"
                      >
                        <div className="truncate">{formatChatPreview(session)}</div>
                        <div className="text-gray-500 text-xs mt-1">
                          {new Date(session.timestamp).toLocaleDateString()}
                        </div>
                      </button>
                    ))
                  )}
                </div>
              )}
            </CardHeader>

            {/* Messages Area */}
            <CardContent className="flex-1 overflow-hidden p-0">
              <div className="h-full overflow-y-auto space-y-3 p-3" style={{ maxHeight: '300px' }}>
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] text-sm ${
                        message.role === 'user'
                          ? 'bg-green-200 text-gray-800 rounded-xl p-3' // User: soft green
                          : 'bg-blue-50 text-gray-700 rounded-xl p-3' // AI: soft blue
                      }`}
                      style={{
                        backgroundColor: message.role === 'user' ? '#d1f7c4' : '#eef5ff',
                        color: message.role === 'user' ? '#1a1a1a' : '#333333',
                        borderRadius: '12px',
                        padding: '8px 12px',
                        fontFamily: 'Inter, sans-serif'
                      }}
                    >
                      {message.text}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div style={{ 
                      backgroundColor: '#eef5ff', 
                      color: '#333333',
                      borderRadius: '12px',
                      padding: '8px 12px'
                    }} className="text-sm">
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
            </CardContent>

            {/* Input Area */}
            <div className="p-3 border-t border-gray-300 flex-shrink-0">
              <div className="flex space-x-2">
                <textarea
                  ref={textareaRef}
                  value={currentInput}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 bg-white border border-gray-300 rounded-xl px-3 py-2 text-sm text-gray-700 placeholder-gray-400 resize-none min-h-[40px] max-h-[80px] overflow-y-auto"
                  disabled={isLoading}
                  style={{ lineHeight: '1.4', fontFamily: 'Inter, sans-serif' }}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!currentInput.trim() || isLoading}
                  className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl px-3 h-10 flex-shrink-0"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </>
  );
}