import { NextResponse } from "next/server";
import { getContextSnapshot } from "@/lib/context/getContextSnapshot";
import { classifyIntent } from "@/lib/ai/intentClassifier";
import { routeIntent } from "@/lib/agents/agentRouter";

export async function POST(req: Request) {
    const { message } = await req.json();

    const context = getContextSnapshot();
    const intent = await classifyIntent(message, context);
    const result = await routeIntent(intent, context, message);

    return NextResponse.json(result);
}
