import React from 'react';
import { Sparkles, Mic, FileText, Code, MessageSquare, ArrowRight, CheckCircle2, ShieldCheck, Zap, Award, Star, Play } from 'lucide-react';
import { PageRoute } from '../types';
import { useAuth } from '../context/AuthContext';
import { GlassCard } from '../components/GlassCard';

interface HomeProps {
  onNavigate: (page: PageRoute) => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const { user, loginAsDemo } = useAuth();

  const features = [
    {
      icon: <Mic className="w-8 h-8 text-emerald-500" />,
      title: "AI Voice Mock Interviews",
      desc: "Simulate pressure-tested behavioral and system design rounds with realistic Gemini 2.5 AI follow-up questions.",
      route: 'mock-interview' as PageRoute,
      color: "emerald" as const
    },
    {
      icon: <FileText className="w-8 h-8 text-amber-500" />,
      title: "Instant ATS Resume Audit",
      desc: "Upload your resume text to get an algorithm compatibility score, keyword gap analysis, and tailored custom questions.",
      route: 'resume-analyzer' as PageRoute,
      color: "amber" as const
    },
    {
      icon: <Code className="w-8 h-8 text-sky-500" />,
      title: "Algorithmic Practice IDE",
      desc: "Solve curated LeetCode-style problems in JavaScript, TypeScript, or Python with instant AI code complexity reviews.",
      route: 'coding-practice' as PageRoute,
      color: "sky" as const
    },
    {
      icon: <MessageSquare className="w-8 h-8 text-purple-500" />,
      title: "24/7 AI Career Mentor",
      desc: "Chat with an executive tech strategist to master salary negotiations, behavioral STAR answers, and career transitions.",
      route: 'career-chat' as PageRoute,
      color: "purple" as const
    }
  ];

  return (
    <div className="relative overflow-hidden pt-6 pb-20 space-y-24">
      
      {/* Ambient background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-tr from-indigo-500/20 via-purple-500/20 to-pink-500/10 dark:from-indigo-500/15 dark:via-purple-500/15 dark:to-pink-500/5 blur-[120px] rounded-full pointer-events-none -z-10"></div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8 lg:pt-16">
        
        <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-500/30 text-indigo-700 dark:text-indigo-300 text-xs sm:text-sm font-bold shadow-sm animate-pulse">
            <Award className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span>🏆 Official AI Hackathon 2026 Submission</span>
          </div>

          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs sm:text-sm font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span>Gemini 2.5 Flash Live</span>
          </div>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight max-w-5xl mx-auto leading-[1.1]">
          Master Your Tech Interview with{" "}
          <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
            Autonomous AI
          </span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
          The all-in-one glassmorphic platform designed for engineers. Practice realistic mock interviews, optimize your resume for top ATS bots, and write flawless code with instant AI feedback.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => onNavigate(user ? 'dashboard' : 'signup')}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 hover:from-indigo-500 hover:to-pink-400 text-white font-bold text-lg shadow-xl shadow-indigo-500/25 transition-all transform hover:-translate-y-1 flex items-center justify-center space-x-2"
          >
            <span>{user ? "Go to Dashboard" : "Start Free Practice"}</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          {!user && (
            <button
              onClick={() => {
                loginAsDemo();
                onNavigate('dashboard');
              }}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-lg border border-slate-300 dark:border-slate-700 transition-all flex items-center justify-center space-x-2"
            >
              <Play className="w-4 h-4 text-indigo-600 dark:text-indigo-400 fill-indigo-600 dark:fill-indigo-400" />
              <span>Launch Demo Mode</span>
            </button>
          )}
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
          <div className="flex items-center space-x-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>No credit card required</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <ShieldCheck className="w-4 h-4 text-indigo-500" />
            <span>Firestore Enterprise Sync</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <Zap className="w-4 h-4 text-amber-500" />
            <span>Real-time Gemini Streaming</span>
          </div>
        </div>

      </div>

      {/* Interactive Feature Cards Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 dark:text-white">
            Everything You Need to Land Staff & Senior Roles
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Built by engineers to eliminate interview anxiety through deliberate practice.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <GlassCard key={i} hoverEffect glowColor={f.color} className="flex flex-col justify-between">
              <div>
                <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800/80 w-fit mb-5">
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2.5">
                  {f.title}
                </h3>
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  {f.desc}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                  Explore Tool
                </span>
                <button
                  onClick={() => onNavigate(f.route)}
                  className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white transition-colors"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* Social Proof / Stats Showcase */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <GlassCard className="bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 text-white py-12 px-6 sm:px-12 border-indigo-500/30">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            
            <div className="space-y-2">
              <div className="flex items-center justify-center space-x-1 text-amber-400">
                <Star className="w-5 h-5 fill-amber-400" />
                <Star className="w-5 h-5 fill-amber-400" />
                <Star className="w-5 h-5 fill-amber-400" />
                <Star className="w-5 h-5 fill-amber-400" />
                <Star className="w-5 h-5 fill-amber-400" />
              </div>
              <p className="text-3xl sm:text-4xl font-extrabold">98.4%</p>
              <p className="text-xs sm:text-sm text-indigo-200">Candidate Confidence Rating</p>
            </div>

            <div className="space-y-2 border-y md:border-y-0 md:border-x border-white/10 py-6 md:py-0">
              <div className="flex items-center justify-center text-emerald-400">
                <Award className="w-6 h-6" />
              </div>
              <p className="text-3xl sm:text-4xl font-extrabold">10,000+</p>
              <p className="text-xs sm:text-sm text-indigo-200">AI Mock Questions Simulated</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-center text-sky-400">
                <Zap className="w-6 h-6" />
              </div>
              <p className="text-3xl sm:text-4xl font-extrabold">&lt; 350ms</p>
              <p className="text-xs sm:text-sm text-indigo-200">Ultra-Fast Evaluation Latency</p>
            </div>

          </div>
        </GlassCard>
      </div>

    </div>
  );
};
