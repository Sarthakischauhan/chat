import type { UIMessage } from "ai";
import { getThreadMessages, saveThreadMessages } from "@/lib/db/chat";

type RouteContext = {
  params: Promise<{
    threadId: string;
  }>;
};

export async function GET(_: Request, context: RouteContext) {
  const { threadId } = await context.params;
  const messages = await getThreadMessages(threadId);
  return Response.json({ messages });
}

export async function POST(req: Request, context: RouteContext) {
  const { threadId } = await context.params;
  const { messages }: { messages?: UIMessage[] } = await req.json();

  if (!messages) {
    return new Response("Missing messages", { status: 400 });
  }

  await saveThreadMessages({
    threadId,
    messages,
    provider: "openai",
    model: "gpt-5.6-luna",
  });

  return Response.json({ ok: true });
}
