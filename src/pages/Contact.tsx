import React, { useState } from 'react';
import { Mail, Send, CheckCircle2, MessageSquare, HelpCircle, LifeBuoy } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';

export const Contact: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !message) return;
    setSent(true);
    setEmail('');
    setSubject('');
    setMessage('');
  };

  const faqs = [
    {
      q: "How does the Gemini Mock Interviewer evaluate my answers?",
      a: "Our AI evaluates your transcripts based on domain precision, STAR structuring (Situation, Task, Action, Result), and clear articulation of system trade-offs."
    },
    {
      q: "Is my uploaded resume stored securely?",
      a: "Yes. All records are backed by Google Cloud Run enterprise architecture and encrypted inside Firebase Cloud Firestore with strict user isolation security rules."
    },
    {
      q: "Can I practice LeetCode problems in Python?",
      a: "Yes! Our Algorithmic Practice IDE supports instant syntax highlighting and evaluation in JavaScript, TypeScript, and Python."
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-12">
      
      <div className="text-center space-y-3">
        <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 text-indigo-500 mx-auto flex items-center justify-center border border-indigo-500/20">
          <LifeBuoy className="w-7 h-7" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Help & Engineering Support
        </h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-sm">
          Have feedback on AI scoring latencies or need help configuring your interview benchmark profile? Reach out directly to our engineering team.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Contact Form */}
        <GlassCard className="lg:col-span-7 p-8 space-y-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-indigo-500" />
            <span>Send a Message</span>
          </h3>

          {sent && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs sm:text-sm font-bold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
              <span>Thank you! Your inquiry has been dispatched to PrepAI Support engineering.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@domain.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">Subject</label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Feature request or ATS audit question"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">Detailed Description</label>
              <textarea
                rows={5}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="How can we assist you today?"
                className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Dispatch Ticket</span>
            </button>
          </form>
        </GlassCard>

        {/* FAQs */}
        <div className="lg:col-span-5 space-y-6">
          <div className="flex items-center gap-2 px-2">
            <HelpCircle className="w-5 h-5 text-indigo-500" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Frequently Asked Questions</h3>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <GlassCard key={idx} className="p-6 space-y-2 border-indigo-500/10">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white leading-relaxed">{faq.q}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-sans">{faq.a}</p>
              </GlassCard>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
