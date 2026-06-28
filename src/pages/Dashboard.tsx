import React, { useEffect, useState } from 'react';
import { Sparkles, TrendingUp, Award, Clock, ArrowRight, Play, CheckCircle2, AlertCircle, FileText } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { PageRoute, InterviewSession, ResumeAnalysisRecord } from '../types';
import { GlassCard } from '../components/GlassCard';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface DashboardProps {
  onNavigate: (page: PageRoute) => void;
}

const DEMO_SESSIONS: InterviewSession[] = [
  {
    id: "demo-1",
    userId: "demo-user-123",
    title: "Senior System Design Round",
    role: "Backend Engineer",
    difficulty: "Advanced",
    type: "System Design",
    score: 8.8,
    feedbackSummary: "Excellent grasp of distributed caching and partitioning trade-offs.",
    questions: [],
    createdAt: "2026-06-25T14:20:00Z",
    durationMinutes: 35
  },
  {
    id: "demo-2",
    userId: "demo-user-123",
    title: "Behavioral Leadership Screen",
    role: "Engineering Manager",
    difficulty: "Staff/Principal",
    type: "Behavioral",
    score: 9.2,
    feedbackSummary: "Exemplary STAR articulation focusing on cross-functional conflict management.",
    questions: [],
    createdAt: "2026-06-22T10:15:00Z",
    durationMinutes: 25
  },
  {
    id: "demo-3",
    userId: "demo-user-123",
    title: "Frontend React Architecture",
    role: "Senior Frontend Engineer",
    difficulty: "Advanced",
    type: "Technical",
    score: 8.5,
    feedbackSummary: "Strong state management patterns; could discuss concurrent mode rendering depth.",
    questions: [],
    createdAt: "2026-06-18T16:45:00Z",
    durationMinutes: 40
  }
];

const DEMO_RESUMES: ResumeAnalysisRecord[] = [
  {
    id: "res-demo-1",
    userId: "demo-user-123",
    title: "Staff Backend Engineer ATS Audit",
    atsScore: 88,
    summary: "Solid cloud-native experience with strong impact metrics.",
    strengths: ["Clean architectural breakdown", "Quantified achievements"],
    improvements: ["Add Kubernetes orchestration specifics"],
    suggestions: ["Quantify latency reductions", "Highlight mentoring leadership"],
    matchingSkills: ["TypeScript", "Node.js", "Docker", "AWS"],
    missingSkills: ["Kubernetes", "GraphQL", "Terraform"],
    interviewQuestionsGenerated: [],
    createdAt: "2026-06-26T12:00:00Z",
    uploadDate: "2026-06-26T12:00:00Z"
  }
];

const SKILL_RADAR_DATA = [
  { subject: 'System Design', A: 92, fullMark: 100 },
  { subject: 'Algorithms', A: 85, fullMark: 100 },
  { subject: 'Behavioral', A: 95, fullMark: 100 },
  { subject: 'Communication', A: 90, fullMark: 100 },
  { subject: 'Code Cleanliness', A: 88, fullMark: 100 },
  { subject: 'Concurrency', A: 80, fullMark: 100 },
];

