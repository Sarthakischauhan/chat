const serverUrl = (
  process.env.SYMPHONY_SERVER_URL ?? "http://127.0.0.1:8000"
).replace(/\/$/, "");

export async function POST(req: Request) {
  try {
    const response = await fetch(`${serverUrl}/runs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: await req.text(),
      signal: req.signal,
    });

    return new Response(response.body, {
      status: response.status,
      headers: {
        "Content-Type": response.headers.get("Content-Type") ?? "text/event-stream",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Symphony server is unavailable";
    return new Response(message, { status: 502 });
  }
}
