import { streamText, convertToModelMessages, type UIMessage } from 'ai';
import { registry } from '@/lib/ai/registry';

type ProviderId = 'openai' | 'anthropic' | 'google';

const DEFAULT_MODELS: Record<ProviderId, string> = {
  openai: 'gpt-4.1',
  anthropic: 'claude-3-7-sonnet-20250219',
  google: 'gemini-2.5-flash',
};

export async function POST(req: Request) {
  const {
    messages,
    provider = 'openai',
    model,
  }: { messages: UIMessage[]; provider?: ProviderId; model?: string } =
    await req.json();

  const providerId: ProviderId =
    provider === 'anthropic' || provider === 'google' ? provider : 'openai';
  console.log(providerId)
  const modelId = model ?? DEFAULT_MODELS[providerId];

  const result = streamText({
    model: registry.languageModel(`${providerId}:${modelId}`),
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}