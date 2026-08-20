import { anthropic } from "@ai-sdk/anthropic";
import { google } from "@ai-sdk/google";
import { openai } from "@ai-sdk/openai";
import { createProviderRegistry } from "ai";
import { createOllama } from "ollama-ai-provider-v2";

export type ProviderId = "mock" | "openai" | "anthropic" | "google" | "ollama";
export type RegistryModel = { id: string; label: string };
export type RegistryProvider = { id: ProviderId; label: string; logo: string; defaultModel: string; models: RegistryModel[] };
export type RegistryConfig = { defaultProviderId: ProviderId; providers: RegistryProvider[] };

export const aiRegistryConfig = {
  defaultProviderId: "mock",
  providers: [
    { id: "mock", label: "Mock", logo: "", defaultModel: "canned", models: [{ id: "canned", label: "Canned replies" }] },
    { id: "openai", label: "OpenAI", logo: "https://www.svgrepo.com/show/306500/openai.svg", defaultModel: "gpt-5.6-terra", models: [{ id: "gpt-5.6-terra", label: "GPT-5.6 Terra" }] },
    { id: "anthropic", label: "Anthropic", logo: "https://cdn.worldvectorlogo.com/logos/anthropic-1.svg", defaultModel: "claude-5-sonnet-202606", models: [{ id: "claude-5-sonnet-202606", label: "Claude Sonnet 5" }] },
    { id: "google", label: "Google", logo: "https://upload.wikimedia.org/wikipedia/commons/8/8f/Google-gemini-icon.svg", defaultModel: "gemini-3.6-flash", models: [{ id: "gemini-3.6-flash", label: "Gemini 3.6 Flash" }] },
    { id: "ollama", label: "Ollama", logo: "https://raw.githubusercontent.com/lobehub/lobe-icons/refs/heads/master/packages/static-avatar/avatars/ollama.webp", defaultModel: "qwen3-coder:30b", models: [{ id: "qwen3-coder:30b", label: "Qwen 3 Coder (30B)" }] },
  ],
} satisfies RegistryConfig;

export const getProviderConfig = (providerId: ProviderId) => aiRegistryConfig.providers.find((provider) => provider.id === providerId);
const ollama = createOllama({ baseURL: "http://localhost:11434/api" });
export const registry = createProviderRegistry({ openai, anthropic, google, ollama });
