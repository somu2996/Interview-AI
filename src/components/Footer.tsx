import React from 'react';
import { Sparkles, Github, Twitter, Linkedin, Heart } from 'lucide-react';
import { PageRoute } from '../types';

interface FooterProps {
  onNavigate: (page: PageRoute) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Col 1 */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center space-x-2.5 cursor-pointer" onClick={() => onNavigate('home')}>
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-slate-900 dark:text-white">PrepAI Studio</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              Empowering engineers and job seekers with Gemini-powered mock interviews, instant resume ATS audits, and real-time algorithmic code reviews.
            </p>
            <div className="flex space-x-3 pt-2">
              <a href="https://github.com/somu2996" target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-slate-200 dark:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors" title="GitHub Profile">
                <Github className="w-4 h-4" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-slate-200 dark:bg-slate-800 hover:text-sky-500 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="https://www.linkedin.com/in/soumyadip-mandal-45b621333/" target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-slate-200 dark:bg-slate-800 hover:text-blue-600 transition-colors" title="LinkedIn Profile">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-4">Core Platform</h4>
            <ul className="space-y-2.5 text-sm">
              <li><button onClick={() => onNavigate('mock-interview')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">AI Mock Interview</button></li>
              <li><button onClick={() => onNavigate('resume-analyzer')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Resume ATS Scanner</button></li>
              <li><button onClick={() => onNavigate('coding-practice')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Algorithmic Practice IDE</button></li>
              <li><button onClick={() => onNavigate('career-chat')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">PrepAI Career Mentor</button></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-4">Account</h4>
            <ul className="space-y-2.5 text-sm">
              <li><button onClick={() => onNavigate('dashboard')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Candidate Dashboard</button></li>
              <li><button onClick={() => onNavigate('profile')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Profile & Target Role</button></li>
              <li><button onClick={() => onNavigate('login')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Sign In / Demo Mode</button></li>
              <li><button onClick={() => onNavigate('signup')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Create Free Account</button></li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-4">Support & Trust</h4>
            <ul className="space-y-2.5 text-sm">
              <li><button onClick={() => onNavigate('contact')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Help Center & FAQ</button></li>
              <li><button onClick={() => onNavigate('contact')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Contact Engineering</button></li>
              <li className="text-xs text-slate-400 pt-2">Protected by enterprise Google Cloud Run & Firebase Firestore security rules.</li>
            </ul>
          </div>

        </div>

        <div className="border-t border-slate-200 dark:border-slate-800/80 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400">
          <p>© {new Date().getFullYear()} PrepAI Studio Platform. All rights reserved.</p>
          <p className="flex items-center space-x-1 mt-2 sm:mt-0 font-medium text-slate-600 dark:text-slate-300">
            <span>Made by Somu</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 mx-1.5 inline" />
          </p>
        </div>
      </div>
    </footer>
  );
};
