import React, { useState } from 'react';
import { User as UserIcon, Mail, Briefcase, Award, Save, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { GlassCard } from '../components/GlassCard';

export const Profile: React.FC = () => {
  const { user, updateUserProfile } = useAuth();
  
  const [name, setName] = useState(user?.displayName || '');
  const [targetRole, setTargetRole] = useState(user?.targetRole || 'Software Engineer');
  const [experienceLevel, setExperienceLevel] = useState(user?.experienceLevel || 'Mid-Level (3-5 yrs)');
  const [bio, setBio] = useState(user?.bio || '');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);
    try {
      await updateUserProfile({
        displayName: name,
        targetRole,
        experienceLevel: experienceLevel as any,
        bio
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
        <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <UserIcon className="w-6 h-6 text-indigo-500" />
          <span>Candidate Profile Settings</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">Configure your default AI evaluation target role and career telemetry.</p>
      </div>

      <GlassCard className="p-8 space-y-8">
        
        {savedSuccess && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs sm:text-sm font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            <span>Profile telemetry successfully synchronized to Cloud Firestore!</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          
          <div className="flex items-center gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <img
              src={user?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'Candidate')}&background=6366f1&color=fff&size=150`}
              alt="Avatar"
              className="w-16 h-16 rounded-2xl object-cover shadow-lg"
            />
            <div>
              <p className="text-base font-bold text-slate-900 dark:text-white">{user?.email || 'Demo Candidate'}</p>
              <p className="text-xs text-slate-400 font-mono">UID: {user?.uid || 'anon-preview'}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-2">Display Name</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-2">Account Email (Read Only)</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  disabled
                  value={user?.email || ''}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-slate-400 text-sm cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-2">Default Benchmark Role</label>
              <div className="relative">
                <Briefcase className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="e.g. Full Stack Architect"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-2">Seniority Tier</label>
              <div className="relative">
                <Award className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <select
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value as any)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm cursor-pointer font-medium appearance-none"
                >
                  <option value="Entry-Level (0-2 yrs)">Entry-Level (0-2 yrs)</option>
                  <option value="Mid-Level (3-5 yrs)">Mid-Level (3-5 yrs)</option>
                  <option value="Senior (6+ yrs)">Senior (6+ yrs)</option>
                  <option value="Lead / Executive">Lead / Executive</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-2">Candidate Bio & Technical Goals</label>
            <textarea
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Briefly describe your stack, recent deliverables, or upcoming target companies..."
              className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-sm shadow-md flex items-center gap-2 hover:from-indigo-500 hover:to-purple-500 transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? "Saving Changes..." : "Save Profile Telemetry"}</span>
            </button>
          </div>

        </form>

      </GlassCard>

    </div>
  );
};
