# Chat 

Chat is a simple Next.js app for chatting with different AI providers from one interface. It includes a basic chat UI and a server route that streams responses using the Vercel AI SDK.

## Features

- Chat interface built with Next.js and React
- Support for OpenAI, Anthropic, and Google models
- Streaming responses from the `/api/chat` route
- Simple provider-based model selection

## Getting Started

Install dependencies:

```bash
bun install
```

Create a `.env.local` file and add the API keys you want to use:

```bash
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
GOOGLE_GENERATIVE_AI_API_KEY=
```

Start the development server:

```bash
bun run dev
```

Open `http://localhost:3000` in your browser.

## Tech Stack

- Next.js
- React
- TypeScript
- Vercel AI SDK
- Tailwind CSS
