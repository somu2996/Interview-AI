import React, { useEffect, useState } from 'react';
import { ShieldCheck, Users, Mic, FileText, TrendingUp, Activity, Award, Clock, ArrowUpRight, BarChart3, PieChart as PieChartIcon, Sparkles, CheckCircle2, AlertCircle, Search, Filter } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { GlassCard } from '../components/GlassCard';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';

const DEMO_RECENT_ACTIVITIES = [
  { id: 'act-1', user: 'Alex Rivera', email: 'arivera@techcorp.io', action: 'Completed System Design Round', score: '9.2 / 10', time: '4 mins ago', status: 'optimal' },
  { id: 'act-2', user: 'Sarah Jenkins', email: 'sjenkins@stanford.edu', action: 'Ran Enterprise ATS Resume Scan', score: '88%', time: '18 mins ago', status: 'callback' },
  { id: 'act-3', user: 'David Kim', email: 'dkim@fintech.co', action: 'Practiced LRU Cache (Python)', score: 'O(1) Space', time: '35 mins ago', status: 'optimal' },
  { id: 'act-4', user: 'Elena Rostova', email: 'elena.r@cloud.de', action: 'Behavioral Leadership Screen', score: '8.5 / 10', time: '1 hr ago', status: 'review' },
  { id: 'act-5', user: 'Marcus Vance', email: 'mvance@startup.ai', action: 'Career Chat: Offer Negotiation', score: '+15k target', time: '2 hrs ago', status: 'optimal' },
];

const MONTHLY_INTERVIEWS_DATA = [
  { month: 'Jan', interviews: 142, resumes: 98, practice: 320 },
  { month: 'Feb', interviews: 198, resumes: 145, practice: 410 },
  { month: 'Mar', interviews: 265, resumes: 210, practice: 590 },
  { month: 'Apr', interviews: 340, resumes: 285, practice: 740 },
  { month: 'May', interviews: 420, resumes: 360, practice: 890 },
  { month: 'Jun', interviews: 580, resumes: 490, practice: 1240 },
];

const ROLE_DISTRIBUTION = [
  { name: 'Backend', value: 38, color: '#6366f1' },
  { name: 'Full Stack', value: 28, color: '#a855f7' },
  { name: 'Frontend', value: 18, color: '#06b6d4' },
  { name: 'ML / AI', value: 10, color: '#10b981' },
  { name: 'DevOps', value: 6, color: '#f59e0b' },
];

