import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Send, Mic, Paperclip, Loader2 } from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { motion, AnimatePresence } from 'motion/react';
import { useChatMessage, useCreateConversation } from '../utils/hooks';
import { chatAPI } from '../utils/api';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: string;
}

export const ChatInterface: React.FC = () => {
  const { t } = useLanguage();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [models, setModels] = useState<string[][]>([]);
  const [selectedModel, setSelectedModel] = useState<string | undefined>(undefined);
  
  const sendMessage = useChatMessage();
  const createConversation = useCreateConversation();

  // 初始化对话
  useEffect(() => {
    const initializeConversation = async () => {
      try {
        const result = await createConversation.execute();
        setConversationId(result.conversationId);
      } catch (error) {
        console.error('Failed to initialize conversation:', error);
      }
    };

    initializeConversation();
  }, []);

  // 加载聊天模型列表
  useEffect(() => {
    const loadModels = async () => {
      try {
        const list = await chatAPI.getTextModels();
        setModels(list);
        if (list && list.length > 0) {
          setSelectedModel(list[0][0]);
        }
      } catch (e) {
        console.error('Failed to load text models:', e);
      }
    };
    loadModels();
  }, []);

  const handleSend = async () => {
    if (!message.trim() || sendMessage.loading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      content: message.trim(),
      role: 'user',
      timestamp: new Date().toISOString()
    };

    // 立即显示用户消息
    setMessages(prev => [...prev, userMessage]);
    const currentMessage = message.trim();
    setMessage('');

    try {
      // 发送消息到后端
      const result = await sendMessage.execute(currentMessage, conversationId ?? undefined, selectedModel);
      
      // 添加AI回复
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        content: result.response,
        role: 'assistant',
        timestamp: result.timestamp
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      // 更新对话ID（如果是新对话）
      if (!conversationId) {
        setConversationId(result.conversationId);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      // 可以在这里显示错误消息
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        content: '抱歉，发送消息时出现了错误。请稍后再试。',
        role: 'assistant',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Research Category Selector */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, duration: 0.5, ease: "easeOut" }}
        className="flex justify-center"
      >
        <Select value={selectedModel} onValueChange={setSelectedModel}>
          <SelectTrigger className="w-48 bg-slate-800/50 border-slate-700 text-white hover:bg-slate-700/50 transition-colors">
            <SelectValue placeholder={t('main.research')} />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700">
            {models.map((m) => (
              <SelectItem key={m[0]} value={m[0]} className="text-slate-300 hover:bg-slate-700">
                {m[1] || m[0]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </motion.div>

      {/* Chat Messages */}
      {messages.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800"
        >
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                      : 'bg-slate-700/50 text-slate-200 border border-slate-600'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                  <p className={`text-xs mt-1 opacity-70 ${
                    msg.role === 'user' ? 'text-blue-100' : 'text-slate-400'
                  }`}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Loading indicator */}
          {sendMessage.loading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="bg-slate-700/50 text-slate-200 border border-slate-600 px-4 py-2 rounded-2xl">
                <div className="flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <p className="text-sm">AI正在思考中...</p>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Chat Input */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5, ease: "easeOut" }}
        className="relative"
      >
        <div className="flex items-center gap-3 p-4 bg-slate-800/50 backdrop-blur-md rounded-2xl border border-slate-700/50 shadow-2xl">
          <motion.button
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-700/50"
          >
            <Paperclip className="w-5 h-5" />
          </motion.button>
          
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={t('input.placeholder')}
            className="flex-1 bg-transparent border-0 text-white placeholder-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0"
            disabled={sendMessage.loading}
          />

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-700/50"
          >
            <Mic className="w-5 h-5" />
          </motion.button>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={handleSend}
              disabled={!message.trim() || sendMessage.loading}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-slate-600 disabled:to-slate-700 text-white rounded-xl px-4 py-2 shadow-lg disabled:opacity-50 transition-all duration-200"
            >
              {sendMessage.loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};
