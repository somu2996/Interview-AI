import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, Bot, User as UserIcon, RefreshCw, ShieldAlert, Zap, MessageSquare } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ChatMessage } from '../types';
import { GlassCard } from '../components/GlassCard';

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-init',
    role: 'model',
    text: "Hello! I am **PrepAI Career Coach**, your executive tech career mentor. Whether you are prepping for Staff/Principal interviews, negotiating a difficult offer, structuring STAR behavioral stories, or polishing your LinkedIn bio — how can I strategize with you today?",
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
];

const SUGGESTED_PROMPTS = [
  "How do I structure a 45-minute System Design interview answer?",
  "What is the best way to negotiate a $20k increase on a Senior offer?",
  "Give me a STAR example for resolving team engineering conflicts.",
  "How should I transition from Backend to Full Stack Tech Lead?"
];

export const CareerChat: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async (textToSend?: string, retryCount = 0) => {
    const msgText = textToSend || input;
    if (!msgText.trim() || loading) return;

    setError(null);
    if (!textToSend) setInput('');

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      text: msgText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedList = textToSend ? messages : [...messages, userMsg];
    if (!textToSend) setMessages(updatedList);
    setLoading(true);

    try {
      const res = await fetch('/api/ai/career-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: msgText,
          history: updatedList.slice(1).map(m => ({ role: m.role, text: m.text })),
          userContext: {
            role: user?.targetRole || "Software Engineer",
            experience: user?.experienceLevel || "Mid-Level"
          }
        })
      });

      if (!res.ok) throw new Error(`HTTP status ${res.status}`);
      const data = await res.json();

      const modelReply: ChatMessage = {
        id: `reply-${Date.now()}`,
        role: 'model',
        text: data.reply || "I am ready to help!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, modelReply]);
    } catch (err: any) {
      console.warn("Chat error:", err);
      if (retryCount < 2) {
        setTimeout(() => sendMessage(msgText, retryCount + 1), 1500);
        return;
      }
      setError(err.message || "Failed to communicate with AI Coach.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center border border-purple-500/20">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>PrepAI Executive Career Strategist</span>
              <Sparkles className="w-4 h-4 text-purple-500" />
            </h1>
            <p className="text-xs text-slate-400">Context: {user?.targetRole || "Tech Candidate"} ({user?.experienceLevel || "Mid-Level"})</p>
          </div>
        </div>

        <button
          onClick={() => setMessages(INITIAL_MESSAGES)}
          className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-500 text-xs flex items-center gap-1 transition-colors"
          title="Clear Conversation"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Reset</span>
        </button>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/80 border border-rose-200 text-rose-600 dark:text-rose-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
          <button onClick={() => sendMessage(messages[messages.length - 1]?.text)} className="underline font-bold">Retry</button>
        </div>
      )}

      {/* Main Chat Box */}
      <GlassCard className="h-[60vh] sm:h-[65vh] flex flex-col justify-between p-4 sm:p-6 overflow-hidden">
        
        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div key={msg.id} className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center ${
                  isUser ? 'bg-indigo-600 text-white' : 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                }`}>
                  {isUser ? <UserIcon className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div className={`max-w-[85%] sm:max-w-[75%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-tr-none shadow-md'
                    : 'bg-slate-100 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-200/80 dark:border-slate-700/80'
                }`}>
                  <div className="whitespace-pre-line">{msg.text}</div>
                  <span className={`block text-[9px] mt-2 ${isUser ? 'text-indigo-200 text-right' : 'text-slate-400'}`}>
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center animate-pulse">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/60 rounded-tl-none border flex items-center gap-2 text-xs text-slate-400 font-mono">
                <Zap className="w-3.5 h-3.5 text-purple-500 animate-spin" />
                <span>Coach is strategizing response...</span>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Suggested Prompts Bar */}
        {messages.length <= 2 && !loading && (
          <div className="py-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-2 overflow-x-auto my-2">
            <span className="text-[10px] font-bold uppercase text-slate-400 shrink-0">Suggestions:</span>
            {SUGGESTED_PROMPTS.map((sp, i) => (
              <button
                key={i}
                onClick={() => sendMessage(sp)}
                className="px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-100 text-[11px] whitespace-nowrap border border-indigo-100 dark:border-indigo-900 transition-colors"
              >
                {sp}
              </button>
            ))}
          </div>
        )}

        {/* Bottom Input Form */}
        <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="pt-3 border-t border-slate-200 dark:border-slate-800 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything about interviews, resumes, negotiation, or career strategy..."
            className="flex-1 px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold transition-all flex items-center justify-center shadow-md shadow-purple-500/25"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </GlassCard>

    </div>
  );
};
