import { AgentResponse } from "@/lib/contracts/agents";

export async function sendChatMessage(
    message: string
): Promise<AgentResponse> {
    const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
    });

    if (!res.ok) {
        throw new Error("Chat API failed");
    }

    return res.json();
}
