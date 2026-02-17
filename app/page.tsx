import { AgentRuntimeProvider } from "@/lib/contexts/AgentRuntimeContext";
import { FamilyHubProvider } from "@/lib/contexts/FamilyHubContext";
import HubShell from "@/components/shell/HubShell";
import Navigation from "@/components/Navigation";

export const metadata = {
  title: 'Valur Family Hub',
  description: 'Euer smartes Zuhause Dashboard',
};

export default function Page() {
  return (
    <FamilyHubProvider>
      <AgentRuntimeProvider>
        <div className="min-h-screen bg-gradient-to-br from-stone-100 to-stone-200">
          <Navigation />
          <main className="p-8">
            <HubShell />
          </main>
        </div>
      </AgentRuntimeProvider>
    </FamilyHubProvider>
  );
}
