import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Send, ArrowLeft } from 'lucide-react';

const Inbox = () => {
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (!userData) {
      navigate('/login');
      return;
    }
    setUser(userData);
    setMessages(userData.inbox || []);
  }, [navigate]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-dark-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="mr-4 p-2 bg-dark-800 rounded-md text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold text-primary-400">Inbox</h1>
        </div>

        <div className="bg-dark-800 rounded-lg border border-dark-700">
          {messages.length === 0 ? (
            <div className="p-8 text-center">
              <MessageSquare size={48} className="mx-auto text-gray-500 mb-4" />
              <p className="text-gray-400">No messages yet</p>
            </div>
          ) : (
            <div className="divide-y divide-dark-700">
              {messages.map((message) => (
                <div key={message.id} className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-white">{message.fromUserName}</h3>
                      <p className="text-sm text-gray-400">
                        {new Date(message.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      message.type === 'JOB_OFFER' 
                        ? 'bg-primary-600 text-white' 
                        : 'bg-secondary-600 text-white'
                    }`}>
                      {message.type}
                    </span>
                  </div>
                  <p className="text-gray-300">{message.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Inbox; 