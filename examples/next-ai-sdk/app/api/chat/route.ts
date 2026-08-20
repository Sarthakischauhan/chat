import { consumeStream, convertToModelMessages, createIdGenerator, jsonSchema, stepCountIs, streamText, tool, type UIMessage } from "ai";
import { getProviderConfig, registry, type ProviderId } from "@/lib/ai/registry";
import { streamMockChatResponse } from "@/lib/ai/mock-chat";
import { ensureThread, getThreadMessages, saveThreadMessages } from "@/lib/db/chat";

const agentTools = {
  getCurrentTime: tool({
    description: "Get the current date and time in ISO format.",
    inputSchema: jsonSchema<{ timezone?: string }>({ type: "object", properties: { timezone: { type: "string" } }, additionalProperties: false }),
    execute: async ({ timezone }) => ({ iso: new Date().toISOString(), local: timezone ? new Date().toLocaleString("en-US", { timeZone: timezone }) : new Date().toLocaleString(), timezone: timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone }),
  }),
  question: tool({
    description: "Ask the user a multiple-choice question in the chat UI.",
    inputSchema: jsonSchema<{ prompt: string; options: string[] }>({ type: "object", properties: { prompt: { type: "string" }, options: { type: "array", items: { type: "string" }, minItems: 2 } }, required: ["prompt", "options"], additionalProperties: false }),
    execute: async ({ prompt, options }) => ({ prompt, options, interactive: true }),
  }),
  map: tool({
    description: "Show a map pin in the chat UI for a latitude/longitude location.",
    inputSchema: jsonSchema<{ lat: number; lng: number; label?: string; zoom?: number }>({ type: "object", properties: { lat: { type: "number" }, lng: { type: "number" }, label: { type: "string" }, zoom: { type: "number" } }, required: ["lat", "lng"], additionalProperties: false }),
    execute: async ({ lat, lng, label, zoom }) => ({ lat, lng, label: label ?? "Location", zoom: zoom ?? 12 }),
  }),
};

type ChatRequest = { id?: string; message?: UIMessage; provider?: ProviderId; model?: string };

export async function POST(req: Request) {
  const body = (await req.json()) as ChatRequest;
  const provider = body.provider ?? "mock";
  if (!body.id || !body.message) return new Response("Missing thread or message", { status: 400 });
  await ensureThread(body.id);
  const messages = [...(await getThreadMessages(body.id)), body.message];
  const providerConfig = getProviderConfig(provider);
  if (!providerConfig) return new Response("Unsupported provider", { status: 400 });
  const modelId = providerConfig.models.find((entry) => entry.id === body.model)?.id ?? providerConfig.defaultModel;
  if (provider === "mock") return streamMockChatResponse({ threadId: body.id, messages, modelId });

  const result = streamText({ model: registry.languageModel(`${provider}:${modelId}`), messages: await convertToModelMessages(messages), tools: agentTools, stopWhen: stepCountIs(5), providerOptions: { ollama: { think: false } } });
  result.consumeStream();
  return result.toUIMessageStreamResponse({
    originalMessages: messages,
    generateMessageId: createIdGenerator({ prefix: "msg", size: 16 }),
    onFinish: async ({ messages: responseMessages }) => {
      await saveThreadMessages({ threadId: body.id!, messages: responseMessages, provider, model: modelId });
    },
    consumeSseStream: consumeStream,
  });
}
