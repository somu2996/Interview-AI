import React, { useState } from 'react';
import { Sparkles, FileText, Upload, CheckCircle2, AlertCircle, ArrowRight, RefreshCw, ShieldAlert, BookOpen, Target, Award } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { PageRoute, ResumeAnalysisRecord } from '../types';
import { GlassCard } from '../components/GlassCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface ResumeAnalyzerProps {
  onNavigate: (page: PageRoute) => void;
}

const SAMPLE_RESUME_TEXT = `Grace Hopper
Senior Software & Systems Architect
Email: grace@navy.mil | GitHub: github.com/ghopper

PROFESSIONAL SUMMARY
Innovative Principal Engineer with over 8 years of experience building high-availability distributed backends, compiler toolchains, and cloud-native microservices. Proven track record of scaling high-throughput APIs serving 50M+ daily requests.

EXPERIENCE
Lead Backend Engineer | CloudScale Inc. (2022 - Present)
- Architected event-driven microservices using Node.js, TypeScript, and Go, reducing average P99 latency by 42%.
- Spearheaded PostgreSQL query optimization and sharding strategy, cutting cloud infrastructure spend by $120,000 annually.
- Mentored 12 junior and mid-level engineers across agile sprints and code reviews.

Software Engineer | Distributed Systems Labs (2018 - 2022)
- Developed REST and gRPC services handling mission-critical data pipelines.
- Integrated automated CI/CD workflows using GitHub Actions and Docker containers.

EDUCATION
M.S. in Computer Science | Yale University
B.A. in Mathematics & Physics | Vassar College`;

