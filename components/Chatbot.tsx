'use client';

import { useState, useEffect, useRef } from 'react';

// Local storage constants
const CHAT_HISTORY_KEY = 'zax-chat-history';
const MAX_CHAT_SESSIONS = 50;

interface Message {
  type: string;
  content: string;
  timestamp: string;
  id?: number;
  isRealTime?: boolean;
  files?: any[];
  isWelcome?: boolean;
  welcomeData?: any;
  isError?: boolean;
}

interface ChatSession {
  id: string;
  messages: Message[];
  timestamp: string;
  title: string;
}

const getChatHistory = (): ChatSession[] => {
  if (typeof window === 'undefined') return [];
  try {
    const history = localStorage.getItem(CHAT_HISTORY_KEY);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error('Error reading chat history from localStorage:', error);
    return [];
  }
};

const saveChatHistory = (history: ChatSession[]) => {
  if (typeof window === 'undefined') return;
  try {
    const limitedHistory = history.slice(0, MAX_CHAT_SESSIONS);
    localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(limitedHistory));
  } catch (error) {
    console.error('Error saving chat history to localStorage:', error);
  }
};

const generateSessionId = () => `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

const generateSessionTitle = (messages: Message[]) => {
  if (messages.length === 0) return 'New Chat';
  const firstUserMessage = messages.find((msg: Message) => msg.type === 'user');
  if (firstUserMessage) {
    return firstUserMessage.content.substring(0, 30) + (firstUserMessage.content.length > 30 ? '...' : '');
  }
  return 'Chat Session';
};

const TypewriterText = ({ text, speed = 10, onComplete }: { text: string, speed?: number, onComplete?: () => void }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeoutId = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);
      return () => clearTimeout(timeoutId);
    } else if (!isComplete) {
      setIsComplete(true);
      onComplete && onComplete();
    }
  }, [currentIndex, text, speed, onComplete, isComplete]);

  return <span>{displayedText}</span>;
};

export default function Chatbot({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [isConnectedToStaff, setIsConnectedToStaff] = useState(false);
  const [isConnectingToStaff, setIsConnectingToStaff] = useState(false);
  const [staffName, setStaffName] = useState<string | null>(null);
  const [typingMessageId, setTypingMessageId] = useState<number | null>(null);
  const [welcomeVisible, setWelcomeVisible] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const userAtBottomRef = useRef(true);

  const welcomeMessages = [
    {
      greeting: "Hello! I'm ZAX, your AI assistant for the Zambia Revenue Authority (ZRA).",
      help: "I can help you with:",
      features: [
        "Tax registration and procedures",
        "VAT information and filing",
        "PAYE calculations and payments",
        "Customs and duties",
        "Tax compliance certificates",
        "General ZRA services"
      ],
      question: "What can I help you with today?",
      note: "Please do not share sensitive personal information such as NRCs or passwords."
    }
  ];

  useEffect(() => {
    if (userAtBottomRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen && !currentSessionId) {
      const history = getChatHistory();
      if (history.length > 0) {
        const latestSession = history[history.length - 1];
        setMessages(latestSession.messages);
        setCurrentSessionId(latestSession.id);
      } else {
        createNewSession();
      }
      setWelcomeVisible(true);
    }
  }, [isOpen]);

  // Polling for staff connection and new messages
  useEffect(() => {
    let interval: NodeJS.Timeout;

    const poll = async () => {
      if (!currentSessionId) return;

      try {
        // Check session status
        const statusRes = await fetch(`/api/chatbot/admin/session_status/${currentSessionId}`);
        if (statusRes.ok) {
          const statusData = await statusRes.json();
          
          if (statusData.status === 'active' && !isConnectedToStaff) {
            setIsConnectedToStaff(true);
            setIsConnectingToStaff(false);
            setStaffName(statusData.staff_member);
            setMessages(prev => {
              if (prev.some(m => m.type === 'system' && m.content.includes('staff member'))) return prev;
              return [...prev, {
                type: 'system',
                content: `Staff member ${statusData.staff_member || 'Agent'} has connected.`,
                timestamp: new Date().toISOString()
              }];
            });
          } else if (statusData.status === 'closed' && (isConnectedToStaff || isConnectingToStaff)) {
            setIsConnectedToStaff(false);
            setIsConnectingToStaff(false);
            setStaffName(null);
            setMessages(prev => {
              if (prev.some(m => m.type === 'system' && m.content.includes('closed'))) return prev;
              return [...prev, {
                type: 'system',
                content: "The chat session has been closed by the staff member. ZAX AI is now back to assist you.",
                timestamp: new Date().toISOString()
              }];
            });
          } else if (statusData.status === 'pending' || statusData.status === 'active') {
             if (statusData.status === 'pending' && !isConnectingToStaff && !isConnectedToStaff) {
               setIsConnectingToStaff(true);
             }
             if (statusData.status === 'active' && statusData.staff_member) {
               setStaffName(statusData.staff_member);
             }
          }
        }

        // Fetch new messages and files
        const historyRes = await fetch(`/api/chatbot/admin/chat_history/${currentSessionId}?include_files=true`);
        if (historyRes.ok) {
          const historyData = await historyRes.json();

          const mappedMessages = historyData.messages.map((m: any) => ({
            type: m.sender_type === 'staff' ? 'bot' : (m.sender_type === 'system' ? 'system' : 'user'),
            content: m.message,
            timestamp: m.timestamp,
            id: m.id,
            isRealTime: true,
            files: m.files || []
          }));

          setMessages((prev: Message[]) => {
            const existingIds = new Set(prev.map((msg: Message) => msg.id).filter((id): id is number => id !== undefined));
            const newMessagesFromServer = mappedMessages.filter((m: Message) => !existingIds.has(m.id as number));
            
            if (newMessagesFromServer.length > 0) {
              const filteredPrev = prev.filter((msg: Message) => {
                if (msg.id === undefined && msg.type === 'user') {
                  return !newMessagesFromServer.some((nm: Message) => nm.type === 'user' && nm.content === msg.content);
                }
                return true;
              });
              return [...filteredPrev, ...newMessagesFromServer];
            }
            return prev;
          });
        }
      } catch (error) {
        console.error('Polling error:', error);
      }
    };

    if (currentSessionId) {
      poll();
      interval = setInterval(poll, 3000);
    }

    return () => clearInterval(interval);
  }, [currentSessionId, isConnectedToStaff, isConnectingToStaff]);

  useEffect(() => {
    if (currentSessionId && messages.length > 0) {
      const history = getChatHistory();
      const existingSessionIndex = history.findIndex((s: ChatSession) => s.id === currentSessionId);
      
      const sessionData = {
        id: currentSessionId,
        messages: messages,
        timestamp: new Date().toISOString(),
        title: generateSessionTitle(messages)
      };

      if (existingSessionIndex !== -1) {
        history[existingSessionIndex] = sessionData;
      } else {
        history.push(sessionData);
      }
      saveChatHistory(history);
    }
  }, [messages, currentSessionId]);

  const createNewSession = () => {
    const newSessionId = generateSessionId();
    setCurrentSessionId(newSessionId);
    setIsConnectedToStaff(false);
    setIsConnectingToStaff(false);
    setStaffName(null);
    const welcome = welcomeMessages[0];
    const welcomeMsg: Message = {
      type: 'bot',
      content: welcome.greeting,
      timestamp: new Date().toISOString(),
      isWelcome: true,
      welcomeData: welcome
    };
    setMessages([welcomeMsg]);
    setShowSidebar(false);
  };

  const loadSession = (sessionId: string) => {
    const history = getChatHistory();
    const session = history.find((s: ChatSession) => s.id === sessionId);
    if (session) {
      setMessages(session.messages);
      setCurrentSessionId(session.id);
      setShowSidebar(false);
    }
  };

  const deleteSession = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const history = getChatHistory().filter((s: ChatSession) => s.id !== sessionId);
    saveChatHistory(history);
    if (sessionId === currentSessionId) {
      createNewSession();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const sendMessage = async () => {
    if ((!inputMessage.trim() && selectedFiles.length === 0) || isLoading || isUploading) return;

    const sessionToUse = currentSessionId || generateSessionId();
    if (!currentSessionId) setCurrentSessionId(sessionToUse);

    const userMsg = {
      type: 'user',
      content: inputMessage.trim() || (selectedFiles.length > 0 ? `Uploaded ${selectedFiles.length} file(s)` : ""),
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      let uploadedFilesInfo = [];
      if (selectedFiles.length > 0) {
        setIsUploading(true);
        const formData = new FormData();
        selectedFiles.forEach(file => formData.append('files', file));
        formData.append('session_id', sessionToUse);
        formData.append('sender_type', 'user');

        const uploadRes = await fetch('/api/chatbot/upload', {
          method: 'POST',
          body: formData
        });
        
        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          uploadedFilesInfo = uploadData.files;
        }
        setIsUploading(false);
        setSelectedFiles([]);
      }

      const endpoint = (isConnectedToStaff || isConnectingToStaff)
        ? '/api/chatbot/admin/send_user_message'
        : '/api/chatbot/chat';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg.content,
          session_id: sessionToUse,
          user_id: sessionToUse,
          uploaded_files: uploadedFilesInfo
        })
      });

      if (response.ok) {
        const data = await response.json();
        
        if (!isConnectedToStaff && !isConnectingToStaff) {
          const botMsg = {
            type: 'bot',
            content: data.response,
            timestamp: new Date().toISOString(),
            id: Date.now()
          };
          setMessages(prev => [...prev, botMsg]);
          setTypingMessageId(botMsg.id);
        }
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        type: 'bot',
        content: "I'm sorry, I'm experiencing technical difficulties.",
        timestamp: new Date().toISOString(),
        isError: true
      }]);
    } finally {
      setIsLoading(false);
      setIsUploading(false);
    }
  };

  const requestStaffAssistance = async () => {
    if (isConnectingToStaff || isConnectedToStaff) return;
    setIsConnectingToStaff(true);
    
    try {
      const sessionToUse = currentSessionId || generateSessionId();
      const response = await fetch('/api/chatbot/admin/request_assistance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionToUse, user_id: sessionToUse })
      });
      
      if (response.ok) {
        setMessages(prev => [...prev, {
          type: 'system',
          content: "ZRA staff has been notified. Please wait for a staff member to connect.",
          timestamp: new Date().toISOString()
        }]);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (!isOpen) return null;

  const displayedMessages = messages.filter(msg => {
    if (isConnectedToStaff || isConnectingToStaff) {
      if (msg.isWelcome && messages.length > 2) return false;
      return true;
    }
    return true;
  });

  return (
    <div className="fixed bottom-4 right-4 z-50 w-full sm:w-[400px] h-[600px] max-h-[90vh] flex flex-col bg-white shadow-2xl rounded-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-blue-800 text-white px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <button onClick={() => setShowSidebar(!showSidebar)} className="p-1 hover:bg-blue-700 rounded transition-colors" title="Chat History">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div>
            <h3 className="font-bold text-sm">{(isConnectedToStaff || isConnectingToStaff) ? (staffName || 'Agent') : 'ZAX AI'}</h3>
            <div className="text-[10px] opacity-80 flex items-center">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1 animate-pulse"></span>
              Online
            </div>
          </div>
        </div>
        <button onClick={onClose} className="text-2xl hover:text-gray-300 transition-colors">&times;</button>
      </div>

      <div className="flex-1 relative flex overflow-hidden">
        {/* Sidebar Overlay */}
        {showSidebar && (
          <div className="absolute inset-0 z-20 flex">
            <div className="w-64 bg-white border-r shadow-xl flex flex-col">
              <div className="p-3 border-b flex justify-between items-center bg-gray-50">
                <span className="font-bold text-xs text-gray-700">Chat History</span>
                <button onClick={createNewSession} className="text-[10px] bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700">New Chat</button>
              </div>
              <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {getChatHistory().length === 0 ? (
                  <p className="text-[10px] text-gray-500 text-center py-4">No history yet</p>
                ) : (
                  getChatHistory().slice().reverse().map((session: any) => (
                    <div 
                      key={session.id} 
                      onClick={() => loadSession(session.id)}
                      className={`group flex justify-between items-center p-2 rounded cursor-pointer text-[11px] ${
                        session.id === currentSessionId ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-100 text-gray-600'
                      }`}
                    >
                      <span className="truncate flex-1">{session.title}</span>
                      <button onClick={(e) => deleteSession(session.id, e)} className="opacity-0 group-hover:opacity-100 ml-1 text-gray-400 hover:text-red-500 transition-opacity">
                        &times;
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
            <div className="flex-1 bg-black/20" onClick={() => setShowSidebar(false)}></div>
          </div>
        )}

        {/* Messages */}
        <div ref={messagesContainerRef} className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50">
          {displayedMessages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-3 rounded-lg text-sm shadow-sm ${
                msg.type === 'user' 
                  ? 'bg-blue-600 text-white rounded-br-none' 
                  : msg.type === 'system'
                  ? 'bg-yellow-50 text-yellow-800 border border-yellow-100 w-full text-center text-[11px]'
                  : 'bg-white text-black border border-gray-100 rounded-bl-none'
              }`} style={msg.type === 'bot' ? { color: '#000000', backgroundColor: '#ffffff' } : {}}>
                {msg.isWelcome ? (
                  <div className="space-y-2">
                    <p className="font-semibold text-gray-900">{msg.content}</p>
                    <ul className="text-xs space-y-1 list-disc pl-4 text-gray-700">
                      {msg.welcomeData.features.map((f: string, i: number) => <li key={i}>{f}</li>)}
                    </ul>
                    <p className="text-[11px] italic text-gray-500 mt-2">{msg.welcomeData.note}</p>
                  </div>
                ) : (
                  <div className="whitespace-pre-wrap">
                    {msg.type === 'bot' && typingMessageId === msg.id ? (
                      <TypewriterText text={msg.content} onComplete={() => setTypingMessageId(null)} />
                    ) : (
                      <div className="space-y-2">
                        <p>{msg.content}</p>
                        {msg.files && msg.files.length > 0 && (
                          <div className="mt-2 space-y-1">
                            {msg.files.map((file: any) => (
                              <a 
                                key={file.id} 
                                href={file.full_media_url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 p-1.5 bg-black/5 rounded hover:bg-black/10 transition-colors text-[10px]"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                <span className="truncate flex-1">{file.original_filename}</span>
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border rounded-full px-4 py-2 flex gap-1 shadow-sm">
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 border-t bg-white">
        {selectedFiles.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-2">
            {selectedFiles.map((file, idx) => (
              <div key={idx} className="bg-blue-50 text-blue-700 text-[10px] px-2 py-1 rounded border border-blue-100 flex items-center">
                <span className="truncate max-w-[120px]">{file.name}</span>
                <button onClick={() => removeFile(idx)} className="ml-1 font-bold text-blue-400 hover:text-blue-600">&times;</button>
              </div>
            ))}
          </div>
        )}
        {!isConnectedToStaff && !isConnectingToStaff && (
          <button 
            onClick={requestStaffAssistance}
            className="text-[11px] text-blue-600 hover:underline mb-2 block font-medium"
          >
            Connect to a live agent?
          </button>
        )}
        <div className="flex gap-2 items-center">
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="text-gray-400 hover:text-blue-600 transition-colors p-1"
            title="Upload file"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            multiple 
          />
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Ask ZAX about taxes..."
            className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-blue-500 text-black bg-white placeholder-gray-500"
            style={{ color: '#000000', backgroundColor: '#ffffff' }}
            disabled={isLoading || isUploading}
          />
          <button
            onClick={sendMessage}
            disabled={(!inputMessage.trim() && selectedFiles.length === 0) || isLoading || isUploading}
            className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center disabled:bg-gray-300 transition-all hover:bg-blue-700 shadow-sm"
          >
            {isUploading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
