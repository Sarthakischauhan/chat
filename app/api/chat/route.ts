import { streamText, convertToModelMessages, type UIMessage } from 'ai';
import { registry } from '@/lib/ai/registry';

type ProviderId = 'openai' | 'anthropic' | 'google' | 'ollama';
const Providers: ProviderId[] = [
  "anthropic",
  "ollama",
  "openai",
  "google"
]

const DEFAULT_MODELS: Record<ProviderId, string> = {
  openai: 'gpt-4.1',
  anthropic: 'claude-3-7-sonnet-20250219',
  google: 'gemini-2.5-flash',
  ollama: "smallthinker:latest",
};

export async function POST(req: Request) {
  const {
    messages,
    provider = 'openai',
    model,
  }: { messages: UIMessage[]; provider?: ProviderId; model?: string } =
  await req.json();
  if (!Providers.includes(provider)) {
    return new Response('Unsupported provider', { status: 400 });
  }

  const modelId = model ?? DEFAULT_MODELS[provider];
  const result = streamText({
    model: registry.languageModel(`${provider}:${modelId}`),
    messages: await convertToModelMessages(messages),
    providerOptions: {
      ollama: {
        think: false
      }
    }
  });

  return result.toUIMessageStreamResponse();
}