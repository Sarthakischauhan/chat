import type { RegistryConfig } from "@sarchauhan/chat";

const serverUrl = (process.env.SYMPHONY_SERVER_URL ?? "http://127.0.0.1:8000").replace(/\/$/, "");

export async function GET() {
  try {
    const response = await fetch(`${serverUrl}/models`, { cache: "no-store" });
    if (!response.ok) return new Response("Unable to load Symphony models", { status: 502 });

    const registry = (await response.json()) as RegistryConfig;
    const symphonyProvider = Array.isArray(registry.providers)
      ? registry.providers.find((provider) => provider.id === "symphony")
      : undefined;
    if (!symphonyProvider || !Array.isArray(symphonyProvider.models) || symphonyProvider.models.length === 0) {
      return new Response("Symphony returned no models", { status: 502 });
    }

    return Response.json(registry);
  } catch {
    return new Response("Symphony model service is unavailable", { status: 502 });
  }
}
