import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { message } = await req.json();

        if (!message || typeof message !== "string") {
            return NextResponse.json(
                { type: "error", text: "Invalid message payload" },
                { status: 400 }
            );
        }

        // 1. Construct n8n Payload
        const n8nPayload = {
            workflow: "chat_hello",
            payload: {
                message: message
            }
        };

        // 2. Forward to n8n
        // n8n URL: http://192.168.178.20:5678 (Confirmed by User)
        // Webhook Path: /webhook/familyhub/chat (from WF definition path 'familyhub/chat' usually maps to /webhook/...)
        // NOTE: n8n default webhook path is /webhook/path-id or /webhook-test/path-id. 
        // With "path": "familyhub/chat" in the node, it maps to /webhook/familyhub/chat
        const n8nUrl = "http://192.168.178.20:5678/webhook/familyhub/chat";
        
        console.log(`Forwarding to n8n: ${n8nUrl}`, n8nPayload);

        const n8nResponse = await fetch(n8nUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(n8nPayload)
        });

        if (!n8nResponse.ok) {
            console.error(`n8n Error: ${n8nResponse.status} ${n8nResponse.statusText}`);
            return NextResponse.json(
                { 
                    type: "error", 
                    role: "assistant", 
                    text: `n8n Webhook Error: ${n8nResponse.status}` 
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
                workflow: "chat_hello"
            }
        });

    } catch (err) {
        console.error("API /chat error", err);
        return NextResponse.json(
            { 
                type: "error", 
                role: "assistant", 
                text: "Internal server error connecting to n8n." 
            },
            { status: 500 }
        );
    }
}
