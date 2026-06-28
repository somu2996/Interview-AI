export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  fullName?: string;
  role?: string;
  photoURL: string | null;
  targetRole?: string;
  experienceLevel?: 'Entry-Level (0-2 yrs)' | 'Mid-Level (3-5 yrs)' | 'Senior (6+ yrs)' | 'Lead / Executive';
  bio?: string;
  createdAt?: string;
}

export interface InterviewQuestionResult {
  questionNumber: number;
  question: string;
  tip?: string;
  expectedFocus?: string;
  answer?: string;
  score?: number;
  strengths?: string[];
  improvements?: string[];
  modelAnswer?: string;
  feedbackSummary?: string;
  timestamp?: string;
}

export interface InterviewSession {
  id?: string;
  userId: string;
  title: string;
  role: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Staff/Principal';
  type: 'Behavioral' | 'Technical' | 'System Design' | 'Full Mock';
  score: number;
  feedbackSummary: string;
  questions: InterviewQuestionResult[];
  createdAt: string;
  timestamp?: string;
  durationMinutes: number;
}

export interface ResumeAnalysisRecord {
  id?: string;
  userId: string;
  title: string;
  atsScore: number;
  summary: string;
  strengths: string[];
  improvements: string[];
  suggestions?: string[];
  matchingSkills: string[];
  missingSkills: string[];
  interviewQuestionsGenerated: string[];
  createdAt: string;
  uploadDate?: string;
}

export interface CodingProblem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  description: string;
  examples: { input: string; output: string; explanation?: string }[];
  constraints: string[];
  starterCode: {
    javascript: string;
    typescript: string;
    python: string;
  };
}

export interface CodingPracticeRecord {
  id?: string;
  userId: string;
  problemId: string;
  problemTitle: string;
  language: string;
  code: string;
  passed: boolean;
  score: number;
  timeComplexity: string;
  spaceComplexity: string;
  feedback: string;
  improvements: string[];
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

export type PageRoute = 
  | 'home'
  | 'login'
  | 'signup'
  | 'dashboard'
  | 'admin'
  | 'mock-interview'
  | 'resume-analyzer'
  | 'coding-practice'
  | 'career-chat'
  | 'profile'
  | 'contact';
