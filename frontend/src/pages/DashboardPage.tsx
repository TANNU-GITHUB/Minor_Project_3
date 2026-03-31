import { Sidebar } from '../components/Sidebar';
import { TopBar } from '../components/TopBar';
import { DashboardCards } from '../components/DashboardCards';
import { FloatingOrbs } from '../components/FloatingOrbs';
import { Shapes3D } from '../components/Shapes3D';

const displayName = 'Tannu';

export function DashboardPage() {
  return (
    <div className="min-h-screen flex overflow-hidden">
      <FloatingOrbs />
      <Shapes3D />

      <Sidebar userName={displayName} />

      <div className="flex-1 flex flex-col min-h-screen relative z-10">
        <TopBar userName={displayName} />

        <main className="flex-1 overflow-y-auto">
          <div className="p-6 lg:p-8 max-w-7xl">
            <DashboardCards />
          </div>
        </main>
      </div>
    </div>
  );
}
