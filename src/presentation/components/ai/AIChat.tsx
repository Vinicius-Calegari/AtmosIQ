import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, X, Bot, User } from 'lucide-react';
import { AI_CONFIG } from '@core/constants/config';
import { Button } from '@presentation/components/common/Button';
import { Card } from '@presentation/components/common/Card';
import type { AIChatMessage } from '@core/types/ai';

interface AIChatProps {
  messages: AIChatMessage[];
  isLoading: boolean;
  error?: string | null;
  onSendMessage: (message: string) => void;
  onClose?: () => void;
}

export function AIChat({ messages, isLoading, error, onSendMessage, onClose }: AIChatProps) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  return (
    <Card className="h-[500px] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-accent rounded-lg">
            <Bot size={20} className="text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-text-primary">{AI_CONFIG.ASSISTANT_NAME}</h3>
            <p className="text-xs text-text-muted">Pergunte o que quiser sobre o clima atual</p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 text-text-muted hover:text-text-primary hover:bg-bg-secondary rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4">
        {error && (
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 px-3 py-2 text-sm text-amber-100">
            {error}
          </div>
        )}
        {messages.length === 0 && (
          <div className="text-center text-text-muted py-8">
            <MessageCircle size={48} className="mx-auto mb-4 opacity-50" />
            <p>Pergunte algo sobre o clima.</p>
            <p className="text-sm mt-2">Exemplo: "Preciso levar guarda-chuva?"</p>
          </div>
        )}
        <AnimatePresence>
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
        </AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3"
          >
            <div className="p-2 bg-accent-primary/10 rounded-lg">
              <Bot size={20} className="text-accent-primary" />
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-accent-primary rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-accent-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
              <div className="w-2 h-2 bg-accent-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="pt-4 border-t border-white/5">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Pergunte sobre o clima..."
            className="flex-1 bg-bg-secondary rounded-xl px-4 py-3 text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-primary"
            disabled={isLoading}
          />
          <Button
            type="submit"
            variant="primary"
            disabled={!input.trim() || isLoading}
            className="px-4"
          >
            <Send size={18} />
          </Button>
        </div>
      </form>
    </Card>
  );
}

interface MessageBubbleProps {
  message: AIChatMessage;
}

function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
    >
      <div className={`p-2 rounded-lg ${isUser ? 'bg-accent-primary/10' : 'bg-bg-secondary'}`}>
        {isUser ? (
          <User size={20} className="text-accent-primary" />
        ) : (
          <Bot size={20} className="text-accent-secondary" />
        )}
      </div>
      <div
        className={`
          max-w-[80%] p-3 rounded-xl
          ${isUser 
            ? 'bg-accent-primary text-white' 
            : 'bg-bg-secondary text-text-primary'
          }
        `}
      >
        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
      </div>
    </motion.div>
  );
}
