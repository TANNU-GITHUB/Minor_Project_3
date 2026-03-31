import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { X, Send, Loader2, Bot, User } from 'lucide-react';

interface ChatSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  paperId?: string;
}

interface Message {
  role: 'user' | 'ai';
  content: string;
}

export function ChatSidebar({ isOpen, onClose, paperId }: ChatSidebarProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', content: 'Hi! I am your AI study assistant. What would you like to know about this paper?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the bottom when a new message arrives
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || !paperId) return;

    const userMessage = input.trim();
    setInput(''); // Clear input immediately for better UX
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      // Call our new backend chat route
      const response = await axios.post(`http://localhost:5000/api/papers/${paperId}/chat`, {
        message: userMessage
      });

      setMessages(prev => [...prev, { role: 'ai', content: response.data.reply }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { role: 'ai', content: 'Oops! I had trouble connecting to the server. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className={`fixed inset-y-0 right-0 w-full md:w-[400px] bg-white/90 backdrop-blur-2xl border-l border-white/50 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200/50 bg-white/50">
        <h2 className="font-bold text-lg text-text-dark flex items-center gap-2">
          <Bot className="w-5 h-5 text-primary-500" /> AI Assistant
        </h2>
        <button 
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl p-4 flex gap-3 shadow-sm ${
              msg.role === 'user' 
                ? 'bg-gradient-to-br from-primary-500 to-secondary-500 text-white rounded-tr-sm' 
                : 'bg-white border border-gray-100 text-text-dark rounded-tl-sm'
            }`}>
              {msg.role === 'ai' && <Bot className="w-5 h-5 shrink-0 text-primary-500 mt-0.5" />}
              <p className="text-sm leading-relaxed">{msg.content}</p>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-sm p-4 flex gap-3 shadow-sm">
              <Loader2 className="w-5 h-5 text-primary-500 animate-spin" />
              <p className="text-sm text-gray-500">Thinking...</p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white/50 border-t border-gray-200/50">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask a question about this paper..."
            className="w-full bg-white border border-gray-200 rounded-full pl-5 pr-12 py-3 text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 shadow-sm transition-all"
          />
          <button
            onClick={handleSendMessage}
            disabled={!input.trim() || isLoading}
            className="absolute right-2 p-2 bg-primary-500 text-white rounded-full hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}