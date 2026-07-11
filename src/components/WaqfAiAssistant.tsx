import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export const WaqfAiAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'أهلاً بك في البنك الوقفي الرقمي (وقفي تك) بالجزائر. أنا مستشارك الرقمي المدعم بالذكاء الاصطناعي، ومستعد للإجابة على جميع تساؤلاتك الفقهية والتقنية حول إدارة واستثمار الأوقاف النقدية والأسهم الوقفية المتوفرة على المنصة. كيف يمكنني مساعدتك اليوم؟',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom whenever messages list updates
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Build history for backend API context (max 6 messages to keep tokens low)
      const chatHistory = messages.slice(-6).map((m) => ({
        role: m.role,
        content: m.content
      }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: textToSend,
          chatHistory: chatHistory
        })
      });

      if (response.ok) {
        const data = await response.json();
        const assistantMsg: ChatMessage = {
          id: `msg_${Date.now() + 1}`,
          role: 'assistant',
          content: data.reply,
          timestamp: new Date()
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } else {
        throw new Error('Chat API returned an error');
      }
    } catch (err) {
      console.error("AI Assistant connection error:", err);
      // Fallback message
      const fallbackMsg: ChatMessage = {
        id: `msg_${Date.now() + 1}`,
        role: 'assistant',
        content: 'أعتذر منك بشدة، حدث عائق في الاتصال بالخادم الرئيسي حالياً. يرجى محاولة طرح سؤالك مجدداً بعد ثوانٍ قليلة، أو تصفح قسم الأسئلة الشائعة في أسفل الصفحة الرئيسية.',
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const presetQuestions = [
    'ما فضل الوقف النقدي؟',
    'كيف يتم استثمار وقفي تك؟',
    'ما هي مصارف وقف رعاية اليتيم؟',
    'هل يمكنني الوقف باسم والدي؟'
  ];

  return (
    <div className="fixed bottom-6 left-6 z-50 text-right font-sans select-none" dir="rtl">
      <AnimatePresence>
        {/* Toggle Button */}
        {!isOpen && (
          <motion.button
            key="chat-trigger"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="w-14 h-14 bg-gradient-to-tr from-[#1B5E20] to-[#2E7D32] hover:opacity-95 text-[#C9A84C] rounded-full shadow-lg flex items-center justify-center cursor-pointer transition-all border-2 border-[#C9A84C]/50 relative"
            id="btn-ai-chat-trigger"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <MessageSquare size={24} className="text-[#C9A84C]" />
            <span className="absolute -top-1 -right-1 bg-amber-500 text-white font-extrabold text-[9px] py-0.5 px-2 rounded-full border border-white animate-pulse">
              ذكي
            </span>
          </motion.button>
        )}

        {/* Chat window */}
        {isOpen && (
          <motion.div
            key="chat-window"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="w-[360px] sm:w-[400px] h-[550px] bg-white rounded-2xl border border-slate-100 shadow-2xl flex flex-col overflow-hidden relative"
          >
            {/* Header */}
            <div className="bg-gradient-to-l from-[#1B5E20] to-[#2E7D32] p-4 text-white flex items-center justify-between border-b-2 border-[#C9A84C]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-[#C9A84C]/30 overflow-hidden">
                  <img
                    src="/src/assets/images/waqfitek_logo_1783159586464.jpg"
                    alt="Waqfitek AI"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <h4 className="text-sm font-black text-white flex items-center gap-1.5">
                    <span>مستشار وقفي تك الذكي</span>
                    <Sparkles size={14} className="text-[#C9A84C] animate-pulse" />
                  </h4>
                  <p className="text-[10px] text-emerald-100 font-medium">مساعد رقمي فقهي وتقني لحظي</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white p-1 hover:bg-white/10 rounded-lg cursor-pointer transition-colors"
                id="btn-close-ai-chat"
              >
                <X size={18} />
              </button>
            </div>

            {/* Message Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${m.role === 'user' ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                      m.role === 'user'
                        ? 'bg-slate-900 text-white rounded-tr-none'
                        : 'bg-[#F9F6F0] text-slate-800 border border-[#1B5E20]/5 rounded-tl-none font-medium'
                    }`}
                  >
                    <p className="whitespace-pre-line">{m.content}</p>
                    <span className="block text-[8px] text-slate-400 mt-1.5 text-left font-mono">
                      {m.timestamp.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-end">
                  <div className="bg-[#F9F6F0] border border-[#1B5E20]/5 text-slate-500 rounded-2xl rounded-tl-none p-3.5 flex items-center gap-1.5 text-[11px] font-medium">
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-[#1B5E20] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-1.5 h-1.5 bg-[#1B5E20] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-1.5 h-1.5 bg-[#1B5E20] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </span>
                    <span>المستشار يستنبط الجواب من الفقه ومقاصد الشريعة...</span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Quick Presets */}
            {messages.length === 1 && !isLoading && (
              <div className="p-3 border-t border-slate-100 bg-white space-y-1.5">
                <span className="text-[10px] font-bold text-[#1B5E20] block mb-1">الأسئلة الأكثر تداولاً:</span>
                <div className="flex flex-wrap gap-1.5 justify-start">
                  {presetQuestions.map((q) => (
                    <button
                      key={q}
                      onClick={() => handleSendMessage(q)}
                      className="text-[10px] font-semibold text-slate-700 bg-slate-50 hover:bg-[#1B5E20]/5 hover:text-[#1B5E20] px-2.5 py-1.5 rounded-full border border-slate-150 cursor-pointer transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Bar */}
            <div className="p-3 border-t border-slate-100 bg-white">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage(input);
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="اسأل المستشار عن فتاوى الوقف الاستثماري..."
                  className="flex-1 bg-slate-50 rounded-xl px-4 py-2.5 text-xs text-right focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#1B5E20] transition-all"
                  disabled={isLoading}
                  id="txt-ai-chat-input"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="w-9 h-9 bg-[#1B5E20] text-white hover:bg-[#154619] disabled:opacity-30 rounded-xl flex items-center justify-center cursor-pointer transition-colors shrink-0"
                  id="btn-ai-chat-send"
                >
                  <Send size={15} className="rotate-180" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
