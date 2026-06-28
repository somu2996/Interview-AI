import React, { useState } from 'react';
import { Sparkles, Sun, Moon, LogOut, User as UserIcon, LayoutDashboard, FileText, Code, MessageSquare, Mic, Menu, X, ShieldCheck, Github, Linkedin } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { PageRoute } from '../types';

interface NavbarProps {
  currentPage: PageRoute;
  onNavigate: (page: PageRoute) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate }) => {
  const { user, isDemo, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);

  const navItems: { id: PageRoute; label: string; icon: React.ReactNode; requiresAuth?: boolean }[] = [
    { id: 'home', label: 'Home', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" />, requiresAuth: true },
    { id: 'admin', label: 'Admin', icon: <ShieldCheck className="w-4 h-4 text-rose-500" /> },
    { id: 'mock-interview', label: 'AI Interview', icon: <Mic className="w-4 h-4 text-emerald-500" /> },
    { id: 'resume-analyzer', label: 'Resume ATS', icon: <FileText className="w-4 h-4 text-amber-500" /> },
    { id: 'coding-practice', label: 'Coding IDE', icon: <Code className="w-4 h-4 text-sky-500" /> },
    { id: 'career-chat', label: 'AI Coach', icon: <MessageSquare className="w-4 h-4 text-purple-500" /> },
  ];

  const handleNav = (id: PageRoute) => {
    onNavigate(id);
    setMobileMenuOpen(false);
    setProfileDropdown(false);
  };

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 dark:bg-slate-900/80 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => handleNav('home')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Sparkles className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent tracking-tight">
                PrepAI
              </span>
              <span className="hidden sm:inline-block ml-1.5 px-2 py-0.5 text-[10px] font-semibold uppercase bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 rounded-full border border-indigo-200 dark:border-indigo-800">
                Studio
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navItems.map((item) => {
              if (item.requiresAuth && !user) return null;
              const active = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                    active
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-semibold shadow-sm border border-indigo-100 dark:border-indigo-900/50'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right Action Icons & User Controls */}
          <div className="hidden md:flex items-center space-x-2">
            
            <a
              href="https://github.com/somu2996"
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shadow-inner"
              title="GitHub Profile"
            >
              <Github className="w-5 h-5" />
            </a>

            <a
              href="https://www.linkedin.com/in/soumyadip-mandal-45b621333/"
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-xl text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shadow-inner"
              title="LinkedIn Profile"
            >
              <Linkedin className="w-5 h-5" />
            </a>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-amber-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shadow-inner"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-600" />}
            </button>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdown(!profileDropdown)}
                  className="flex items-center space-x-2 p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:border-indigo-500 transition-all"
                >
                  <img
                    src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || 'U')}&background=6366f1&color=fff`}
                    alt="Avatar"
                    className="w-8 h-8 rounded-lg object-cover"
                  />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200 max-w-[110px] truncate">
                    {user.displayName || 'Candidate'}
                  </span>
                  {isDemo && (
                    <span className="text-[10px] px-1.5 py-0.2 bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded font-mono">
                      DEMO
                    </span>
                  )}
                </button>

                {/* Dropdown menu */}
                <AnimatePresence>
                  {profileDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 4, scale: 0.96 }}
                      transition={{ duration: 0.15, ease: 'easeOut' }}
                      className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 py-2 z-50"
                    >
                      <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                        <p className="text-xs font-semibold text-slate-400 uppercase">Signed in as</p>
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">{user.email || 'Candidate User'}</p>
                        <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium mt-0.5">{user.targetRole || 'Software Engineer'}</p>
                      </div>

                      <button
                        onClick={() => handleNav('profile')}
                        className="w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-slate-800 flex items-center space-x-2 transition-colors"
                      >
                        <UserIcon className="w-4 h-4 text-slate-400" />
                        <span>My Profile Settings</span>
                      </button>

                      <button
                        onClick={() => handleNav('contact')}
                        className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-slate-800 flex items-center space-x-2 transition-colors"
                      >
                        <MessageSquare className="w-4 h-4 text-slate-400" />
                        <span>Help & Support</span>
                      </button>

                      <div className="border-t border-slate-100 dark:border-slate-800 mt-1 pt-1">
                        <button
                          onClick={() => {
                            logout();
                            setProfileDropdown(false);
                            onNavigate('home');
                          }}
                          className="w-full text-left px-4 py-2.5 text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center space-x-2 font-medium transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleNav('login')}
                  className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Log In
                </button>
                <button
                  onClick={() => handleNav('signup')}
                  className="px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-md shadow-indigo-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>

          {/* Mobile hamburger button */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-500 bg-slate-100 dark:bg-slate-800 dark:text-slate-300"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-600" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="md:hidden px-4 pt-2 pb-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 space-y-2 overflow-hidden"
          >
            {navItems.map((item) => {
              if (item.requiresAuth && !user) return null;
              const active = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`w-full min-h-[44px] flex items-center space-x-3 px-4 py-3 rounded-xl text-left text-base font-medium transition-all active:scale-[0.98] ${
                    active
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}

            <div className="pt-2 pb-2 flex items-center justify-start space-x-3 px-2">
              <a
                href="https://github.com/somu2996"
                target="_blank"
                rel="noreferrer"
                className="flex items-center space-x-2 py-2 px-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-medium"
              >
                <Github className="w-4 h-4" />
                <span>GitHub</span>
              </a>
              <a
                href="https://www.linkedin.com/in/soumyadip-mandal-45b621333/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center space-x-2 py-2 px-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 text-sm font-medium"
              >
                <Linkedin className="w-4 h-4" />
                <span>LinkedIn</span>
              </a>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col space-y-2">
              {user ? (
                <>
                  <div className="flex items-center space-x-3 px-3 py-2">
                    <img
                      src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || 'U')}&background=6366f1&color=fff`}
                      alt="Avatar"
                      className="w-10 h-10 rounded-xl object-cover"
                    />
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">{user.displayName || 'Candidate'}</p>
                      <p className="text-xs text-slate-400 truncate max-w-[200px]">{user.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleNav('profile')}
                    className="w-full min-h-[44px] py-2.5 px-4 rounded-xl text-left text-sm font-medium bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                  >
                    My Profile
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                      onNavigate('home');
                    }}
                    className="w-full min-h-[44px] py-2.5 px-4 rounded-xl text-left text-sm font-medium bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleNav('login')}
                    className="min-h-[44px] py-2.5 text-center rounded-xl font-medium bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                  >
                    Log In
                  </button>
                  <button
                    onClick={() => handleNav('signup')}
                    className="min-h-[44px] py-2.5 text-center rounded-xl font-semibold bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
