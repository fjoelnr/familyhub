import HubShell from '@/components/shell/HubShell';
import Navigation from '@/components/Navigation';

export const metadata = {
  title: 'Valur Family Hub',
  description: 'Euer smartes Zuhause Dashboard',
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-100 to-stone-200">
      {/* Navigation Bar */}
      <Navigation />
      
      {/* Main Content */}
      <main className="p-8">
        <HubShell />
      </main>
    </div>
  );
}
