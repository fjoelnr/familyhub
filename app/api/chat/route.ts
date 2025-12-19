import { NextResponse } from "next/server";
import { getContextSnapshot } from "@/lib/context/getContextSnapshot";
import { classifyIntent } from "@/lib/ai/intentClassifier";
import { routeIntent } from "@/lib/agents/agentRouter";

export async function POST(req: Request) {
    try {
        const { message } = await req.json();

        if (!message || typeof message !== "string") {
            return NextResponse.json(
                { type: "error", text: "Invalid message payload" },
                { status: 400 }
            );
        }

        const context = getContextSnapshot();
        const intent = await classifyIntent(message, context);
        const result = await routeIntent(intent, context, message);

        return NextResponse.json({
            meta: {
                intent: intent.intent,
                confidence: intent.confidence,
                routedTo: intent.intent,
                uiMode: context.uiMode,
                dayPhase: context.dayPhase,
            },
            ...result,
        });
    } catch (err) {
        console.error("API /chat error", err);
        return NextResponse.json(
            { type: "error", text: "Internal server error" },
            { status: 500 }
        );
    }
}
