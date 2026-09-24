import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Copy, RotateCcw, Sparkle, Columns3 } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { OutputPanel, Panel, type PanelStatus } from "@/components/OutputPanel";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { TONES, generateEmail, type EmailDraft, type Tone } from "@/lib/ai.functions";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Email Generator — WorkSmart AI" },
      {
        name: "description",
        content:
          "Turn key points into a ready-to-send workplace email in a formal, friendly, or persuasive tone.",
      },
      { property: "og:title", content: "Email Generator — WorkSmart AI" },
      {
        property: "og:description",
        content: "Draft workplace emails from rough notes and compare all three tones side by side.",
      },
    ],
  }),
  component: EmailGenerator,
});

const MAX_CONTEXT = 2000;

type Result =
  | { kind: "single"; tone: Tone; draft: EmailDraft }
  | { kind: "compare"; drafts: { tone: Tone; draft: EmailDraft }[] };

function DraftCard({ tone, draft }: { tone: Tone; draft: EmailDraft }) {
  const copy = async () => {
    await navigator.clipboard.writeText(`Subject: ${draft.subject}\n\n${draft.body}`);
    toast.success(`${tone} email copied`);
  };

  return (
    <article className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-accent">{tone}</p>
          <h3 className="mt-1 text-sm font-semibold text-foreground">{draft.subject}</h3>
        </div>
        <Button variant="ghost" size="sm" onClick={copy} aria-label={`Copy ${tone} email`}>
          <Copy className="size-4" aria-hidden="true" />
          Copy
        </Button>
      </div>
      <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">{draft.body}</p>
    </article>
  );
}

function EmailGenerator() {
  const [context, setContext] = useState("");
  const [tone, setTone] = useState<Tone>("Formal");
  const [status, setStatus] = useState<PanelStatus>("empty");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [lastAction, setLastAction] = useState<"single" | "compare">("single");

  const tooLong = context.length > MAX_CONTEXT;
  const canGenerate = context.trim().length > 0 && !tooLong;

  const run = async (mode: "single" | "compare") => {
    if (!canGenerate) return;
    setLastAction(mode);
    setStatus("loading");
    setError(null);
    try {
      if (mode === "single") {
        const draft = await generateEmail({ data: { context, tone } });
        setResult({ kind: "single", tone, draft });
      } else {
        const drafts = await Promise.all(
          TONES.map(async (t) => ({
            tone: t,
            draft: await generateEmail({ data: { context, tone: t } }),
          })),
        );
        setResult({ kind: "compare", drafts });
      }
      setStatus("success");
    } catch (e) {
      setError(e instanceof Error ? e.message : "The AI request failed. Please try again.");
      setStatus("error");
    }
  };

  return (
    <AppShell title="Email Generator" description="Notes in, a ready-to-send email out">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-2">
        <Panel title="Input" className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email-context">Context / Key Points</Label>
            <Textarea
              id="email-context"
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="e.g. Ask the vendor for an updated quote; project starts 12 May; need reply by Friday."
              rows={10}
              aria-describedby="email-context-count"
              aria-invalid={tooLong}
            />
            <p
              id="email-context-count"
              className={
                tooLong ? "text-xs font-medium text-destructive" : "text-xs text-muted-foreground"
              }
            >
              {context.length} / {MAX_CONTEXT} characters
              {tooLong ? " — please shorten your text." : ""}
            </p>
          </div>

          <fieldset className="space-y-3">
            <legend className="text-sm font-medium text-foreground">Tone</legend>
            <RadioGroup
              value={tone}
              onValueChange={(v) => setTone(v as Tone)}
              className="flex flex-wrap gap-4"
            >
              {TONES.map((t) => (
                <div key={t} className="flex items-center gap-2">
                  <RadioGroupItem id={`tone-${t}`} value={t} />
                  <Label htmlFor={`tone-${t}`} className="font-normal">
                    {t}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </fieldset>

          <div className="flex flex-wrap gap-3">
            <Button onClick={() => run("single")} disabled={!canGenerate || status === "loading"}>
              <Sparkle className="size-4" aria-hidden="true" />
              Generate
            </Button>
            <Button
              variant="outline"
              onClick={() => run("compare")}
              disabled={!canGenerate || status === "loading"}
            >
              <Columns3 className="size-4" aria-hidden="true" />
              Compare All Tones
            </Button>
          </div>
        </Panel>

        <Panel title="Output">
          <OutputPanel
            status={status}
            error={error}
            onRetry={() => run(lastAction)}
            emptyTitle="Your email will appear here"
            emptyHint="Add your key points, pick a tone, then choose Generate — or compare all three tones at once."
            example="Follow up on the budget review meeting and request the revised figures before Thursday."
          >
            {result?.kind === "single" && (
              <div className="space-y-4">
                <DraftCard tone={result.tone} draft={result.draft} />
                <Button variant="outline" onClick={() => run("single")}>
                  <RotateCcw className="size-4" aria-hidden="true" />
                  Regenerate
                </Button>
              </div>
            )}

            {result?.kind === "compare" && (
              <div className="space-y-4">
                <div className="grid gap-4 xl:grid-cols-3">
                  {result.drafts.map(({ tone: t, draft }) => (
                    <DraftCard key={t} tone={t} draft={draft} />
                  ))}
                </div>
                <Button variant="outline" onClick={() => run("compare")}>
                  <RotateCcw className="size-4" aria-hidden="true" />
                  Regenerate
                </Button>
              </div>
            )}
          </OutputPanel>
        </Panel>
      </div>
    </AppShell>
  );
}
