import React, { useState } from 'react';
import { Sparkles, Mic, Play, RefreshCw, CheckCircle2, AlertCircle, ArrowRight, Award, ShieldAlert, BookOpen } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { PageRoute, InterviewQuestionResult } from '../types';
import { GlassCard } from '../components/GlassCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface MockInterviewProps {
  onNavigate: (page: PageRoute) => void;
}

export const MockInterview: React.FC<MockInterviewProps> = ({ onNavigate }) => {
  const { user, isDemo } = useAuth();
  
  // Setup Configuration State
  const [sessionActive, setSessionActive] = useState(false);
  const [role, setRole] = useState(user?.targetRole || 'Software Engineer');
  const [difficulty, setDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced' | 'Staff/Principal'>('Intermediate');
  const [totalQuestions, setTotalQuestions] = useState(3);

  // Active Interview State
  const [currentNum, setCurrentNum] = useState(1);
  const [questionData, setQuestionData] = useState<{ question: string; tip?: string; expectedFocus?: string } | null>(null);
  const [answerInput, setAnswerInput] = useState('');
  const [historyResults, setHistoryResults] = useState<InterviewQuestionResult[]>([]);
  const [latestEval, setLatestEval] = useState<InterviewQuestionResult | null>(null);

  // Status & Error States
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('Generating question...');
  const [error, setError] = useState<string | null>(null);

  // 1. Fetch Question from API with Retries
  const fetchQuestion = async (num: number, prevList: any[], retryCount = 0): Promise<void> => {
    setLoading(true);
    setLoadingMsg(`Generating AI interview question ${num}...`);
    setError(null);
    setLatestEval(null);
    setAnswerInput('');

    try {
      const res = await fetch('/api/ai/interview-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role,
          difficulty,
          previousQuestions: prevList.map(p => p.question),
          currentNumber: num,
          totalQuestions
        })
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setQuestionData(data);
      setCurrentNum(num);
    } catch (err: any) {
      console.error("Fetch question error:", err);
      if (retryCount < 2) {
        setLoadingMsg(`Retrying AI connection (attempt ${retryCount + 2})...`);
        setTimeout(() => fetchQuestion(num, prevList, retryCount + 1), 1500);
        return;
      }
      setError(err.message || 'Failed to reach Gemini AI service.');
    } finally {
      setLoading(false);
    }
  };

  const startInterview = () => {
    setSessionActive(true);
    setHistoryResults([]);
    fetchQuestion(1, []);
  };

  // 2. Submit Answer for Evaluation
  const submitAnswer = async (retryCount = 0) => {
    if (!answerInput.trim() || !questionData) return;
    setLoading(true);
    setLoadingMsg("Gemini Principal Engineer evaluating your response...");
    setError(null);

    try {
      const res = await fetch('/api/ai/evaluate-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: questionData.question,
          answer: answerInput,
          role,
          difficulty
        })
      });

      if (!res.ok) throw new Error(`Evaluation status ${res.status}`);
      const evalObj = await res.json();

      const nowStr = new Date().toISOString();
      const item: InterviewQuestionResult = {
        questionNumber: currentNum,
        question: questionData.question,
        tip: questionData.tip,
        expectedFocus: questionData.expectedFocus,
        answer: answerInput,
        score: evalObj.score,
        strengths: evalObj.strengths || [],
        improvements: evalObj.improvements || [],
        modelAnswer: evalObj.modelAnswer,
        feedbackSummary: evalObj.feedbackSummary,
        timestamp: nowStr
      };

      setLatestEval(item);
      const updatedList = [...historyResults, item];
      setHistoryResults(updatedList);

      // If finished all questions, save session to Firestore
      if (currentNum >= totalQuestions) {
        const avgScore = Number((updatedList.reduce((acc, q) => acc + (q.score || 7), 0) / updatedList.length).toFixed(1));
        try {
          await addDoc(collection(db, "interviews"), {
            userId: user?.uid || "anon",
            title: `${difficulty} ${role} Round`,
            role,
            difficulty,
            type: 'Technical',
            score: avgScore,
            feedbackSummary: evalObj.feedbackSummary || "Comprehensive mock interview completed.",
            questions: updatedList,
            createdAt: nowStr,
            timestamp: nowStr,
            durationMinutes: totalQuestions * 8
          });
        } catch (e) {
          console.error("Failed to save session to firestore:", e);
        }
      }
    } catch (err: any) {
      if (retryCount < 2) {
        setTimeout(() => submitAnswer(retryCount + 1), 1500);
        return;
      }
      setError(err.message || "Failed to analyze answer.");
    } finally {
      setLoading(false);
    }
  };

  // Render Setup Configuration View
  if (!sessionActive) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
        <GlassCard className="p-8 sm:p-12 space-y-8">
          <div className="text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-500 mx-auto flex items-center justify-center border border-emerald-500/20">
              <Mic className="w-7 h-7" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              AI Mock Interview Simulator
            </h1>
            <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-sm">
              Configure your interview simulation parameters. Our Gemini 2.5 AI will act as a Principal Hiring Manager asking challenging follow-ups.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-2">Target Role</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-2">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e: any) => setDifficulty(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm font-medium cursor-pointer focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Beginner">Beginner (Intern / L3)</option>
                <option value="Intermediate">Intermediate (Mid L4)</option>
                <option value="Advanced">Advanced (Senior L5)</option>
                <option value="Staff/Principal">Staff/Principal (L6+)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-2">Length</label>
              <select
                value={totalQuestions}
                onChange={(e) => setTotalQuestions(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm font-medium cursor-pointer focus:ring-2 focus:ring-indigo-500"
              >
                <option value={2}>2 Questions (Quick Sprint)</option>
                <option value={3}>3 Questions (Standard)</option>
                <option value={5}>5 Questions (Full Loop)</option>
              </select>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex justify-center">
            <button
              onClick={startInterview}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white font-bold text-base shadow-xl shadow-emerald-500/20 transition-all flex items-center gap-3 transform hover:-translate-y-0.5"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>Begin AI Interview Screen</span>
            </button>
          </div>
        </GlassCard>
      </div>
    );
  }

  // Render Active Interview / Finished Summary View
  const isFinishedAll = currentNum >= totalQuestions && latestEval !== null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      
      {/* Top Breadcrumb Rail */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 uppercase tracking-wider">
            LIVE MOCK • {difficulty} {role}
          </span>
        </div>
        <button onClick={() => setSessionActive(false)} className="text-xs text-slate-400 hover:text-rose-500 font-medium transition-colors">
          Exit Session
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-800 flex items-center justify-between text-rose-600 dark:text-rose-300 text-sm">
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
          <button onClick={() => fetchQuestion(currentNum, historyResults)} className="px-3 py-1.5 bg-rose-600 text-white rounded-lg text-xs font-bold flex items-center gap-1 hover:bg-rose-500 shrink-0">
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry</span>
          </button>
        </div>
      )}

      {loading ? (
        <GlassCard className="py-20">
          <LoadingSpinner message={loadingMsg} size="lg" />
        </GlassCard>
      ) : isFinishedAll ? (
        /* Final Interview Loop Wrap-up Scorecard */
        <GlassCard className="p-8 sm:p-12 space-y-8 animate-in fade-in duration-300">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-emerald-500 to-indigo-600 text-white mx-auto flex items-center justify-center shadow-xl">
              <Award className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white">
              Interview Loop Completed
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xl mx-auto">
              Great practice! Here is the aggregated feedback from your {totalQuestions}-question technical session.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/80 text-center">
              <p className="text-xs font-semibold text-slate-400 uppercase">Average Score</p>
              <p className="text-4xl font-black text-indigo-600 dark:text-indigo-400 mt-2">
                {(historyResults.reduce((a, b) => a + (b.score || 7), 0) / historyResults.length).toFixed(1)} / 10
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/80 text-center">
              <p className="text-xs font-semibold text-slate-400 uppercase">Questions Simulated</p>
              <p className="text-4xl font-black text-slate-800 dark:text-white mt-2">{historyResults.length}</p>
            </div>
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/80 text-center">
              <p className="text-xs font-semibold text-slate-400 uppercase">Status</p>
              <p className="text-lg font-bold text-emerald-500 mt-4 flex items-center justify-center gap-1">
                <CheckCircle2 className="w-5 h-5" />
                <span>Ready for Onsite</span>
              </p>
            </div>
          </div>

          {/* Detailed Question breakdown */}
          <div className="space-y-4 pt-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Response Breakdown</h3>
            {historyResults.map((item, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Question {item.questionNumber}</span>
                  <span className="text-sm font-black px-2.5 py-0.5 rounded bg-indigo-500/10 text-indigo-500">{item.score} / 10</span>
                </div>
                <p className="font-bold text-slate-900 dark:text-white">{item.question}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                  <strong>Your Answer:</strong> {item.answer}
                </p>
                <p className="text-xs text-emerald-600 dark:text-emerald-400">
                  <strong>Summary:</strong> {item.feedbackSummary}
                </p>
              </div>
            ))}
          </div>

          <div className="pt-6 flex items-center justify-center gap-4">
            <button onClick={() => setSessionActive(false)} className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm">
              Return to Dashboard
            </button>
          </div>
        </GlassCard>
      ) : (
        /* Active Question & Evaluation Workspace */
        <div className="space-y-6">
          
          <GlassCard className="p-6 sm:p-10 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Question {currentNum} of {totalQuestions}
              </span>
              {questionData?.expectedFocus && (
                <span className="text-xs px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono">
                  Focus: {questionData.expectedFocus}
                </span>
              )}
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white leading-relaxed">
              {questionData?.question || "Loading interview prompt..."}
            </h2>

            {questionData?.tip && !latestEval && (
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-2 text-amber-700 dark:text-amber-300 text-xs">
                <Sparkles className="w-4 h-4 shrink-0 text-amber-500" />
                <span><strong>Interviewer Tip:</strong> {questionData.tip}</span>
              </div>
            )}

            {/* Answer Textarea */}
            {!latestEval ? (
              <div className="space-y-4 pt-2">
                <textarea
                  rows={6}
                  value={answerInput}
                  onChange={(e) => setAnswerInput(e.target.value)}
                  placeholder="Structure your response clearly using the STAR methodology (Situation, Task, Action, Result) or articulate architectural trade-offs..."
                  className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                />
                <div className="flex justify-end">
                  <button
                    disabled={!answerInput.trim()}
                    onClick={() => submitAnswer()}
                    className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2"
                  >
                    <span>Submit Answer for AI Review</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              /* Display Instant AI Feedback */
              <div className="space-y-6 pt-4 animate-in fade-in duration-200">
                <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-indigo-500/30 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
                    <div className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-amber-400" />
                      <span className="font-bold text-slate-900 dark:text-white">Evaluation Verdict</span>
                    </div>
                    <span className="text-xl font-black px-3 py-1 rounded-xl bg-indigo-600 text-white">
                      {latestEval.score} / 10
                    </span>
                  </div>

                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    {latestEval.feedbackSummary}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
                    <div className="p-3.5 rounded-xl bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20 space-y-1">
                      <p className="font-bold flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Strengths</p>
                      <ul className="list-disc list-inside space-y-1 pl-1">
                        {latestEval.strengths?.map((st, i) => <li key={i}>{st}</li>)}
                      </ul>
                    </div>

                    <div className="p-3.5 rounded-xl bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/20 space-y-1">
                      <p className="font-bold flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5 text-amber-500" /> Areas to Refine</p>
                      <ul className="list-disc list-inside space-y-1 pl-1">
                        {latestEval.improvements?.map((im, i) => <li key={i}>{im}</li>)}
                      </ul>
                    </div>
                  </div>

                  {latestEval.modelAnswer && (
                    <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 space-y-1">
                      <p className="font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" /> Exemplary Model Answer:</p>
                      <p className="leading-relaxed">{latestEval.modelAnswer}</p>
                    </div>
                  )}
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => fetchQuestion(currentNum + 1, historyResults)}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-sm shadow-lg flex items-center gap-2 hover:from-indigo-500 hover:to-purple-500 transition-all"
                  >
                    <span>{currentNum + 1 > totalQuestions ? "View Final Interview Loop Summary" : "Proceed to Next Question"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

          </GlassCard>

        </div>
      )}

    </div>
  );
};
