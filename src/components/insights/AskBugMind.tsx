import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send } from 'lucide-react';
import { aiService } from '../../services/ai';

interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
}

const CHIPS = [
  "What are my most common mistakes?",
  "How many times have I made this error?",
  "Show my previous fixes for NullPointerException.",
  "What should I focus on improving?"
];

export const AskBugMind: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'ai', content: 'Hi! I can help you understand your debugging patterns. What would you like to know?' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // Call Hindsight reflect via the AI service
    try {
      const aiContent = await aiService.getAIResponse(text);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: aiContent
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: 'Sorry, I encountered an error. Please try again.'
      }]);
    }
  };

  const handleChipClick = (text: string) => {
    setInputValue(text);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col h-full shadow-sm">
      <div className="p-4 border-b border-gray-200 bg-gray-50/50 flex items-center space-x-2">
        <MessageCircle className="w-5 h-5 text-blue-600" />
        <h2 className="text-lg font-bold text-gray-900">Ask BugMind</h2>
      </div>

      <div className="flex-grow p-4 overflow-y-auto min-h-[300px] max-h-[400px] space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div 
              className={`max-w-[80%] p-3 rounded-lg text-sm ${
                msg.role === 'user' 
                  ? 'bg-blue-50 text-gray-900' 
                  : 'bg-white border border-gray-200 text-gray-800'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex flex-wrap gap-2 mb-3">
          {CHIPS.map((chip, index) => (
            <button
              key={index}
              onClick={() => handleChipClick(chip)}
              className="border border-gray-200 rounded-full px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50 hover:text-gray-900 cursor-pointer transition-colors"
            >
              {chip}
            </button>
          ))}
        </div>
        
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend(inputValue)}
            placeholder="Ask BugMind about your debugging history..."
            className="flex-grow border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            onClick={() => handleSend(inputValue)}
            disabled={!inputValue.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg p-3 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
