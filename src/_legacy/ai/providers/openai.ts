import { ChatResponse, Message } from "@/lib/contracts/ai";

const DEFAULT_MODEL = "gpt-4o-mini";

export async function callOpenAI(
    messages: Message[],
    options?: { model?: string }
): Promise<ChatResponse> {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        throw new Error("OPENAI_API_KEY is not set");
    }

    const model = options?.model || DEFAULT_MODEL;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
            model,
            messages,
        }),
    });

    if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`OpenAI responded with ${response.status}: ${errorBody}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";

    return {
        text: content,
        provider: "openai",
        model: data.model || model,
        meta: {
            usage: data.usage,
            system_fingerprint: data.system_fingerprint,
        },
    };
}
