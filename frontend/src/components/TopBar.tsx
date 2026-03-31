import { Bell, Search } from 'lucide-react';

interface TopBarProps {
  userName?: string;
}

export function TopBar({ userName = 'Tannu' }: TopBarProps) {
  return (
    <div className="h-20 bg-white/10 backdrop-blur-xl border-b border-white/20 flex items-center justify-between px-6 lg:px-8">
      <div className="flex items-center gap-6 flex-1">
        <h1 className="hidden lg:block text-2xl font-bold text-text-dark">
          Welcome back, {userName} 👋
        </h1>
      </div>

      <div className="flex items-center gap-4 flex-1 max-w-xs">
        <div className="relative hidden sm:flex flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
          <input
            type="text"
            placeholder="Search papers..."
            className="input-glass pl-9 py-2 text-sm"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 hover:bg-white/20 rounded-lg transition-colors">
          <Bell className="w-5 h-5 text-text-dark" />
          <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
        </button>

        <div className="flex items-center gap-3 pl-4 border-l border-white/20">
          <div className="text-right hidden sm:block">
            <p className="font-semibold text-sm text-text-dark">{userName}</p>
            <p className="text-xs text-text-muted">Student</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-semibold shadow-glow">
            {userName.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
    </div>
  );
}
