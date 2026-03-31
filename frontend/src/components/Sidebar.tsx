import { useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Lightbulb, Grid3x3 as Grid3X3, ClipboardList, TrendingUp, Settings, Menu, X } from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: BookOpen, label: 'Study Space', path: '/papers' },
  { icon: Lightbulb, label: 'Mind Maps', path: '/mind-maps' },
  { icon: Grid3X3, label: 'Flashcards', path: '/flashcards' },
  { icon: ClipboardList, label: 'Notes', path: '/notes' },
  { icon: TrendingUp, label: 'Progress', path: '/progress' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

interface SidebarProps {
  userName?: string;
}

export function Sidebar({ userName = 'User' }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-40 p-2 glass rounded-lg"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      <div
        className={`fixed lg:static inset-y-0 left-0 z-30 w-64 lg:w-56 glass-lg border-r border-white/40 lg:border-white/35 flex flex-col transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        style={{ borderRadius: '0 24px 24px 0' }}
      >
        <div className="p-6 border-b border-white/20">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-primary-500 shadow-glow animate-pulse" />
            <h2 className="font-display font-bold text-lg text-text-dark">Lumina</h2>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setIsOpen(false);
                }}
                className={`nav-item w-full justify-start ${isActive ? 'active' : ''}`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/20">
          <div className="px-4 py-3 bg-white/15 rounded-xl">
            <p className="text-xs text-text-muted mb-1">Profile</p>
            <p className="font-semibold text-text-dark text-sm truncate">{userName}</p>
          </div>
        </div>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-20 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
