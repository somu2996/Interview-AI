/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { PageRoute } from './types';
import { motion, AnimatePresence } from 'motion/react';

// Pages
import { Home } from './pages/Home';
import { Dashboard } from './pages/Dashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { MockInterview } from './pages/MockInterview';
import { ResumeAnalyzer } from './pages/ResumeAnalyzer';
import { CodingPractice } from './pages/CodingPractice';
import { CareerChat } from './pages/CareerChat';
import { Profile } from './pages/Profile';
import { Contact } from './pages/Contact';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageRoute>('home');

  // Scroll to top on navigation change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={setCurrentPage} />;
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentPage} />;
      case 'admin':
        return <AdminDashboard />;
      case 'mock-interview':
        return <MockInterview onNavigate={setCurrentPage} />;
      case 'resume-analyzer':
        return <ResumeAnalyzer onNavigate={setCurrentPage} />;
      case 'coding-practice':
        return <CodingPractice />;
      case 'career-chat':
        return <CareerChat />;
      case 'profile':
        return <Profile />;
      case 'contact':
        return <Contact />;
      case 'login':
        return <Login onNavigate={setCurrentPage} />;
      case 'signup':
        return <Signup onNavigate={setCurrentPage} />;
      default:
        return <Home onNavigate={setCurrentPage} />;
    }
  };

  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white transition-colors duration-300 antialiased overflow-x-hidden">
            <Navbar currentPage={currentPage} onNavigate={setCurrentPage} />
            
            <main className="flex-1 relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentPage}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.2, ease: 'easeInOut' }}
                  className="w-full h-full"
                >
                  {renderPage()}
                </motion.div>
              </AnimatePresence>
            </main>

            <Footer onNavigate={setCurrentPage} />
          </div>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
