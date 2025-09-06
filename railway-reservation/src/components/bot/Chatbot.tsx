import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, X, Send, Bot, User, Minimize2, Maximize2, 
  Moon, Sun, Mic, MicOff, Palette,
  FileText, Paperclip
} from 'lucide-react';
import { Button } from '../ui/button';
import chatbotService from '../../services/api/chatbotService';
import { cn } from '../../lib/utils';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  type?: 'text' | 'file' | 'voice';
  fileUrl?: string;
  fileName?: string;
}

interface Theme {
  name: string;
  primary: string;
  secondary: string;
  background: string;
  text: string;
}

const themes: Theme[] = [
  { name: 'Blue', primary: 'from-blue-600 to-blue-700', secondary: 'bg-blue-600', background: 'bg-white', text: 'text-gray-800' },
  { name: 'Green', primary: 'from-green-600 to-green-700', secondary: 'bg-green-600', background: 'bg-white', text: 'text-gray-800' },
  { name: 'Purple', primary: 'from-purple-600 to-purple-700', secondary: 'bg-purple-600', background: 'bg-white', text: 'text-gray-800' },
  { name: 'Red', primary: 'from-red-600 to-red-700', secondary: 'bg-red-600', background: 'bg-white', text: 'text-gray-800' },
];

const quickReplies = [
  "How to book a ticket?",
  "Check train schedule",
  "Cancel my ticket",
  "Payment methods",
  "PNR status",
  "What's the weather?",
  "Current news"
];

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<Theme>(themes[0]);
  const [showQuickReplies, setShowQuickReplies] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Load preferences from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('chatbot_theme');
    const savedDarkMode = localStorage.getItem('chatbot_dark_mode');
    
    if (savedTheme) {
      const theme = themes.find(t => t.name === savedTheme);
      if (theme) setCurrentTheme(theme);
    }
    
    if (savedDarkMode) {
      setIsDarkMode(JSON.parse(savedDarkMode));
    }
  }, []);

  // Save preferences to localStorage
  useEffect(() => {
    localStorage.setItem('chatbot_theme', currentTheme.name);
    localStorage.setItem('chatbot_dark_mode', JSON.stringify(isDarkMode));
  }, [currentTheme, isDarkMode]);

  // Load chat history on component mount
  useEffect(() => {
    const history = chatbotService.loadChatHistory();
    if (history.length > 0) {
      const formattedMessages: Message[] = history.flatMap(chat =>
        [
          {
            id: `user-${chat.id}`,
            text: chat.message,
            isBot: false,
            timestamp: chat.timestamp
          },
          {
            id: `bot-${chat.id}`,
            text: chat.response,
            isBot: true,
            timestamp: chat.timestamp
          }
        ]
      );
      setMessages(formattedMessages);
    } else {
      // Add welcome message
      setMessages([{
        id: 'welcome',
        text: "👋 Hi! I'm your Railway Assistant. I can help you with train bookings, payments, and answer general questions. How can I assist you today?",
        isBot: true,
        timestamp: new Date()
      }]);
    }
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, isMinimized]);

  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || inputMessage.trim();
    if (!textToSend) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: textToSend,
      isBot: false,
      timestamp: new Date()
    };

    setMessages((prev: Message[]) => [...prev, userMessage]);
    setInputMessage('');
    setShowQuickReplies(false);
    setIsTyping(true);

    try {
      const response = await chatbotService.sendMessage(textToSend);
      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        text: response,
        isBot: true,
        timestamp: new Date()
      };
      setMessages((prev: Message[]) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        text: "Sorry, I'm having trouble connecting right now. Please try again later.",
        isBot: true,
        timestamp: new Date()
      };
      setMessages((prev: Message[]) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const fileMessage: Message = {
        id: `file-${Date.now()}`,
        text: `Uploaded: ${file.name}`,
        isBot: false,
        timestamp: new Date(),
        type: 'file',
        fileName: file.name,
        fileUrl: URL.createObjectURL(file)
      };
      setMessages((prev: Message[]) => [...prev, fileMessage]);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        const voiceMessage: Message = {
          id: `voice-${Date.now()}`,
          text: "🎤 Voice message",
          isBot: false,
          timestamp: new Date(),
          type: 'voice',
          fileUrl: audioUrl
        };
        setMessages((prev: Message[]) => [...prev, voiceMessage]);
        
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const clearChat = () => {
    setMessages([{
      id: 'welcome',
      text: "👋 Hi! I'm your Railway Assistant. I can help you with train bookings, payments, and answer general questions. How can I assist you today?",
      isBot: true,
      timestamp: new Date()
    }]);
    chatbotService.clearChatHistory();
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const changeTheme = (theme: Theme) => {
    setCurrentTheme(theme);
    setShowSettings(false);
  };

  const renderMessage = (message: Message) => {
    if (message.type === 'file') {
      return (
        <div className="flex items-center space-x-2 p-2 bg-gray-100 rounded-lg">
          <FileText className="w-4 h-4 text-blue-600" />
          <span className="text-sm text-gray-700">{message.fileName}</span>
          {message.fileUrl && (
            <a href={message.fileUrl} download={message.fileName} className="text-blue-600 hover:text-blue-800">
              Download
            </a>
          )}
        </div>
      );
    }

    if (message.type === 'voice') {
      return (
        <div className="flex items-center space-x-2 p-2 bg-gray-100 rounded-lg">
          <Mic className="w-4 h-4 text-green-600" />
          <audio controls className="h-8">
            <source src={message.fileUrl} type="audio/wav" />
          </audio>
        </div>
      );
    }

    return <span>{message.text}</span>;
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300",
            "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800",
            "border-2 border-white/20"
          )}
          size="icon"
        >
          <MessageCircle className="w-6 h-6 text-white" />
        </Button>
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={cn(
              "fixed bottom-24 right-6 z-50 rounded-2xl shadow-2xl border overflow-hidden",
              isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200",
              isMinimized ? "w-80 h-14" : "w-80 h-[600px]"
            )}
          >
            {/* Header */}
            <div className={cn(
              "bg-gradient-to-r p-4 flex items-center justify-between",
              currentTheme.primary,
              isDarkMode && "brightness-75"
            )}>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-white">Railway Assistant</h3>
                  <p className="text-xs text-white/90">Online</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  onClick={toggleDarkMode}
                  variant="ghost"
                  size="icon"
                  className="w-6 h-6 text-white hover:bg-white/20"
                >
                  {isDarkMode ? <Sun className="w-3 h-3" /> : <Moon className="w-3 h-3" />}
                </Button>
                <Button
                  onClick={() => setShowSettings(!showSettings)}
                  variant="ghost"
                  size="icon"
                  className="w-6 h-6 text-white hover:bg-white/20"
                >
                  <Palette className="w-3 h-3" />
                </Button>
                <Button
                  onClick={toggleMinimize}
                  variant="ghost"
                  size="icon"
                  className="w-6 h-6 text-white hover:bg-white/20"
                >
                  {isMinimized ? <Maximize2 className="w-3 h-3" /> : <Minimize2 className="w-3 h-3" />}
                </Button>
                <Button
                  onClick={() => setIsOpen(false)}
                  variant="ghost"
                  size="icon"
                  className="w-6 h-6 text-white hover:bg-white/20"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            </div>

            {/* Settings Panel */}
            <AnimatePresence>
              {showSettings && !isMinimized && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className={cn(
                    "border-b p-4",
                    isDarkMode ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-200"
                  )}
                >
                  <h4 className={cn(
                    "font-medium text-sm mb-3",
                    isDarkMode ? "text-white" : "text-gray-800"
                  )}>
                    Choose Theme
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {themes.map((theme) => (
                      <button
                        key={theme.name}
                        onClick={() => changeTheme(theme)}
                        className={cn(
                          "p-2 rounded-lg text-xs font-medium transition-all",
                          currentTheme.name === theme.name
                            ? "bg-blue-600 text-white"
                            : isDarkMode
                              ? "bg-gray-600 text-gray-300 hover:bg-gray-500"
                              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        )}
                      >
                        {theme.name}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Messages */}
            <AnimatePresence>
              {!isMinimized && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex-1 flex flex-col h-[450px]"
                >
                  {/* Messages Container */}
                  <div className={cn(
                    "flex-1 overflow-y-auto p-4 space-y-4",
                    isDarkMode ? "bg-gray-800" : "bg-gray-50"
                  )}>
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={cn(
                          "flex items-start space-x-3",
                          message.isBot ? "justify-start" : "justify-end"
                        )}
                      >
                        {message.isBot && (
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <Bot className="w-4 h-4 text-blue-600" />
                          </div>
                        )}
                        <div
                          className={cn(
                            "max-w-[70%] rounded-2xl px-4 py-2 text-sm",
                            message.isBot
                              ? isDarkMode
                                ? "bg-gray-700 border border-gray-600 text-gray-100"
                                : "bg-white border border-gray-200 text-gray-800"
                              : "bg-blue-600 text-white"
                          )}
                        >
                          {renderMessage(message)}
                        </div>
                        {!message.isBot && (
                          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <User className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </motion.div>
                    ))}

                    {/* Quick Replies */}
                    {showQuickReplies && messages.length <= 1 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-wrap gap-2"
                      >
                        {quickReplies.map((reply, index) => (
                          <button
                            key={index}
                            onClick={() => handleSendMessage(reply)}
                            className={cn(
                              "px-3 py-1 rounded-full text-xs transition-all",
                              isDarkMode
                                ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            )}
                          >
                            {reply}
                          </button>
                        ))}
                      </motion.div>
                    )}

                    {/* Typing Indicator */}
                    {isTyping && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-start space-x-3"
                      >
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <Bot className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className={cn(
                          "bg-white border border-gray-200 rounded-2xl px-4 py-2",
                          isDarkMode && "bg-gray-700 border-gray-600"
                        )}>
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input Area */}
                  <div className={cn(
                    "border-t p-4",
                    isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
                  )}>
                    <div className="flex items-center space-x-2 mb-2">
                      <input
                        ref={inputRef}
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your message..."
                        className={cn(
                          "flex-1 px-3 py-2 border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                          isDarkMode
                            ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                            : "bg-white border-gray-300 text-gray-900"
                        )}
                        disabled={isTyping}
                      />
                      <Button
                        onClick={() => setShowQuickReplies(!showQuickReplies)}
                        variant="ghost"
                        size="icon"
                        className="w-8 h-8"
                      >
                        💬
                      </Button>
                      <Button
                        onClick={() => fileInputRef.current?.click()}
                        variant="ghost"
                        size="icon"
                        className="w-8 h-8"
                      >
                        <Paperclip className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={isRecording ? stopRecording : startRecording}
                        variant="ghost"
                        size="icon"
                        className={cn(
                          "w-8 h-8",
                          isRecording && "text-red-500 animate-pulse"
                        )}
                      >
                        {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                      </Button>
                      <Button
                        onClick={() => handleSendMessage()}
                        disabled={!inputMessage.trim() || isTyping}
                        size="icon"
                        className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      onChange={handleFileUpload}
                      className="hidden"
                      accept="image/*,.pdf,.doc,.docx,.txt"
                    />
                    <div className="flex justify-between items-center">
                      <button
                        onClick={clearChat}
                        className={cn(
                          "text-xs hover:underline transition-colors",
                          isDarkMode ? "text-gray-400 hover:text-gray-300" : "text-gray-500 hover:text-gray-700"
                        )}
                      >
                        Clear chat
                      </button>
                      <span className={cn(
                        "text-xs",
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      )}>
                        Press Enter to send
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;
