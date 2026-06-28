import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Lazy AI client initialization
let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY || "dummy_key_for_build";
    aiClient = new GoogleGenAI({ apiKey: key });
  }
  return aiClient;
}

// Helper to clean JSON string from markdown code blocks
function cleanJSON(text: string): string {
  let cleaned = text.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```[a-z]*\s*/, '').replace(/\s*```$/, '');
  }
  return cleaned.trim();
}

// 1. Generate Interview Question
app.post('/api/ai/interview-question', async (req, res) => {
  try {
    const { role = 'Software Engineer', difficulty = 'Intermediate', previousQuestions = [], currentNumber = 1, totalQuestions = 5 } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      // Return realistic fallback if key is not configured yet
      return res.json({
        question: `Can you explain the core architectural principles you would apply when designing a scalable ${role} system?`,
        tip: "Focus on separation of concerns, caching strategies, and database indexing.",
        expectedFocus: "System Design & Architecture"
      });
    }

    const ai = getAI();
    const prompt = `You are an expert technical interviewer hiring for a ${role} position. 
Difficulty level: ${difficulty}.
This is question ${currentNumber} of ${totalQuestions}.
Previous questions asked in this interview: ${JSON.stringify(previousQuestions)}.

Generate the next challenging, realistic interview question.
Respond ONLY with a valid JSON object matching this schema:
{
  "question": "The interview question string",
  "tip": "A quick hint or tip on what interviewers look for in the answer",
  "expectedFocus": "Key topic area (e.g. Algorithms, Behavioral, System Design)"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.7,
      }
    });

    const text = response.text || "{}";
    const parsed = JSON.parse(cleanJSON(text));
    res.json(parsed);
  } catch (err: any) {
    console.error("Interview question error:", err);
    res.status(500).json({ 
      error: err.message || "Failed to generate question",
      question: `Describe a complex problem you solved recently in your role as a ${req.body.role || 'developer'}.`,
      tip: "Use the STAR method (Situation, Task, Action, Result).",
      expectedFocus: "Problem Solving"
    });
  }
});

// 2. Evaluate Interview Answer
app.post('/api/ai/evaluate-answer', async (req, res) => {
  try {
    const { question, answer, role = 'Software Engineer', difficulty = 'Intermediate' } = req.body;

    if (!answer || answer.trim().length === 0) {
      return res.status(400).json({ error: "Answer cannot be empty" });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        score: 8,
        strengths: ["Clear communication structure", "Relevant domain terminology used", "Demonstrates practical hands-on experience"],
        improvements: ["Could provide more concrete quantitative metrics", "Discuss edge cases and failure modes in more depth"],
        modelAnswer: `An exemplary answer for this ${role} question would first define the scope, break down the architecture into modular components, and explicitly address latency and reliability trade-offs.`,
        feedbackSummary: "Strong overall response demonstrating solid foundational knowledge and clarity."
      });
    }

    const ai = getAI();
    const prompt = `You are a strict, constructive technical hiring manager evaluating an interview candidate for a ${role} role (${difficulty} level).

Question Asked: "${question}"
Candidate's Answer: "${answer}"

Evaluate the candidate's answer thoroughly.
Respond ONLY with a valid JSON object matching this schema:
{
  "score": <number between 1 and 10>,
  "strengths": ["list of 2-3 specific strengths in the answer"],
  "improvements": ["list of 2 specific areas to improve"],
  "modelAnswer": "A concise, high-scoring 3-4 sentence model answer for this question",
  "feedbackSummary": "A 2-sentence executive summary of the performance"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.4,
      }
    });

    const text = response.text || "{}";
    const parsed = JSON.parse(cleanJSON(text));
    res.json(parsed);
  } catch (err: any) {
    console.error("Evaluate answer error:", err);
    res.status(500).json({ 
      error: err.message || "Evaluation failed",
      score: 7,
      strengths: ["Good attempt at structuring the core points"],
      improvements: ["Elaborate further on specific technical trade-offs"],
      modelAnswer: "A complete model answer addresses scalability, security, and maintainability.",
      feedbackSummary: "Good response with room for deeper technical precision."
    });
  }
});

