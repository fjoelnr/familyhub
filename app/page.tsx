import { AgentRuntimeProvider } from "@/lib/contexts/AgentRuntimeContext";
import { FamilyHubProvider } from "@/lib/contexts/FamilyHubContext";
import HubShell from "@/components/shell/HubShell";

export default function Page() {
  return (
    <FamilyHubProvider>
      <AgentRuntimeProvider>
        <HubShell />
      </AgentRuntimeProvider>
    </FamilyHubProvider>
  );
}