export const ResumeAnalyzer: React.FC<ResumeAnalyzerProps> = ({ onNavigate }) => {
  const { user, isDemo } = useAuth();
  const { showToast } = useToast();
  const [resumeText, setResumeText] = useState('');
  const [targetRole, setTargetRole] = useState(user?.targetRole || 'Software Engineer');
  const [result, setResult] = useState<ResumeAnalysisRecord | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('ATS algorithm scanning your resume...');
  const [error, setError] = useState<string | null>(null);

  const analyzeResume = async (retryCount = 0) => {
    if (!resumeText.trim() || resumeText.length < 50) {
      setError("Please input a valid resume text (at least 50 characters).");
      return;
    }
    setLoading(true);
    setLoadingMsg("Gemini ATS Scanner benchmarking keyword density & impact metrics...");
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/ai/analyze-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText, targetRole })
      });

      if (!res.ok) throw new Error(`Server returned status ${res.status}`);
      const data = await res.json();

      const uploadDateStr = new Date().toISOString();
      const record: ResumeAnalysisRecord = {
        userId: user?.uid || "anon",
        title: `${targetRole} ATS Audit`,
        atsScore: data.atsScore || 82,
        summary: data.summary || "Solid technical alignment.",
        strengths: data.strengths || [],
        improvements: data.improvements || [],
        suggestions: data.suggestions || data.improvements || [],
        matchingSkills: data.matchingSkills || [],
        missingSkills: data.missingSkills || [],
        interviewQuestionsGenerated: data.interviewQuestionsGenerated || [],
        createdAt: uploadDateStr,
        uploadDate: uploadDateStr
      };

      setResult(record);
      showToast("ATS Resume Analysis complete! Scorecard generated successfully.", "success");

      try {
        await addDoc(collection(db, "resumes"), record);
        showToast("Analysis saved to Cloud Firestore.", "info");
      } catch (e) {
        console.warn("Failed to persist resume record to firestore:", e);
      }
    } catch (err: any) {
      if (retryCount < 2) {
        setLoadingMsg(`Retrying AI connection (attempt ${retryCount + 2})...`);
        setTimeout(() => analyzeResume(retryCount + 1), 1500);
        return;
      }
      const errorMsg = err.message || "Resume analysis failed.";
      setError(errorMsg);
      showToast(errorMsg, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) setResumeText(text);
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-500 mx-auto flex items-center justify-center border border-amber-500/20">
          <FileText className="w-7 h-7" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          AI Resume ATS Optimizer
        </h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-sm">
          Simulate enterprise Applicant Tracking Systems (Workday, Greenhouse, Lever). Identify missing keywords, boost callback probabilities, and predict tailored interview questions.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-800 flex items-center justify-between text-rose-600 dark:text-rose-300 text-sm">
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
          <button onClick={() => analyzeResume()} className="px-3 py-1.5 bg-rose-600 text-white rounded-lg text-xs font-bold flex items-center gap-1 hover:bg-rose-500 shrink-0">
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry Audit</span>
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Form Panel */}
        <GlassCard className="lg:col-span-5 space-y-6 sticky top-24">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Target Position</h3>
            <p className="text-xs text-slate-400">Benchmark your experience against this job title.</p>
          </div>

          <div className="relative">
            <Target className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="e.g. Staff Backend Engineer"
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase text-slate-400">Resume Content</label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setResumeText(SAMPLE_RESUME_TEXT)}
                  className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Load Sample
                </button>
                <label className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 cursor-pointer hover:bg-slate-200 flex items-center gap-1 border border-slate-200 dark:border-slate-700">
                  <Upload className="w-3 h-3" />
                  <span>Upload .txt</span>
                  <input type="file" accept=".txt,.md,.json" onChange={handleFileUpload} className="hidden" />
                </label>
              </div>
            </div>

            <textarea
              rows={12}
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste your plain text resume or markdown here..."
              className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 text-xs font-mono focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all"
            />
          </div>

          <button
            disabled={loading}
            onClick={() => analyzeResume()}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-pink-500 hover:from-amber-400 hover:to-pink-400 text-white font-bold text-sm shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4 fill-current" />
            <span>{loading ? "Scanning Keywords..." : "Run ATS Algorithm Scan"}</span>
          </button>
        </GlassCard>

        {/* Right Output Panel */}
        <div className="lg:col-span-7 space-y-6">
          {loading ? (
            <GlassCard className="py-28">
              <LoadingSpinner message={loadingMsg} size="lg" />
            </GlassCard>
          ) : !result ? (
            <GlassCard className="py-24 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">Awaiting Resume Scan</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                Paste your resume on the left and hit run to view your enterprise ATS compatibility breakdown and predicted questions.
              </p>
            </GlassCard>
          ) : (
            /* Results Scorecard */
            <div className="space-y-6 animate-in fade-in duration-300">
              
              {/* Top Score Banner */}
              <GlassCard className="p-6 sm:p-8 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="space-y-1 text-center sm:text-left">
                  <div className="flex items-center gap-2 justify-center sm:justify-start">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      ATS COMPATIBILITY AUDIT
                    </span>
                    <span className="text-[10px] text-indigo-300 font-mono">
                      {new Date(result.uploadDate || result.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold pt-1">{result.title}</h3>
                  <p className="text-xs text-indigo-200 leading-relaxed max-w-md">
                    {result.summary}
                  </p>
                </div>

                <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/5 border border-white/10 shrink-0 min-w-[120px]">
                  <span className="text-3xl font-black text-amber-400">{result.atsScore}%</span>
                  <span className="text-[10px] text-slate-300 uppercase font-semibold mt-1">Match Rating</span>
                </div>
              </GlassCard>

              {/* Skills Keywords Matrix */}
              <GlassCard className="p-6 space-y-4">
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400">Keyword Gap Analysis</h4>
                
                <div>
                  <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-2 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Found Keywords (Strong Alignment)
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {result.matchingSkills.map((sk, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 text-xs font-mono">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <p className="text-xs font-semibold text-rose-600 dark:text-rose-400 mb-2 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> Missing Keywords (Recommended Addition)
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {result.missingSkills.map((ms, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-500/20 text-xs font-mono">
                        + {ms}
                      </span>
                    ))}
                  </div>
                </div>
              </GlassCard>

              {/* Strengths vs Improvements */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <GlassCard className="p-6 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-500 flex items-center gap-1.5">
                    <Award className="w-4 h-4" /> Key Resume Strengths
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300 list-disc list-inside">
                    {result.strengths.map((st, i) => <li key={i}>{st}</li>)}
                  </ul>
                </GlassCard>

                <GlassCard className="p-6 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-500 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" /> Actionable Improvements
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300 list-disc list-inside">
                    {result.improvements.map((im, i) => <li key={i}>{im}</li>)}
                  </ul>
                </GlassCard>
              </div>

              {/* Predicted Tailored Interview Questions */}
              <GlassCard className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-indigo-500" />
                    <span>Tailored Interview Questions Generated</span>
                  </h4>
                  <span className="text-[10px] font-mono text-slate-400">Based on experience</span>
                </div>

                <div className="space-y-3">
                  {result.interviewQuestionsGenerated.map((q, i) => (
                    <div key={i} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-start justify-between gap-3">
                      <span className="text-xs font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
                        {i + 1}. {q}
                      </span>
                      <button onClick={() => onNavigate('mock-interview')} className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline shrink-0 flex items-center gap-1">
                        <span>Practice</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </GlassCard>

            </div>
          )}
        </div>

      </div>

    </div>
  );
};