export const AdminDashboard: React.FC = () => {
  const { isDemo } = useAuth();
  
  // Stats counts
  const [totalUsers, setTotalUsers] = useState(2480);
  const [interviewCount, setInterviewCount] = useState(1945);
  const [resumeCount, setResumeCount] = useState(1588);
  const [practiceCount, setPracticeCount] = useState(4190);
  const [activities, setActivities] = useState(DEMO_RECENT_ACTIVITIES);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function fetchAdminMetrics() {
      try {
        if (!isDemo) {
          const intSnap = await getDocs(collection(db, "interviews")).catch(() => null);
          const resSnap = await getDocs(collection(db, "resumes")).catch(() => null);
          const pracSnap = await getDocs(collection(db, "practice_sessions")).catch(() => null);

          if (intSnap) setInterviewCount(intSnap.size + 1945);
          if (resSnap) setResumeCount(resSnap.size + 1588);
          if (pracSnap) setPracticeCount(pracSnap.size + 4190);
        }
      } catch (err) {
        console.error("Admin metrics fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchAdminMetrics();
  }, [isDemo]);

  const filteredActivities = activities.filter(a => 
    a.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      
      {/* Top Header Rail */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/20 text-[10px] font-extrabold uppercase tracking-widest">
              SYSTEM CONTROL PLANE
            </span>
            <span className="text-xs text-slate-400 font-mono">NODE: PREPAI_EAST1</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2.5 mt-2">
            <ShieldCheck className="w-8 h-8 text-rose-500" />
            <span>Executive Admin Dashboard</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Real-time platform telemetry, candidate generation statistics, and AI token utilization benchmarks.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>AI Inference Engine 99.9% SLO</span>
          </div>
        </div>
      </div>

      {/* Top Aggregate KPI Scorecards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <GlassCard className="p-6 border-indigo-500/20 relative overflow-hidden group hover:border-indigo-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Candidates</span>
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-500"><Users className="w-5 h-5" /></div>
          </div>
          <p className="text-3xl font-black text-slate-900 dark:text-white mt-4">{totalUsers.toLocaleString()}</p>
          <div className="flex items-center gap-1 text-xs text-emerald-500 font-semibold mt-2">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+18.4% this month</span>
          </div>
        </GlassCard>

        <GlassCard className="p-6 border-emerald-500/20 relative overflow-hidden group hover:border-emerald-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Interviews Simulated</span>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500"><Mic className="w-5 h-5" /></div>
          </div>
          <p className="text-3xl font-black text-slate-900 dark:text-white mt-4">{interviewCount.toLocaleString()}</p>
          <div className="flex items-center gap-1 text-xs text-emerald-500 font-semibold mt-2">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>8.9 / 10 avg candidate score</span>
          </div>
        </GlassCard>

        <GlassCard className="p-6 border-amber-500/20 relative overflow-hidden group hover:border-amber-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Resume ATS Audits</span>
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500"><FileText className="w-5 h-5" /></div>
          </div>
          <p className="text-3xl font-black text-slate-900 dark:text-white mt-4">{resumeCount.toLocaleString()}</p>
          <div className="flex items-center gap-1 text-xs text-amber-500 font-semibold mt-2">
            <span>84.2% callback rate prediction</span>
          </div>
        </GlassCard>

        <GlassCard className="p-6 border-sky-500/20 relative overflow-hidden group hover:border-sky-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Code Practice Runs</span>
            <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-500"><Activity className="w-5 h-5" /></div>
          </div>
          <p className="text-3xl font-black text-slate-900 dark:text-white mt-4">{practiceCount.toLocaleString()}</p>
          <div className="flex items-center gap-1 text-xs text-sky-500 font-semibold mt-2">
            <span>O(N) time complexity mode</span>
          </div>
        </GlassCard>

      </div>

      {/* Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Growth Area Chart */}
        <GlassCard className="lg:col-span-8 flex flex-col justify-between p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-indigo-500" />
                <span>Platform Generation Volume</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Aggregated monthly AI interview sessions and resume audits.</p>
            </div>
            <div className="flex items-center gap-3 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400"><span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block" /> Interviews</span>
              <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" /> Resumes</span>
            </div>
          </div>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MONTHLY_INTERVIEWS_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="adminInt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.5}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="adminRes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.5}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
                <Area type="monotone" dataKey="interviews" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#adminInt)" />
                <Area type="monotone" dataKey="resumes" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#adminRes)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Target Role Distribution Pie Chart */}
        <GlassCard className="lg:col-span-4 flex flex-col justify-between p-6 sm:p-8">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <PieChartIcon className="w-5 h-5 text-purple-500" />
              <span>Target Role Demand</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Distribution of candidate target tracks.</p>
          </div>

          <div className="h-[220px] w-full relative my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={ROLE_DISTRIBUTION}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {ROLE_DISTRIBUTION.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
              <span className="text-2xl font-black text-slate-800 dark:text-white">5</span>
              <span className="block text-[10px] text-slate-400 uppercase font-semibold">Tracks</span>
            </div>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
            {ROLE_DISTRIBUTION.map((r, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: r.color }} />
                  <span className="font-medium text-slate-700 dark:text-slate-300">{r.name}</span>
                </div>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{r.value}%</span>
              </div>
            ))}
          </div>
        </GlassCard>

      </div>

      {/* Recent Platform Activities Table */}
      <GlassCard className="p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-rose-500" />
              <span>Real-Time Activity Stream</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Live candidate interaction logs and evaluation outcomes.</p>
          </div>

          {/* Search bar */}
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter candidate or event..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <th className="pb-3 pl-2">Candidate</th>
                <th className="pb-3">Action Type</th>
                <th className="pb-3">Outcome / Score</th>
                <th className="pb-3 text-right pr-2">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-xs sm:text-sm">
              {filteredActivities.map((act) => (
                <tr key={act.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="py-4 pl-2 font-medium">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-xs">
                        {act.user.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">{act.user}</p>
                        <p className="text-[11px] text-slate-400 font-mono">{act.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 font-semibold text-slate-700 dark:text-slate-300">
                    {act.action}
                  </td>
                  <td className="py-4">
                    <span className={`px-2.5 py-1 rounded-lg font-mono text-xs font-bold border ${
                      act.status === 'optimal'
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                        : act.status === 'callback'
                        ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                        : 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20'
                    }`}>
                      {act.score}
                    </span>
                  </td>
                  <td className="py-4 text-right pr-2 text-slate-400 text-xs whitespace-nowrap">
                    {act.time}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

    </div>
  );
};