const PROGRESS_AREA_DATA = [
  { month: 'Jan', score: 6.2 },
  { month: 'Feb', score: 6.8 },
  { month: 'Mar', score: 7.4 },
  { month: 'Apr', score: 8.1 },
  { month: 'May', score: 8.5 },
  { month: 'Jun', score: 9.1 },
];

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { user, isDemo } = useAuth();
  const [sessions, setSessions] = useState<InterviewSession[]>([]);
  const [resumeAudits, setResumeAudits] = useState<ResumeAnalysisRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserHistory() {
      if (!user) return;
      if (isDemo) {
        setSessions(DEMO_SESSIONS);
        setResumeAudits(DEMO_RESUMES);
        setLoading(false);
        return;
      }
      try {
        const q = query(collection(db, "interviews"), where("userId", "==", user.uid));
        const snap = await getDocs(q);
        const list: InterviewSession[] = [];
        snap.forEach(d => list.push({ id: d.id, ...d.data() } as InterviewSession));
        setSessions(list);

        const qRes = query(collection(db, "resumes"), where("userId", "==", user.uid));
        const snapRes = await getDocs(qRes);
        const listRes: ResumeAnalysisRecord[] = [];
        snapRes.forEach(d => listRes.push({ id: d.id, ...d.data() } as ResumeAnalysisRecord));
        setResumeAudits(listRes);
      } catch (err) {
        console.warn("Dashboard history fetch err:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchUserHistory();
  }, [user, isDemo]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Welcome, {user?.displayName || "Candidate"}</span>
            <Sparkles className="w-6 h-6 text-indigo-500" />
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Targeting <span className="font-semibold text-indigo-600 dark:text-indigo-400">{user?.targetRole || "Software Engineer"}</span> roles • Seniority: {user?.experienceLevel || "Mid-Level"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('mock-interview')}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-md shadow-indigo-500/25 transition-all flex items-center gap-2"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>New Mock Interview</span>
          </button>
          <button
            onClick={() => onNavigate('coding-practice')}
            className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-sm border border-slate-200 dark:border-slate-700 transition-all"
          >
            Practice IDE
          </button>
        </div>
      </div>

      {isDemo && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-amber-800 dark:text-amber-300 text-xs sm:text-sm">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 shrink-0 text-amber-500" />
            <span>You are viewing the <strong>Demo Candidate Workspace</strong>. Sample chart telemetry and interview records are injected below.</span>
          </div>
          <button onClick={() => onNavigate('signup')} className="underline font-bold hover:text-amber-500 shrink-0 ml-4">
            Save Real Progress
          </button>
        </div>
      )}

      {/* Top Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Avg ATS Score</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500"><Award className="w-5 h-5" /></div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-4">88.5 / 100</p>
          <div className="flex items-center gap-1 text-xs text-emerald-500 font-medium mt-2">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+4.2% top percentile</span>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Mock Rating</span>
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-500"><Sparkles className="w-5 h-5" /></div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-4">9.1 / 10</p>
          <div className="flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 font-medium mt-2">
            <span>Exemplary STAR delivery</span>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Problems Solved</span>
            <div className="p-2 rounded-lg bg-sky-500/10 text-sky-500"><CheckCircle2 className="w-5 h-5" /></div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-4">24</p>
          <div className="flex items-center gap-1 text-xs text-sky-500 font-medium mt-2">
            <span>O(1) Space optimal avg</span>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Practice Time</span>
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500"><Clock className="w-5 h-5" /></div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-4">14.2 hrs</p>
          <div className="flex items-center gap-1 text-xs text-purple-500 font-medium mt-2">
            <span>6-day active prep streak</span>
          </div>
        </GlassCard>

      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Progress Timeline Area Chart */}
        <GlassCard className="lg:col-span-7 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Performance Trajectory</h3>
            <p className="text-xs text-slate-400 mb-6">Historical AI score evaluation across past mock interview iterations.</p>
          </div>

          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={PROGRESS_AREA_DATA} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis domain={[0, 10]} stroke="#94a3b8" fontSize={12} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
                <Area type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Competency Radar Chart */}
        <GlassCard className="lg:col-span-5 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Core Competency Matrix</h3>
            <p className="text-xs text-slate-400 mb-4">Algorithmic distribution of assessed engineering skills.</p>
          </div>

          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={SKILL_RADAR_DATA}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" stroke="#94a3b8" fontSize={11} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" fontSize={10} />
                <Radar name="Candidate" dataKey="A" stroke="#a855f7" fill="#a855f7" fillOpacity={0.5} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

      </div>

      {/* Recent Interview History List */}
      <GlassCard className="p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Recent Interview Sessions</h3>
            <p className="text-xs text-slate-400">Detailed transcript evaluations saved to Cloud Firestore.</p>
          </div>
          <button onClick={() => onNavigate('mock-interview')} className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1">
            <span>Practice Another</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center space-y-4">
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20"></div>
              <div className="absolute inset-0 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin"></div>
            </div>
            <p className="text-slate-400 text-sm font-medium animate-pulse">Synchronizing interview history from Cloud Firestore...</p>
          </div>
        ) : sessions.length === 0 ? (
          <div className="py-16 text-center max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-500 flex items-center justify-center mx-auto shadow-inner">
              <Award className="w-8 h-8 animate-bounce" />
            </div>
            <h4 className="text-lg font-bold text-slate-900 dark:text-white">No Interview History Yet</h4>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              You haven't completed any AI mock interviews yet. Launch your first live practice round to generate ATS scorecards and AI voice telemetry.
            </p>
            <div className="pt-2">
              <button
                onClick={() => onNavigate('mock-interview')}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-sm font-bold shadow-lg shadow-indigo-500/25 transition-all transform hover:-translate-y-0.5 inline-flex items-center gap-2"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Start First Live Round</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {sessions.map((s, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:border-indigo-500/50">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded uppercase bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                      {s.type}
                    </span>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">{s.title}</h4>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl">
                    "{s.feedbackSummary}"
                  </p>
                  <p className="text-[11px] font-mono text-slate-400 pt-1">
                    Role: {s.role} • Difficulty: {s.difficulty} • Duration: {s.durationMinutes} mins
                  </p>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-200 dark:border-slate-700 shrink-0">
                  <div className="text-right">
                    <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{s.score}</span>
                    <span className="text-xs text-slate-400"> / 10</span>
                  </div>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    {new Date(s.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </GlassCard>

      {/* Recent Resume ATS Audits List */}
      <GlassCard className="p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-amber-500" />
              <span>Saved ATS Resume Audits</span>
            </h3>
            <p className="text-xs text-slate-400">Stored resume analysis records with ATS scores, missing skills, suggestions, and upload date.</p>
          </div>
          <button onClick={() => onNavigate('resume-analyzer')} className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1">
            <span>Analyze Another</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center space-y-4">
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 rounded-full border-4 border-amber-500/20"></div>
              <div className="absolute inset-0 rounded-full border-4 border-amber-500 border-t-transparent animate-spin"></div>
            </div>
            <p className="text-slate-400 text-sm font-medium animate-pulse">Synchronizing saved resume records from Firestore...</p>
          </div>
        ) : resumeAudits.length === 0 ? (
          <div className="py-16 text-center max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-500 flex items-center justify-center mx-auto shadow-inner">
              <FileText className="w-8 h-8 animate-bounce" />
            </div>
            <h4 className="text-lg font-bold text-slate-900 dark:text-white">No Resume Analyses Yet</h4>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              You haven't scanned any resumes yet. Upload your resume to calculate your ATS Score and discover missing skills.
            </p>
            <div className="pt-2">
              <button
                onClick={() => onNavigate('resume-analyzer')}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white text-sm font-bold shadow-lg shadow-amber-500/25 transition-all transform hover:-translate-y-0.5 inline-flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 fill-current" />
                <span>Run First ATS Scan</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {resumeAudits.map((r, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:border-amber-500/50">
                <div className="space-y-2 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded uppercase bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 font-mono">
                      ATS SCORE: {r.atsScore}%
                    </span>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">{r.title}</h4>
                  </div>
                  {r.missingSkills && r.missingSkills.length > 0 && (
                    <p className="text-xs text-rose-600 dark:text-rose-400 font-mono flex items-center gap-1.5 flex-wrap">
                      <span className="font-bold text-slate-500 dark:text-slate-400">Missing Skills:</span>
                      {r.missingSkills.map((sk, sidx) => (
                        <span key={sidx} className="px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/20 text-[11px]">{sk}</span>
                      ))}
                    </p>
                  )}
                  {((r.suggestions && r.suggestions.length > 0) || (r.improvements && r.improvements.length > 0)) && (
                    <div className="text-xs text-slate-600 dark:text-slate-300">
                      <span className="font-bold text-slate-500 dark:text-slate-400 block mb-1">Suggestions:</span>
                      <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-500 dark:text-slate-400 pl-1">
                        {(r.suggestions || r.improvements || []).slice(0, 3).map((sug, sidx) => (
                          <li key={sidx}>{sug}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-200 dark:border-slate-700 shrink-0">
                  <div className="text-right">
                    <span className="text-2xl font-black text-amber-500">{r.atsScore}%</span>
                    <span className="text-[10px] text-slate-400 uppercase block font-semibold">Match Rating</span>
                  </div>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mt-2">
                    {new Date(r.uploadDate || r.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </GlassCard>

    </div>
  );
};
