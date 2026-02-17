// Chat is disabled - use Telegram or Discord instead
export async function POST() {
    return Response.json(
        { type: "error", text: "Chat currently disabled. Use Telegram or Discord to reach Gnomi2." },
        { status: 503 }
    );
}