

export type User = {
  id: string;
  email: string;
  name: string;
  avatar_url: string | null;
  created_at: string;
};

export type Paper = {
  id: string;
  user_id: string;
  title: string;
  author: string;
  file_url: string;
  upload_date: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  progress: number;
  status: 'reading' | 'completed' | 'archived';
};

export type StudySession = {
  id: string;
  user_id: string;
  paper_id: string;
  duration: number;
  last_accessed: string;
  notes_count: number;
};

export type Note = {
  id: string;
  user_id: string;
  paper_id: string;
  content: string;
  page_number: number;
  created_at: string;
};

export type Flashcard = {
  id: string;
  user_id: string;
  paper_id: string;
  question: string;
  answer: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
};

export type QuizAttempt = {
  id: string;
  user_id: string;
  paper_id: string;
  score: number;
  completed_at: string;
};

export type MindMap = {
  id: string;
  user_id: string;
  paper_id: string;
  nodes_data: unknown;
  created_at: string;
};

export type ChatMessage = {
  id: string;
  user_id: string;
  paper_id: string | null;
  message: string;
  role: 'user' | 'assistant';
  timestamp: string;
};
