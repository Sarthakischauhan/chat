# Next.js AI SDK example

This example is intentionally separate from the Symphony example. It uses the
AI SDK provider registry and `@sarchauhan/adapter-ai-sdk` to support mock,
OpenAI, Anthropic, Google, and Ollama models.

Run it from the repository root with:

```sh
npm run dev:ai-sdk
```

Copy `env.example` to `.env.local` and add provider keys as needed. The mock
provider works without any keys.
