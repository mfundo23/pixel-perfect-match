import { createServerFn } from "@tanstack/react-start";
import { streamText, Output } from "ai";
import { z } from "zod";
import {
  RESPONSIBLE_AI_RULES,
  createLovableModel,
  REASONING_PROVIDER_OPTIONS,
  toFriendlyAiError,
} from "./ai.server";

export const TONES = ["Formal", "Friendly", "Persuasive"] as const;
export type Tone = (typeof TONES)[number];

const EmailInput = z.object({
  context: z.string().trim().min(1).max(2000),
  tone: z.enum(TONES),
});

const EmailSchema = z.object({
  subject: z.string(),
  body: z.string(),
});

export type EmailDraft = z.infer<typeof EmailSchema>;

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => EmailInput.parse(input))
  .handler(async ({ data }): Promise<EmailDraft> => {
    try {
      const result = streamText({
        model: createLovableModel(),
        system: `You are an assistant that writes workplace emails.
${RESPONSIBLE_AI_RULES}

Write one email in the requested tone based only on the context the user provides.
The body must include a greeting line and a sign-off. Use placeholders like [Recipient name] and [Your name] when names are not supplied.
Keep it to a focused, readable length. Return plain text, no markdown.`,
        prompt: `Tone: ${data.tone}\n\nContext / key points:\n${data.context}`,
        output: Output.object({ schema: EmailSchema }),
        providerOptions: REASONING_PROVIDER_OPTIONS,
      });

      return await result.output;
    } catch (error) {
      console.error("generateEmail failed", error);
      throw toFriendlyAiError(error);
    }
  });

const ResearchInput = z.object({
  mode: z.enum(["text", "url"]),
  content: z.string().trim().min(1).max(20000),
});

const ResearchSchema = z.object({
  summary: z.string(),
  insights: z.array(z.string()),
  recommendations: z.array(z.string()),
  source: z.string(),
});

export type ResearchResult = z.infer<typeof ResearchSchema>;

export const analyzeResearch = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ResearchInput.parse(input))
  .handler(async ({ data }): Promise<ResearchResult> => {
    const isUrl = data.mode === "url";
    try {
      const result = streamText({
        model: createLovableModel(),
        system: `You are a research assistant that analyses material for busy professionals.
${RESPONSIBLE_AI_RULES}

Produce exactly four parts:
- summary: 3 to 5 sentences.
- insights: 3 to 7 short bullet points.
- recommendations: 2 to 4 concrete, actionable items.
- source: one sentence stating plainly whether the analysis is based on the text the user provided, or on general model knowledge about the topic of a URL you cannot open.

You cannot open URLs or fetch pages. When given only a URL, say so in the source field and base the analysis on general knowledge of the topic implied by the URL, clearly flagged as best-effort. Never fabricate the page's actual contents, authors, dates, or quotes. Return plain text, no markdown.`,
        prompt: isUrl
          ? `The user provided only this URL (you cannot open it): ${data.content}`
          : `Analyse the following user-provided text:\n\n${data.content}`,
        output: Output.object({ schema: ResearchSchema }),
        providerOptions: REASONING_PROVIDER_OPTIONS,
      });

      return await result.output;
    } catch (error) {
      console.error("analyzeResearch failed", error);
      throw toFriendlyAiError(error);
    }
  });
