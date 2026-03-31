import { useEffect, useRef, useState } from 'react';
import { BookOpen, MessageSquare, Map, FileText, ArrowRight, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DashboardCardsProps {
  recentPaper?: {
    title: string;
    author: string;
    progress: number;
    difficulty: string;
    uploadDate: string;
  };
}

function CountUpNumber({ target }: { target: number }) {
  const [count, setCount] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;

    let current = 0;
    const increment = Math.ceil(target / 30);
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(current);
      }
    }, 30);

    return () => clearInterval(timer);
  }, [target]);

  return <span>{count}</span>;
}

function CircleProgress({ value }: { value: number }) {
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (value / 100) * circumference;

  return (
    <svg width="120" height="120">
      {/* Rotate only the circles so the stroke starts at the top, but keep text upright */}
      <g transform="rotate(-90 60 60)">
        <circle
          cx="60"
          cy="60"
          r="45"
          fill="none"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="8"
        />
        <circle
          cx="60"
          cy="60"
          r="45"
          fill="none"
          stroke="url(#gradient)"
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s ease-out' }}
        />
      </g>
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2dd4bf" />
          <stop offset="100%" stopColor="#818cf8" />
        </linearGradient>
      </defs>
      <text x="60" y="65" textAnchor="middle" fontSize="20" fontWeight="bold" fill="#1e293b">
        {value}%
      </text>
    </svg>
  );
}

export function DashboardCards({
  recentPaper = {
    title: 'Deep Learning Fundamentals',
    author: 'Yann LeCun, Yoshua Bengio',
    progress: 65,
    difficulty: 'Hard',
    uploadDate: '2 days ago',
  },
}: DashboardCardsProps) {
  const navigate = useNavigate();
  const [paperStats] = useState({
    papersRead: 12,
    quizzesCompleted: 28,
    notesCreated: 145,
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-text-dark mb-2">{recentPaper.title}</h3>
              <p className="text-sm text-text-muted">{recentPaper.author}</p>
              <p className="text-xs text-text-muted mt-1">Added {recentPaper.uploadDate}</p>
            </div>
            <div
              className={`badge ${
                recentPaper.difficulty === 'Easy'
                  ? 'badge-easy'
                  : recentPaper.difficulty === 'Medium'
                    ? 'badge-medium'
                    : 'badge-hard'
              }`}
            >
              {recentPaper.difficulty}
            </div>
          </div>

          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-text-dark">Reading Progress</span>
              <span className="text-sm font-semibold text-primary-500">{recentPaper.progress}%</span>
            </div>
            <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full transition-all duration-500"
                style={{ width: `${recentPaper.progress}%` }}
              />
            </div>
          </div>

          <button
            onClick={() => navigate('/study/demo-paper')}
            className="inline-flex items-center gap-2 text-primary-500 hover:text-primary-600 font-semibold text-sm transition-colors"
          >
            Continue Studying <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="glass-card flex flex-col items-center justify-center">
          <p className="text-xs text-text-muted mb-3 uppercase tracking-wider">Study Progress</p>
          <CircleProgress value={recentPaper.progress} />
          <p className="text-xs text-text-muted mt-3 text-center">
            Keep it up! You're making great progress
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card space-y-4">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs text-text-muted font-semibold">Papers</span>
          </div>
          <div>
            <p className="text-3xl font-bold text-text-dark">
              <CountUpNumber target={paperStats.papersRead} />
            </p>
            <p className="text-xs text-text-muted mt-1">Total papers read</p>
          </div>
        </div>

        <div className="glass-card space-y-4">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs text-text-muted font-semibold">Quizzes</span>
          </div>
          <div>
            <p className="text-3xl font-bold text-text-dark">
              <CountUpNumber target={paperStats.quizzesCompleted} />
            </p>
            <p className="text-xs text-text-muted mt-1">Quizzes completed</p>
          </div>
        </div>

        <div className="glass-card space-y-4">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs text-text-muted font-semibold">Notes</span>
          </div>
          <div>
            <p className="text-3xl font-bold text-text-dark">
              <CountUpNumber target={paperStats.notesCreated} />
            </p>
            <p className="text-xs text-text-muted mt-1">Notes created</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card">
          <div className="flex items-center gap-3 mb-4">
            <MessageSquare className="w-5 h-5 text-primary-500" />
            <h3 className="font-semibold text-text-dark">AI Chat Assistant</h3>
          </div>
          <div className="space-y-3 mb-4">
            <div className="flex justify-end">
              <div className="bg-primary-500/30 border border-primary-500/50 rounded-lg px-3 py-2 text-sm text-text-dark max-w-xs">
                What are the main concepts?
              </div>
            </div>
            <div className="flex justify-start">
              <div className="bg-white/30 border border-white/40 rounded-lg px-3 py-2 text-sm text-text-dark max-w-xs">
                The paper discusses neural networks...
              </div>
            </div>
          </div>
          <input
            type="text"
            placeholder="Ask your PDF anything..."
            className="input-glass text-sm py-2"
          />
        </div>

        <div className="glass-card">
          <div className="flex items-center gap-3 mb-4">
            <Map className="w-5 h-5 text-secondary-500" />
            <h3 className="font-semibold text-text-dark">Mind Map Preview</h3>
          </div>
          <svg viewBox="0 0 200 150" className="w-full h-32 mb-4">
            <g>
              <circle cx="100" cy="75" r="15" fill="#2dd4bf" opacity="0.8" />
              <circle cx="60" cy="40" r="10" fill="#818cf8" opacity="0.6" />
              <circle cx="140" cy="40" r="10" fill="#f472b6" opacity="0.6" />
              <circle cx="60" cy="110" r="10" fill="#818cf8" opacity="0.6" />
              <circle cx="140" cy="110" r="10" fill="#f472b6" opacity="0.6" />

              <line x1="100" y1="75" x2="60" y2="40" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
              <line x1="100" y1="75" x2="140" y2="40" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
              <line x1="100" y1="75" x2="60" y2="110" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
              <line x1="100" y1="75" x2="140" y2="110" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
            </g>
          </svg>
          <button className="text-sm text-primary-500 hover:text-primary-600 font-semibold flex items-center gap-1 transition-colors">
            View Full Map <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      <div className="glass-card relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: 'linear-gradient(135deg, rgba(45,212,191,0.2), rgba(129,140,248,0.2))',
          }}
        />
        <div className="relative flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-text-dark mb-2">Ready to learn more?</h3>
            <p className="text-text-muted">Upload a new research paper to start your learning journey</p>
          </div>
          <button className="btn-primary ml-4 flex items-center gap-2 flex-shrink-0">
            <Upload className="w-4 h-4" />
            Upload PDF
          </button>
        </div>
      </div>
    </div>
  );
}
