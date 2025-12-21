import { NextResponse } from "next/server";
import crypto from "crypto";

const N8N_TIMEOUT_MS = 15_000;

export async function POST(req: Request) {
    const startTime = Date.now();
    const requestId = crypto.randomUUID();

    const buildMeta = (extra: Record<string, unknown> = {}) => ({
        source: "FamilyHub",
        requestId,
        durationMs: Date.now() - startTime,
        ...extra
    });

    try {
        const body = await req.json();
        const message = body?.message;

        if (!message || typeof message !== "string") {
            return NextResponse.json(
                {
                    type: "error",
                    role: "assistant",
                    text: "Invalid message payload.",
                    meta: buildMeta()
                },
                { status: 400 }
            );
        }

        const n8nUrl = process.env.N8N_WEBHOOK_URL;
        if (!n8nUrl) {
            console.error(`[${requestId}] N8N_WEBHOOK_URL missing`);
            return NextResponse.json(
                {
                    type: "error",
                    role: "assistant",
                    text: "Configuration error: N8N_WEBHOOK_URL is missing.",
                    meta: buildMeta()
                },
                { status: 500 }
            );
        }

        const n8nPayload = {
            workflow: "chat_hello",
            requestId,
            payload: { message }
        };

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), N8N_TIMEOUT_MS);

        console.log(`[${requestId}] → n8n`, n8nPayload);

        try {
            const response = await fetch(n8nUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(n8nPayload),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                console.error(
                    `[${requestId}] n8n responded with ${response.status}`
                );

                return NextResponse.json(
                    {
                        type: "error",
                        role: "assistant",
                        text: `n8n Webhook Error (${response.status})`,
                        meta: buildMeta({
                            source: "n8n",
                            workflow: "chat_hello"
                        })
                    },
                    { status: 502 }
                );
            }

            const data = await response.json();
            const replyText =
                typeof data?.reply === "string"
                    ? data.reply
                    : "No reply received from n8n.";

            return NextResponse.json({
                type: "chat",
                role: "assistant",
                text: replyText,
                meta: buildMeta({
                    source: "n8n",
                    workflow: "chat_hello"
                })
            });
        } catch (err: unknown) {
            clearTimeout(timeoutId);

            const isTimeout =
                typeof err === "object" &&
                err !== null &&
                (err as { name?: string }).name === "AbortError";

            console.error(
                `[${requestId}] n8n communication error (timeout=${isTimeout})`,
                err
            );

            return NextResponse.json(
                {
                    type: "error",
                    role: "assistant",
                    text: isTimeout
                        ? "The response timed out. Please try again."
                        : "Internal server error connecting to n8n.",
                    meta: buildMeta({
                        source: "n8n",
                        errorType: isTimeout ? "timeout" : "network_error"
                    })
                },
                { status: isTimeout ? 504 : 500 }
            );
        }
    } catch (err) {
        console.error(`[${requestId}] /api/chat critical failure`, err);

        return NextResponse.json(
            {
                type: "error",
                role: "assistant",
                text: "Internal system error.",
                meta: buildMeta()
            },
            { status: 500 }
        );
    }
}