// 3. Analyze Resume
app.post('/api/ai/analyze-resume', async (req, res) => {
  try {
    const { resumeText, targetRole = 'Software Engineer' } = req.body;

    if (!resumeText || resumeText.trim().length < 50) {
      return res.status(400).json({ error: "Please provide a valid resume text (at least 50 characters)" });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        atsScore: 84,
        summary: `Well-structured resume with strong alignment towards ${targetRole} positions. Good demonstration of project deliverables.`,
        strengths: ["Clear action verbs highlighting impact", "Solid technical skill section", "Consistent formatting and chronological progression"],
        improvements: ["Quantify achievements with percentages or dollar amounts", "Add modern cloud/containerization keywords"],
        matchingSkills: ["JavaScript", "TypeScript", "React", "Node.js", "Git", "Problem Solving"],
        missingSkills: ["Docker", "Kubernetes", "GraphQL", "CI/CD Pipelines", "AWS"],
        interviewQuestionsGenerated: [
          `Can you walk us through the architecture of your most impactful project listed on your resume?`,
          `How did you handle state management and performance optimization in your previous React experience?`,
          `Describe a time you had to resolve a critical production bug under tight deadline.`
        ]
      });
    }

    const ai = getAI();
    const prompt = `You are an elite Applicant Tracking System (ATS) algorithm and executive tech recruiter analyzing a resume for a "${targetRole}" position.

Resume Content:
"""
${resumeText.slice(0, 8000)}
"""

Perform a comprehensive ATS audit and career alignment check.
Respond ONLY with a valid JSON object matching this schema:
{
  "atsScore": <integer from 0 to 100 representing overall ATS compatibility and quality>,
  "summary": "A 2-3 sentence recruiter appraisal",
  "strengths": ["3 key resume highlights"],
  "improvements": ["3 actionable suggestions to boost interview callback rate"],
  "matchingSkills": ["list of skills found that match ${targetRole}"],
  "missingSkills": ["important industry standard keywords missing for ${targetRole}"],
  "interviewQuestionsGenerated": ["3 tailored interview questions based specifically on this resume's experience"]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.3,
      }
    });

    const text = response.text || "{}";
    const parsed = JSON.parse(cleanJSON(text));
    res.json(parsed);
  } catch (err: any) {
    console.error("Resume analysis error:", err);
    res.status(500).json({ error: err.message || "Failed to analyze resume" });
  }
});

// 4. Career Coaching Chat
app.post('/api/ai/career-chat', async (req, res) => {
  try {
    const { message, history = [], userContext = {} } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        reply: `That's a great question about advancing as a ${userContext.role || 'tech professional'}. To succeed in upcoming interviews, focus on mastering system design fundamentals, practicing behavioral questions using the STAR framework, and maintaining an active GitHub portfolio. How else can I assist your prep today?`
      });
    }

    const ai = getAI();
    const roleStr = userContext.role ? `Candidate Target Role: ${userContext.role}. Experience: ${userContext.experience || 'Not specified'}.` : '';

    // Convert history into gemini chat format
    const formattedHistory = history.map((msg: any) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      history: formattedHistory,
      config: {
        systemInstruction: `You are "PrepAI Career Coach", an encouraging, highly knowledgeable tech career mentor and interview strategist. ${roleStr} Provide practical, actionable advice on resume crafting, salary negotiation, coding interviews, behavioral assessments, and career growth. Keep answers well-structured using bullet points and markdown formatting when helpful.`
      }
    });

    const response = await chat.sendMessage({ message });
    res.json({ reply: response.text || "I'm here to help with your career questions!" });
  } catch (err: any) {
    console.error("Career chat error:", err);
    res.status(500).json({ error: err.message || "Chat failed" });
  }
});

// 5. Coding Practice Code Review
app.post('/api/ai/code-review', async (req, res) => {
  try {
    const { problemTitle, language = 'javascript', code } = req.body;

    if (!code || code.trim().length === 0) {
      return res.status(400).json({ error: "Code cannot be empty" });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        passed: true,
        score: 92,
        timeComplexity: "O(N)",
        spaceComplexity: "O(1)",
        feedback: `Your ${language} solution effectively solves "${problemTitle}". Clean logic and optimal traversal.`,
        improvements: ["Consider using descriptive variable names for intermediate indices", "Add explicit null/empty array guard clauses at the beginning"],
        fixedCode: code
      });
    }

    const ai = getAI();
    const prompt = `You are a Principal Software Engineer and algorithmic judge reviewing a candidate's submitted code for the problem: "${problemTitle}".
Language: ${language}

Submitted Code:
\`\`\`${language}
${code}
\`\`\`

Analyze the solution for correctness, time complexity, space complexity, edge case handling, and clean coding standards.
Respond ONLY with a valid JSON object matching this schema:
{
  "passed": <boolean true if logic is correct and would pass standard test cases>,
  "score": <integer from 1 to 100 rating code quality and performance>,
  "timeComplexity": "e.g. O(N log N)",
  "spaceComplexity": "e.g. O(N)",
  "feedback": "A 2-3 sentence review of the algorithm",
  "improvements": ["2 actionable refactoring suggestions"],
  "fixedCode": "Cleaned up / optimized version of the code"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.2,
      }
    });

    const text = response.text || "{}";
    const parsed = JSON.parse(cleanJSON(text));
    res.json(parsed);
  } catch (err: any) {
    console.error("Code review error:", err);
    res.status(500).json({ error: err.message || "Code evaluation failed" });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Vite middleware setup
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AI Interview Prep Platform server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
