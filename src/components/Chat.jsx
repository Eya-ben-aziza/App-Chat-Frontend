import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

export const Chat = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [username] = useState(`User${Math.floor(Math.random() * 1000)}`);

  useEffect(() => {
    socket.on('message', (newMessage) => {
      setMessages(prev => [...prev, newMessage]);
      // Auto-scroll to bottom
      const messagesContainer = document.querySelector('.messages-container');
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    });

    return () => {
      socket.off('message');
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      const messageData = {
        text: message,
        username,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      socket.emit('message', messageData);
      setMessage('');
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto border border-gray-200 rounded-lg overflow-hidden font-sans">
      {/* Header */}
      <div className="bg-green-500 text-white p-4 text-center text-xl font-semibold">
        Real-Time Chat
      </div>
      
      {/* Messages Container */}
      <div className="messages-container flex-1 p-4 overflow-y-auto bg-gray-50">
        {messages.map((msg, i) => (
          <div 
            key={i} 
            className={`mb-4 p-3 rounded-2xl max-w-[70%] break-words ${msg.username === username 
              ? 'ml-auto bg-green-100 rounded-tr-none' 
              : 'mr-auto bg-white rounded-tl-none'}`}
          >
            <div className="flex justify-between items-center mb-1">
              <span className={`text-sm font-medium ${msg.username === username ? 'text-green-700' : 'text-gray-700'}`}>
                {msg.username}
              </span>
              <span className="text-xs text-gray-500">
                {msg.timestamp}
              </span>
            </div>
            <div className="text-gray-800">{msg.text}</div>
          </div>
        ))}
      </div>
      
      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex p-3 bg-gray-100">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 rounded-full border-none focus:outline-none focus:ring-2 focus:ring-green-300"
        />
        <button 
          type="submit" 
          className="ml-2 px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-300"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;