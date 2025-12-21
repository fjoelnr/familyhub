import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const startTime = Date.now();
    const requestId = crypto.randomUUID();

    try {
        const { message } = await req.json();

        if (!message || typeof message !== "string") {
            return NextResponse.json(
                {
                    type: "error",
                    text: "Invalid message payload",
                    meta: {
                        source: "FamilyHub",
                        requestId,
                        durationMs: Date.now() - startTime
                    }
                },
                { status: 400 }
            );
        }

        // 1. Construct n8n Payload
        const n8nPayload = {
            workflow: "chat_hello",
            requestId,
            payload: {
                message: message
            }
        };

        // 2. Forward to n8n with Timeout
        const n8nUrl = process.env.N8N_WEBHOOK_URL;
        if (!n8nUrl) {
            console.error(`[${requestId}] Configuration Error: N8N_WEBHOOK_URL is missing`);
            return NextResponse.json(
                {
                    type: "error",
                    role: "assistant",
                    text: "Configuration error: N8N_WEBHOOK_URL missing.",
                    meta: {
                        source: "FamilyHub",
                        requestId,
                        durationMs: Date.now() - startTime
                    }
                },
                { status: 500 }
            );
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s Timeout

        console.log(`[${requestId}] Forwarding to n8n: ${n8nUrl}`, n8nPayload);

        try {
            const n8nResponse = await fetch(n8nUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(n8nPayload),
                signal: controller.signal
            });
            clearTimeout(timeoutId);

            if (!n8nResponse.ok) {
                console.error(`[${requestId}] n8n Error: ${n8nResponse.status} ${n8nResponse.statusText}`);
                return NextResponse.json(
                    {
                        type: "error",
                        role: "assistant",
                        text: `n8n Webhook Error: ${n8nResponse.status}`,
                        meta: {
                            source: "n8n",
                            workflow: "chat_hello",
                            requestId,
                            durationMs: Date.now() - startTime
                        }
                    },
                    { status: 502 }
                );
            }

            // 3. Parse n8n Response
            const data = await n8nResponse.json();
            const replyText = data.reply || "No reply received from n8n.";

            // 4. Return AgentResponse
            return NextResponse.json({
                type: "chat",
                role: "assistant",
                text: replyText,
                meta: {
                    source: "n8n",
                    workflow: "chat_hello",
                    requestId,
                    durationMs: Date.now() - startTime
                }
            });

        } catch (fetchError: unknown) {
            clearTimeout(timeoutId);
            const isTimeout = (fetchError as { name?: string })?.name === 'AbortError';
            console.error(`[${requestId}] API /chat error (Timeout: ${isTimeout})`, fetchError);

            return NextResponse.json(
                {
                    type: "error",
                    role: "assistant",
                    text: isTimeout
                        ? "The response timed out. Please try again."
                        : "Internal server error connecting to n8n.",
                    meta: {
                        source: "n8n",
                        requestId,
                        durationMs: Date.now() - startTime,
                        errorType: isTimeout ? "timeout" : "network_error"
                    }
                },
                { status: isTimeout ? 504 : 500 }
            );
        }

    } catch (err) {
        console.error(`[${requestId}] API /chat critical error`, err);
        return NextResponse.json(
            {
                type: "error",
                role: "assistant",
                text: "Internal system error.",
                meta: {
                    source: "FamilyHub",
                    requestId,
                    durationMs: Date.now() - startTime
                }
            },
            { status: 500 }
        );
    }
}
