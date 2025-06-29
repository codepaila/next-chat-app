
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { socket, connectSocket, disconnectSocket } from '@/lib/socket';
import { motion, AnimatePresence } from 'motion/react';
import { FaUserCircle, FaCheckDouble } from 'react-icons/fa';

type Message = {
  sender: string;
  text: string;
  time: string;
  seen?: boolean;
};

const generateGuestName = () => {
  const id = Math.floor(1000 + Math.random() * 9000);
  return `Guest${id}`;
};

const ChatApp = () => {
  const { data: session } = useSession();
  const [guestName, setGuestName] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState('');
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesTopRef = useRef<HTMLDivElement>(null);

  const userName = session?.user?.name || guestName || '';
  const isAuthenticated = !!session;

  // Generate and persist guest name
  useEffect(() => {
    if (!session) {
      let saved = localStorage.getItem('guestName');
      if (!saved) {
        saved = generateGuestName();
        localStorage.setItem('guestName', saved);
      }
      setGuestName(saved);
    }
  }, [session]);

  // Socket connections
  useEffect(() => {
    if (!userName) return;

    connectSocket();

    socket.on('connect', () => console.log('Connected'));

    socket.on('receiveMessage', (msg: Message) => {
      const isMine = msg.sender === userName;
      setMessages((prev) => [
        ...prev,
        {
          ...msg,
          seen: !isMine,
        },
      ]);
    });

    socket.on('userTyping', (user) => {
      if (user !== userName) {
        setTypingUser(user);
        setTimeout(() => setTypingUser(null), 2000);
      }
    });

    return () => {
      disconnectSocket();
      socket.off('connect');
      socket.off('receiveMessage');
      socket.off('userTyping');
    };
  }, [userName]);

  // Send Message
  const sendMessage = () => {
    if (!message.trim() || !userName) return;

    const msg: Message = {
      sender: userName,
      text: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    socket.emit('sendMessage', msg);
    setMessage('');
  };

  // Typing event
  const handleTyping = () => {
    if (userName && message.trim()) {
      socket.emit('typing', userName);
    }
  };

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-screen max-w-7xl mx-auto bg-gray-900">
      {/* Header */}
      <header className="bg-green-600 text-white p-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2">
          <FaUserCircle className="text-2xl" />
          <h2 className="text-xl font-semibold">CodePaila Chat</h2>
        </div>
        {!isAuthenticated ? (
          <button
            onClick={() => signIn('google')}
            className="text-sm bg-white text-green-600 px-3 py-1 rounded-full hover:bg-gray-200 cursor-pointer"
          >
            Login
          </button>
        ) : 
        <button
            onClick={() => signOut()}
            className="text-sm bg-white text-green-600 px-3 py-1 rounded-full hover:bg-gray-200 cursor-pointer"
          >
            Logout
          </button>
    }
      </header>

      

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <div ref={messagesTopRef} />
        <AnimatePresence>
          {messages.map((msg, index) => {
            const isMine = msg.sender === userName;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs p-3 rounded-lg ${
                    isMine ? 'bg-green-500 text-white' : 'bg-white text-gray-800 shadow'
                  }`}
                >
                  <p className="text-sm font-semibold">{msg.sender}</p>
                  <p>{msg.text}</p>
                  <div className="flex justify-between text-xs mt-1">
                    <span className={isMine ? 'text-gray-200' : 'text-gray-600'}>{msg.time}</span>
                    {isMine && (
                      <FaCheckDouble
                        className={`ml-1 ${msg.seen ? 'text-blue-300' : 'text-white/70'}`}
                        title={msg.seen ? 'Seen' : 'Delivered'}
                      />
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        {typingUser && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-xs text-gray-500 italic text-center"
          >
            {typingUser} is typing...
          </motion.p>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <div className="p-4 bg-white border-t">
        <div className="flex gap-2 items-center">
          <textarea
            rows={2}
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              handleTyping();
            }}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMessage())}
            placeholder="Type a message..."
            className="flex-1 border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            onClick={sendMessage}
            className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700"
          >
            Send
          </button>
        </div>
        {!isAuthenticated && (
          <p className="text-center text-xs text-gray-500 mt-2">
            Guest: <span className="font-semibold">{userName}</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default ChatApp;
