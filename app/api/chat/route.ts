// app/api/chat/route.ts
import { NextRequest, NextResponse } from "next/server";

const LOCAL_LLM_URL = process.env.LOCAL_LLM_URL!;
const LOCAL_LLM_MODEL = process.env.LOCAL_LLM_MODEL!;
const OPENAI_URL = "https://api.openai.com/v1/chat/completions";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY!;
const OPENAI_MODEL = process.env.OPENAI_MODEL!;

type Message = { role: "user" | "assistant"; content: string };

export async function POST(req: NextRequest) {
  const { messages } = await req.json() as { messages: Message[] };

  // 1) Versuch mit lokalem LLM
  try {
    const resp = await fetch(LOCAL_LLM_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: LOCAL_LLM_MODEL, messages }),
      // optional: Timeout via AbortController
    });
    if (resp.ok) {
      const data = await resp.json();
      return NextResponse.json({ reply: data.choices[0].message });
    } else {
      console.warn("Lokaler LLM meldete Fehler, Status:", resp.status);
    }
  } catch (e) {
    console.warn("Fehler beim lokalen LLM-Request:", e);
  }

  // 2) Fallback auf OpenAI
  const fallback = await fetch(OPENAI_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({ model: OPENAI_MODEL, messages }),
  });
  const fallbackData = await fallback.json();
  return NextResponse.json({ reply: fallbackData.choices[0].message });
}
