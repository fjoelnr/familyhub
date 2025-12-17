import { ChatResponse, Message } from "@/lib/contracts/ai";

const DEFAULT_BASE_URL = "http://192.168.178.40:11434";
const DEFAULT_MODEL = "llama3:latest";
const DEFAULT_TIMEOUT = 3000; // 3 seconds to fail fast

export async function callOllama(
    messages: Message[],
    options?: { timeoutMs?: number; baseUrl?: string; model?: string }
): Promise<ChatResponse> {
    const baseUrl = options?.baseUrl || process.env.OLLAMA_BASE_URL || DEFAULT_BASE_URL;
    const model = options?.model || DEFAULT_MODEL;
    const timeout = options?.timeoutMs || DEFAULT_TIMEOUT;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await fetch(`${baseUrl}/api/chat`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model,
                messages,
                stream: false,
            }),
            signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`Ollama responded with ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        return {
            text: data.message?.content || "",
            provider: "ollama",
            model: data.model || model,
            meta: {
                total_duration: data.total_duration,
                eval_count: data.eval_count,
            },
        };
    } catch (error: unknown) {
        clearTimeout(timeoutId);
        // Differentiate between generic fetch errors and abort errors if needed
        const isTimeout = error instanceof DOMException && error.name === "AbortError";
        if (isTimeout) {
            throw new Error("Ollama request timed out");
        }
        throw error;
    }
}
