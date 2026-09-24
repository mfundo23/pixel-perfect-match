import { createOpenAI } from "@ai-sdk/openai";
import { createLovableAiGatewayRunIdFetch } from "./ai-gateway.server";

export const RESPONSIBLE_AI_RULES = `Core rules you must always follow:
- Use neutral, inclusive language. Make no assumptions about anyone's gender, nationality, seniority, age, or background. Use they/them when a person's pronouns are unknown, and avoid gendered or culturally loaded salutations.
- Never invent authors, dates, statistics, citations, URLs, company names, or quotes. If a detail is not provided, leave a clearly marked placeholder such as [name] instead of guessing.
- Never claim to have browsed the web, opened a link, read a file, run code, or sent a message. You have no such abilities.
- Be clear, concise, and professional. If information is missing, say so plainly.`;

export const MODEL_ID = "openai/gpt-6-astra";

export function createLovableModel() {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) throw new Error("AI is not configured for this app yet.");

  const runIdFetch = createLovableAiGatewayRunIdFetch();
  const lovable = createOpenAI({
    baseURL: "https://ai.gateway.lovable.dev/v1",
    apiKey: key,
    headers: {
      "Lovable-API-Key": key,
      "X-Lovable-AIG-SDK": "vercel-ai-sdk",
    },
    fetch: runIdFetch.fetch,
  });

  return lovable.responses(MODEL_ID);
}

export const REASONING_PROVIDER_OPTIONS = {
  openai: {
    forceReasoning: true,
    reasoningEffort: "low",
    reasoningSummary: "auto",
    store: false,
    include: ["reasoning.encrypted_content"],
  },
} as const;

export function toFriendlyAiError(error: unknown): Error {
  const status =
    typeof error === "object" && error !== null
      ? (error as { statusCode?: number; status?: number }).statusCode ??
        (error as { status?: number }).status
      : undefined;

  if (status === 429) {
    return new Error("Too many requests right now. Wait a moment and try again.");
  }
  if (status === 402) {
    return new Error("The AI usage allowance for this workspace has run out. Add credits to continue.");
  }
  if (status === 401 || status === 403) {
    return new Error("AI access is unavailable for this app right now.");
  }
  return new Error("The AI request failed. Please try again.");
}
