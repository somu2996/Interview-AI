import React, { useState } from 'react';
import { Sparkles, Code, Play, RefreshCw, CheckCircle2, AlertCircle, Terminal, Award, BookOpen, ShieldAlert } from 'lucide-react';
import { SAMPLE_CODING_PROBLEMS } from '../data/codingProblems';
import { useAuth } from '../context/AuthContext';
import { CodingPracticeRecord } from '../types';
import { GlassCard } from '../components/GlassCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export const CodingPractice: React.FC = () => {
  const { user, isDemo } = useAuth();
  const [selectedProb, setSelectedProb] = useState(SAMPLE_CODING_PROBLEMS[0]);
  const [language, setLanguage] = useState<'javascript' | 'typescript' | 'python'>('javascript');
  const [code, setCode] = useState(SAMPLE_CODING_PROBLEMS[0].starterCode.javascript);

  // Review state
  const [reviewResult, setReviewResult] = useState<CodingPracticeRecord | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('Principal Engineer evaluating algorithmic logic...');
  const [error, setError] = useState<string | null>(null);

  const handleSelectProb = (prob: typeof selectedProb) => {
    setSelectedProb(prob);
    setCode(prob.starterCode[language] || prob.starterCode.javascript);
    setReviewResult(null);
    setError(null);
  };

  const handleLangChange = (lang: typeof language) => {
    setLanguage(lang);
    setCode(selectedProb.starterCode[lang] || selectedProb.starterCode.javascript);
  };

  const submitCodeForReview = async (retryCount = 0) => {
    if (!code.trim()) return;
    setLoading(true);
    setLoadingMsg("Gemini Principal Engineer judging Big-O complexity & boundary guards...");
    setError(null);

    try {
      const res = await fetch('/api/ai/code-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemTitle: selectedProb.title,
          language,
          code
        })
      });

      if (!res.ok) throw new Error(`HTTP review error ${res.status}`);
      const data = await res.json();

      const record: CodingPracticeRecord = {
        userId: user?.uid || "anon",
        problemId: selectedProb.id,
        problemTitle: selectedProb.title,
        language,
        code,
        passed: data.passed !== false,
        score: data.score || 85,
        timeComplexity: data.timeComplexity || "O(N)",
        spaceComplexity: data.spaceComplexity || "O(1)",
        feedback: data.feedback || "Good logical implementation.",
        improvements: data.improvements || [],
        createdAt: new Date().toISOString()
      };

      setReviewResult(record);

      if (user && !isDemo) {
        try {
          await addDoc(collection(db, "practice_sessions"), record);
        } catch (e) {
          console.warn("Failed to save coding record:", e);
        }
      }
    } catch (err: any) {
      if (retryCount < 2) {
        setLoadingMsg(`Retrying code review connection (attempt ${retryCount + 2})...`);
        setTimeout(() => submitCodeForReview(retryCount + 1), 1500);
        return;
      }
      setError(err.message || "Code review evaluation failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
            <Code className="w-8 h-8 text-sky-500" />
            <span>Algorithmic Practice IDE</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Solve LeetCode benchmarks with real-time Gemini 2.5 Big-O performance reviews and code refactoring.
          </p>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
          {SAMPLE_CODING_PROBLEMS.map((prob) => (
            <button
              key={prob.id}
              onClick={() => handleSelectProb(prob)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedProb.id === prob.id
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-500/25'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <span>{prob.title}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                prob.difficulty === 'Easy' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
              }`}>
                {prob.difficulty}
              </span>
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-800 flex items-center justify-between text-rose-600 dark:text-rose-300 text-sm">
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
          <button onClick={() => submitCodeForReview()} className="px-3 py-1.5 bg-rose-600 text-white rounded-lg text-xs font-bold flex items-center gap-1 hover:bg-rose-500 shrink-0">
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry Review</span>
          </button>
        </div>
      )}

      {/* Main Split Editor View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Problem Spec Panel */}
        <GlassCard className="lg:col-span-5 space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-500">{selectedProb.category}</span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">ID: {selectedProb.id}</span>
          </div>

          <h2 className="text-2xl font-black text-slate-900 dark:text-white">{selectedProb.title}</h2>
          
          <p className="text-sm text-slate-600 dark:text-slate-300 whitespace-pre-line leading-relaxed font-sans">
            {selectedProb.description}
          </p>

          <div className="space-y-4 pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Examples</h4>
            {selectedProb.examples.map((ex, i) => (
              <div key={i} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-mono space-y-1">
                <p><strong>Input:</strong> {ex.input}</p>
                <p><strong>Output:</strong> {ex.output}</p>
                {ex.explanation && <p className="text-slate-400 font-sans text-[11px] pt-1">💡 {ex.explanation}</p>}
              </div>
            ))}
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Constraints</h4>
            <ul className="list-disc list-inside space-y-1 text-xs font-mono text-slate-500 dark:text-slate-400">
              {selectedProb.constraints.map((c, i) => <li key={i}>{c}</li>)}
            </ul>
          </div>
        </GlassCard>

        {/* Right IDE & Output Panel */}
        <div className="lg:col-span-7 space-y-6">
          
          <GlassCard className="p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <Terminal className="w-5 h-5 text-sky-500" />
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200">Solution Editor</span>
              </div>

              <div className="flex items-center gap-2">
                {(['javascript', 'typescript', 'python'] as const).map((l) => (
                  <button
                    key={l}
                    onClick={() => handleLangChange(l)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-colors uppercase ${
                      language === l
                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200'
                    }`}
                  >
                    {l === 'javascript' ? 'JS' : l === 'typescript' ? 'TS' : 'PY'}
                  </button>
                ))}
              </div>
            </div>

            {/* Code Textarea */}
            <div className="relative">
              <textarea
                rows={14}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full p-4 rounded-2xl bg-slate-950 text-sky-300 font-mono text-xs sm:text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-sky-500 border border-slate-800 resize-y"
                spellCheck={false}
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setCode(selectedProb.starterCode[language] || selectedProb.starterCode.javascript)}
                className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors flex items-center gap-1 font-medium"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset Template</span>
              </button>

              <button
                disabled={loading}
                onClick={() => submitCodeForReview()}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-sky-500/25 transition-all flex items-center gap-2 disabled:opacity-50 transform active:scale-95"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Run Algorithmic Review</span>
              </button>
            </div>
          </GlassCard>

          {/* AI Code Review Telemetry Card */}
          {loading ? (
            <GlassCard className="py-16">
              <LoadingSpinner message={loadingMsg} size="md" />
            </GlassCard>
          ) : reviewResult && (
            <GlassCard className="p-6 sm:p-8 space-y-6 animate-in fade-in duration-300 border-sky-500/30">
              
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-400" />
                  <span className="font-bold text-slate-900 dark:text-white">AI Complexity Review</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 ${
                    reviewResult.passed ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-500'
                  }`}>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{reviewResult.passed ? "Logic Correct" : "Needs Fix"}</span>
                  </span>
                  <span className="text-xl font-black px-3 py-1 rounded-xl bg-sky-600 text-white">
                    {reviewResult.score} / 100
                  </span>
                </div>
              </div>

              {/* Big O Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-center font-mono">
                  <p className="text-[10px] uppercase text-slate-400 font-sans font-semibold">Time Complexity</p>
                  <p className="text-xl font-bold text-sky-600 dark:text-sky-400 mt-1">{reviewResult.timeComplexity}</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-center font-mono">
                  <p className="text-[10px] uppercase text-slate-400 font-sans font-semibold">Space Complexity</p>
                  <p className="text-xl font-bold text-purple-600 dark:text-purple-400 mt-1">{reviewResult.spaceComplexity}</p>
                </div>
              </div>

              <p className="text-sm font-medium text-slate-700 dark:text-slate-200 leading-relaxed">
                {reviewResult.feedback}
              </p>

              <div className="space-y-2">
                <p className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> Principal Refactoring Suggestions:
                </p>
                <ul className="list-disc list-inside space-y-1 text-xs text-slate-600 dark:text-slate-300 pl-1">
                  {reviewResult.improvements.map((im, i) => <li key={i}>{im}</li>)}
                </ul>
              </div>

            </GlassCard>
          )}

        </div>

      </div>

    </div>
  );
};
