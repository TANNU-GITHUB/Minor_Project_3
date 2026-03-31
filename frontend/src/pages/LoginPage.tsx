import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FloatingOrbs } from '../components/FloatingOrbs';
import { FloatingPDF } from '../components/FloatingPDF';
import { Shapes3D } from '../components/Shapes3D';
import GoogleLogo from '../assets/image.png';

export function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // No backend/auth in this flow: any credentials unlock the dashboard.
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  const handleGoogleLogin = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex">
      <FloatingOrbs />
      <Shapes3D />

      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center px-12 relative z-10">
        <div className="max-w-md text-center space-y-8">
          <div>
            <h1 className="font-display text-5xl md:text-6xl font-bold text-text-dark mb-4 leading-tight">
              Study Smarter.
              <br />
              Not Harder.
            </h1>
            <p className="text-lg text-text-muted font-body">
              Transform any research paper into your personal learning experience with AI-powered insights,
              mind maps, flashcards, and interactive quizzes.
            </p>
          </div>

          <div className="h-80 flex items-center justify-center">
            <FloatingPDF />
          </div>

          <div className="flex flex-wrap gap-3 justify-center">
            {['AI Chat', 'Mind Maps', 'Flashcards', 'Notes'].map((feature) => (
              <div
                key={feature}
                className="glass px-4 py-2 rounded-full text-sm font-medium text-text-dark"
              >
                {feature}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-6 py-12 lg:py-0 relative z-10">
        <div className="w-full max-w-md">
          <div className="glass-lg p-12 space-y-8 text-center">
            <div>
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="w-2.5 h-2.5 rounded-full bg-primary-500 shadow-glow" />
                <h1 className="font-display text-2xl font-bold text-text-dark">Lumina</h1>
              </div>
              <p className="text-text-muted text-sm">AI-powered research paper learning</p>
            </div>

            <div className="flex bg-white/40 border border-white/55 rounded-lg p-1 shadow-glass-sm">
              <button
                type="button"
                onClick={() => setMode('login')}
                className={`flex-1 px-3 py-2 text-xs font-bold rounded-md transition-all duration-200 ${
                  mode === 'login'
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-text-muted hover:text-text-dark'
                }`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => setMode('signup')}
                className={`flex-1 px-3 py-2 text-xs font-bold rounded-md transition-all duration-200 ${
                  mode === 'signup'
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-text-muted hover:text-text-dark'
                }`}
              >
                Sign up
              </button>
            </div>

            <h2 className="font-display text-xl font-bold text-text-dark">
              {mode === 'login' ? 'Welcome back' : 'Create your account'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="text-left">
                <label className="block text-xs font-semibold text-text-muted mb-2">Username</label>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  type="text"
                  autoComplete="username"
                  className="w-full bg-white/60 border border-white/55 rounded-lg px-4 py-3 text-sm text-text-dark placeholder:text-text-muted/80 outline-none focus:ring-2 focus:ring-primary-500/40"
                  placeholder="Enter username"
                />
              </div>

              <div className="text-left">
                <label className="block text-xs font-semibold text-text-muted mb-2">Password</label>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  className="w-full bg-white/60 border border-white/55 rounded-lg px-4 py-3 text-sm text-text-dark placeholder:text-text-muted/80 outline-none focus:ring-2 focus:ring-primary-500/40"
                  placeholder="Enter password"
                />
              </div>

              <button type="submit" className="btn-primary w-full !py-3 !px-4 text-sm inline-flex items-center justify-center">
                {mode === 'login' ? 'Login' : 'Sign up'}
              </button>

              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-white/30" />
                <p className="text-xs text-text-muted">or</p>
                <div className="h-px flex-1 bg-white/30" />
              </div>

              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full bg-white/50 hover:bg-white border border-white/55 rounded-lg px-4 py-3 text-sm text-text-dark transition-colors shadow-sm"
              >
                <span className="inline-flex items-center justify-center gap-2 w-full">
                  <img src={GoogleLogo} alt="Google logo" className="w-4 h-4" />
                  Sign in with Google
                </span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
