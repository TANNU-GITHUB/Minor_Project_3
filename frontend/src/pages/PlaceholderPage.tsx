import { Sidebar } from '../components/Sidebar';
import { TopBar } from '../components/TopBar';
import { FloatingOrbs } from '../components/FloatingOrbs';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PlaceholderPageProps {
  title: string;
  description: string;
}

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex overflow-hidden">
      <FloatingOrbs />

      <Sidebar />

      <div className="flex-1 flex flex-col min-h-screen relative z-10">
        <TopBar />

        <main className="flex-1 overflow-y-auto flex items-center justify-center">
          <div className="text-center max-w-md px-4">
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
              <span className="text-3xl">✨</span>
            </div>
            <h1 className="text-3xl font-bold text-text-dark mb-2">{title}</h1>
            <p className="text-text-muted mb-8">{description}</p>
            <button
              onClick={() => navigate('/dashboard')}
              className="inline-flex items-center gap-2 text-primary-500 hover:text-primary-600 font-semibold transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
