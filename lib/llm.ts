// lib/llm.ts
export type Msg = { role: "user" | "assistant"; content: string };

export async function callLLM(messages: Msg[]): Promise<Msg> {
  const LOCAL_LLM_URL = process.env.LOCAL_LLM_URL!;
  const LOCAL_LLM_MODEL = process.env.LOCAL_LLM_MODEL!;
  const OPENAI_URL = "https://api.openai.com/v1/chat/completions";
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY!;
  const OPENAI_MODEL = process.env.OPENAI_MODEL!;

  // Try local LLM
  try {
    const resp = await fetch(LOCAL_LLM_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: LOCAL_LLM_MODEL, messages }),
    });
    if (resp.ok) {
      const data = await resp.json();
      return data.choices[0].message;
    }
  } catch (_) {
    // fallback below
  }

  // Fallback OpenAI
  const fallback = await fetch(OPENAI_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({ model: OPENAI_MODEL, messages }),
  });
  const fallbackData = await fallback.json();
  return fallbackData.choices[0].message;
}
