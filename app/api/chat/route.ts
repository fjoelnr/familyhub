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

        const n8nChatUrl = process.env.N8N_CHAT_BACKBONE_URL;

        console.log(`[DEBUG] RequestId: ${requestId}`);
        console.log(`[DEBUG] N8N_CHAT_BACKBONE_URL: ${n8nChatUrl}`);

        if (!n8nChatUrl) {
            console.error(`[${requestId}] N8N_CHAT_BACKBONE_URL missing`);
            // STRICT: No fallback allowed.
            return NextResponse.json(
                {
                    type: "error",
                    role: "assistant",
                    text: "Configuration error: N8N_CHAT_BACKBONE_URL is missing.",
                    meta: buildMeta()
                },
                { status: 500 }
            );
        }

        // Standardize Payload for WF-300
        const n8nPayload = {
            message,
            requestId
        };

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), N8N_TIMEOUT_MS);

        console.log(`[${requestId}] → n8n (Backbone)`, n8nPayload);

        try {
            const response = await fetch(n8nChatUrl, {
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
                            workflow: "WF-300"
                        })
                    },
                    { status: 502 }
                );
            }

            const data = await response.json();

            // Standardize Response
            const replyText =
                typeof data?.reply === "string"
                    ? data.reply
                    : "No reply received from n8n.";

            // STRICT: actionResult must be present (null or object), but we should handle if n8n returns undefined by defaulting to null for the UI.
            // The prompt says "actionResult muss existieren, darf aber null sein" in the n8n output.
            // We pass it through.
            const actionResult = data?.actionResult === undefined ? null : data.actionResult;

            return NextResponse.json({
                type: "chat",
                role: "assistant",
                text: replyText,
                actionResult,
                meta: buildMeta({
                    workflow: "WF-300"
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
