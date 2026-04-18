'use client';

import { useState, useEffect, useRef } from 'react';

const ADMIN_CREDENTIALS = {
  username: 'zra_admin',
  password: 'zra_secret123'
};

export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeSessions, setActiveSessions] = useState<any[]>([]);
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const storedLogin = localStorage.getItem('adminIsLoggedIn');
    const storedUsername = localStorage.getItem('adminUsername');
    if (storedLogin === 'true' && storedUsername === ADMIN_CREDENTIALS.username) {
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      fetchActiveSessions();
      const interval = setInterval(fetchActiveSessions, 3000);
      return () => clearInterval(interval);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (selectedSession) {
      fetchChatHistory(selectedSession.session_id);
      const interval = setInterval(() => fetchChatHistory(selectedSession.session_id), 2000);
      return () => clearInterval(interval);
    }
  }, [selectedSession]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      setIsLoggedIn(true);
      localStorage.setItem('adminIsLoggedIn', 'true');
      localStorage.setItem('adminUsername', username);
    } else {
      setLoginError('Invalid credentials');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('adminIsLoggedIn');
    localStorage.removeItem('adminUsername');
  };

  const fetchActiveSessions = async () => {
    try {
      const res = await fetch('/api/chatbot/admin/active_sessions');
      if (res.ok) {
        const data = await res.json();
        setActiveSessions(data.active_sessions);
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
    }
  };

  const fetchChatHistory = async (sessionId: string) => {
    try {
      const res = await fetch(`/api/chatbot/admin/chat_history/${sessionId}?include_files=true`);
      if (res.ok) {
        const data = await res.json();
        
        // Merge messages without duplicates based on ID
        setChatHistory(prev => {
          const existingIds = new Set(prev.map(m => m.id).filter(id => id !== undefined));
          const mappedMessages = data.messages.map((m: any) => ({
            ...m,
            files: m.files || []
          }));
          const newMessages = mappedMessages.filter((m: any) => !existingIds.has(m.id));
          
          if (newMessages.length > 0) {
            return [...prev, ...newMessages];
          }
          if (prev.length === 0 && mappedMessages.length > 0) return mappedMessages;
          return prev;
        });
      }
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  };

  const connectToSession = async (sessionId: string) => {
    if (selectedSession?.session_id === sessionId) return;
    
    // Clear current view first
    setChatHistory([]);
    
    try {
      const res = await fetch('/api/chatbot/admin/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId, admin: true })
      });
      if (res.ok) {
        const data = await res.json();
        setSelectedSession(data);
        fetchChatHistory(sessionId);
      }
    } catch (error) {
      console.error('Error connecting:', error);
    }
  };

  const closeSession = async () => {
    if (!selectedSession) return;
    if (!confirm('Are you sure you want to close this session?')) return;

    try {
      const res = await fetch('/api/chatbot/admin/close_session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: selectedSession.session_id })
      });
      if (res.ok) {
        setSelectedSession(null);
        setChatHistory([]);
        fetchActiveSessions();
      }
    } catch (error) {
      console.error('Error closing session:', error);
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
    if ((!newMessage.trim() && selectedFiles.length === 0) || !selectedSession) return;
    
    try {
      // Handle file upload first if any
      if (selectedFiles.length > 0) {
        setIsUploading(true);
        const formData = new FormData();
        selectedFiles.forEach(file => formData.append('files', file));
        formData.append('session_id', selectedSession.session_id);
        formData.append('sender_type', 'staff');

        const uploadRes = await fetch('/api/chatbot/upload', {
          method: 'POST',
          body: formData
        });
        
        if (!uploadRes.ok) throw new Error('File upload failed');
        
        setIsUploading(false);
        setSelectedFiles([]);
      }

      // Send text message
      if (newMessage.trim()) {
        const res = await fetch('/api/chatbot/admin/send_message', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            session_id: selectedSession.session_id, 
            message: newMessage 
          })
        });
        if (res.ok) {
          setNewMessage('');
        }
      }
      
      fetchChatHistory(selectedSession.session_id);
    } catch (error) {
      console.error('Error sending message:', error);
      setIsUploading(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 text-gray-900">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h1 className="text-2xl font-bold text-center text-blue-800 mb-6">ZRA Admin Portal</h1>
          
          <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-800">
            <p className="font-semibold mb-1">Admin Credentials:</p>
            <p>Username: <code className="bg-white px-1 rounded">{ADMIN_CREDENTIALS.username}</code></p>
            <p>Password: <code className="bg-white px-1 rounded">{ADMIN_CREDENTIALS.password}</code></p>
          </div>

          <div className="space-y-4">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border rounded p-2 text-gray-900"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded p-2 text-gray-900"
            />
            {loginError && <p className="text-red-500 text-sm">{loginError}</p>}
            <button type="submit" className="w-full bg-blue-800 text-white p-2 rounded hover:bg-blue-900 transition-colors">
              Sign In
            </button>
          </div>
          <button 
            type="button"
            onClick={() => {
              setUsername(ADMIN_CREDENTIALS.username);
              setPassword(ADMIN_CREDENTIALS.password);
            }}
            className="w-full mt-2 text-xs text-blue-600 hover:underline text-center"
          >
            Auto-fill Credentials
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100 text-gray-900">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="font-bold">Active Sessions</h2>
          <button onClick={handleLogout} className="text-xs text-red-600 hover:underline">Logout</button>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {activeSessions.map((s) => (
            <div 
              key={s.session_id}
              onClick={() => connectToSession(s.session_id)}
              className={`p-3 mb-2 rounded cursor-pointer border ${
                selectedSession?.session_id === s.session_id ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium truncate">{s.session_id}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  s.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                }`}>{s.status}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1 truncate">{s.latest_message || 'No messages'}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat */}
      <div className="flex-1 flex flex-col bg-white">
        {selectedSession ? (
          <>
            <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-sm">Session: {selectedSession.session_id}</h3>
                <p className="text-xs text-gray-500">Staff Assigned: {selectedSession.staff_member || 'You'}</p>
              </div>
              <button 
                onClick={closeSession}
                className="text-xs bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1.5 rounded border border-red-200 transition-colors"
              >
                Close Session
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatHistory.map((m) => (
                <div key={m.id} className="space-y-2">
                  <div className={`flex ${m.sender_type === 'user' ? 'justify-start' : 'justify-end'}`}>
                    <div className={`max-w-[70%] p-3 rounded-lg text-sm ${
                      m.sender_type === 'user' ? 'bg-gray-100' : (m.sender_type === 'system' ? 'bg-yellow-50 text-yellow-800 border w-full text-center text-xs' : 'bg-blue-800 text-white')
                    }`}>
                      {m.message}
                    </div>
                  </div>
                  {/* Display associated files for THIS message */}
                  {m.files && m.files.length > 0 && (
                    <div className={`flex ${m.sender_type === 'user' ? 'justify-start' : 'justify-end'} px-4`}>
                      <div className="grid grid-cols-1 gap-2 max-w-[70%] w-full">
                        {m.files.map((file: any) => (
                          <a 
                            key={file.id} 
                            href={file.full_media_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center p-2 bg-white border rounded hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium truncate">{file.original_filename}</p>
                              <p className="text-[10px] text-gray-500">{file.file_type} • {(file.file_size / 1024).toFixed(1)} KB</p>
                            </div>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            
            {/* Input area */}
            <div className="p-4 border-t">
              {selectedFiles.length > 0 && (
                <div className="mb-2 flex flex-wrap gap-2">
                  {selectedFiles.map((file, idx) => (
                    <div key={idx} className="bg-blue-50 text-blue-700 text-[10px] px-2 py-1 rounded border border-blue-100 flex items-center">
                      <span className="truncate max-w-[150px]">{file.name}</span>
                      <button onClick={() => removeFile(idx)} className="ml-1 font-bold text-blue-400 hover:text-blue-600">&times;</button>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex gap-2">
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 text-gray-500 hover:text-blue-600 border rounded"
                  title="Attach Files"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type your reply..."
                  className="flex-1 border rounded px-4 py-2 text-sm text-gray-900"
                />
                <button 
                  onClick={sendMessage}
                  disabled={(!newMessage.trim() && selectedFiles.length === 0) || isUploading}
                  className="bg-blue-800 text-white px-6 py-2 rounded text-sm disabled:bg-gray-300 flex items-center gap-2"
                >
                  {isUploading && (
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  )}
                  Send
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            Select a session to start chatting
          </div>
        )}
      </div>
    </div>
  );
}
