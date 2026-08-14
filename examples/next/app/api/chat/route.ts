const serverUrl = (
  process.env.SYMPHONY_SERVER_URL ?? "http://127.0.0.1:8000"
).replace(/\/$/, "");

const encoder = new TextEncoder();

const sleep = (milliseconds: number, signal: AbortSignal) =>
  new Promise<void>((resolve) => {
    const timer = setTimeout(resolve, milliseconds);
    signal.addEventListener(
      "abort",
      () => {
        clearTimeout(timer);
        resolve();
      },
      { once: true },
    );
  });

const demoThinkingStream = (signal: AbortSignal) => {
  const events = [
    { event_type: "run_started", payload: { run_id: "demo-thinking" } },
    { event_type: "turn_started", payload: { turn: 1 } },
    {
      event_type: "reasoning_delta",
      payload: { turn: 1, summary_index: 0, delta: "Reviewing the request" },
    },
    {
      event_type: "reasoning_delta",
      payload: { turn: 1, summary_index: 0, delta: " and preparing a response…" },
    },
    { event_type: "turn_completed", payload: { turn: 1 } },
    { event_type: "turn_started", payload: { turn: 2 } },
    {
      event_type: "text_delta",
      payload: { turn: 2, delta: "The live thinking demo completed successfully." },
    },
    {
      event_type: "usage",
      payload: {
        input_tokens: 128,
        output_tokens: 24,
        reasoning_tokens: 32,
        total_tokens: 184,
      },
    },
    {
      event_type: "context",
      payload: { current_tokens: 1_280, context_window: 16_384 },
    },
    { event_type: "turn_completed", payload: { turn: 2 } },
    { event_type: "run_completed", payload: { run_id: "demo-thinking" } },
  ];

  return new ReadableStream<Uint8Array>({
    async start(controller) {
      for (const event of events) {
        if (signal.aborted) break;
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
        await sleep(450, signal);
      }
      controller.close();
    },
  });
};

export async function POST(req: Request) {
  const body = await req.text();

  if (process.env.NODE_ENV === "development") {
    try {
      const { message } = JSON.parse(body) as { message?: unknown };
      if (message === "/demo-thinking") {
        return new Response(demoThinkingStream(req.signal), {
          headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
          },
        });
      }
    } catch {
      // Preserve the normal backend response for malformed requests.
    }
  }

  try {
    const response = await fetch(`${serverUrl}/runs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
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
