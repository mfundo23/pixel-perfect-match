import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Copy, RotateCcw, Sparkle } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { OutputPanel, Panel, type PanelStatus } from "@/components/OutputPanel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { analyzeResearch, type ResearchResult } from "@/lib/ai.functions";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "Research Assistant — WorkSmart AI" },
      {
        name: "description",
        content:
          "Summarise pasted text or a topic into a summary, key insights, and recommendations you can act on.",
      },
      { property: "og:title", content: "Research Assistant — WorkSmart AI" },
      {
        property: "og:description",
        content: "Get a summary, key insights, and recommendations from text you paste or a link you share.",
      },
    ],
  }),
  component: ResearchAssistant,
});

const MAX_TEXT = 20000;

function isValidUrl(value: string) {
  try {
    const url = new URL(value.trim());
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function ResearchAssistant() {
  const [mode, setMode] = useState<"text" | "url">("text");
  const [text, setText] = useState("");
  const [url, setUrl] = useState("");
  const [urlError, setUrlError] = useState<string | null>(null);
  const [status, setStatus] = useState<PanelStatus>("empty");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ResearchResult | null>(null);

  const tooLong = text.length > MAX_TEXT;
  const canRun = mode === "text" ? text.trim().length > 0 && !tooLong : url.trim().length > 0;

  const run = async () => {
    if (!canRun) return;
    if (mode === "url" && !isValidUrl(url)) {
      setUrlError("Enter a valid URL starting with http:// or https://");
      return;
    }
    setUrlError(null);
    setStatus("loading");
    setError(null);
    try {
      const data = await analyzeResearch({
        data: { mode, content: mode === "text" ? text : url.trim() },
      });
      setResult(data);
      setStatus("success");
    } catch (e) {
      setError(e instanceof Error ? e.message : "The AI request failed. Please try again.");
      setStatus("error");
    }
  };

  const copy = async () => {
    if (!result) return;
    const plain = [
      `Summary\n${result.summary}`,
      `Key Insights\n${result.insights.map((i) => `- ${i}`).join("\n")}`,
      `Recommendations\n${result.recommendations.map((i) => `- ${i}`).join("\n")}`,
      `Source\n${result.source}`,
    ].join("\n\n");
    await navigator.clipboard.writeText(plain);
    toast.success("Analysis copied");
  };

  return (
    <AppShell title="Research Assistant" description="Summaries, insights, and next steps">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-2">
        <Panel title="Input" className="space-y-5">
          <Tabs value={mode} onValueChange={(v) => setMode(v as "text" | "url")}>
            <TabsList>
              <TabsTrigger value="text">Paste Text</TabsTrigger>
              <TabsTrigger value="url">Enter URL</TabsTrigger>
            </TabsList>
          </Tabs>

          {mode === "text" ? (
            <div className="space-y-2">
              <Label htmlFor="research-text">Text to analyse</Label>
              <Textarea
                id="research-text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste a report, article, meeting notes, or survey responses…"
                rows={12}
                aria-describedby="research-text-count"
                aria-invalid={tooLong}
              />
              <p
                id="research-text-count"
                className={
                  tooLong ? "text-xs font-medium text-destructive" : "text-xs text-muted-foreground"
                }
              >
                {text.length} / {MAX_TEXT} characters
                {tooLong ? " — please shorten your text." : ""}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="research-url">Page URL</Label>
              <Input
                id="research-url"
                type="url"
                inputMode="url"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  setUrlError(null);
                }}
                placeholder="https://example.com/article"
                aria-describedby="research-url-hint"
                aria-invalid={Boolean(urlError)}
              />
              <p id="research-url-hint" className="text-xs text-muted-foreground">
                Best-effort: the assistant cannot open pages. It works from general knowledge of the
                topic the link suggests and will say so in the Source section.
              </p>
              {urlError && <p className="text-xs font-medium text-destructive">{urlError}</p>}
            </div>
          )}

          <Button onClick={run} disabled={!canRun || status === "loading"}>
            <Sparkle className="size-4" aria-hidden="true" />
            Analyse
          </Button>
        </Panel>

        <Panel title="Output">
          <OutputPanel
            status={status}
            error={error}
            onRetry={run}
            emptyTitle="Your analysis will appear here"
            emptyHint="Paste text or enter a URL, then choose Analyse. You'll get a summary, key insights, recommendations, and a note on the source."
            example="Paste a 3-page vendor report to get the main findings and what to do next."
          >
            {result && (
              <div className="space-y-6">
                <section className="space-y-2">
                  <h3 className="text-sm font-semibold text-foreground">Summary</h3>
                  <p className="text-sm leading-relaxed text-foreground">{result.summary}</p>
                </section>

                <section className="space-y-2">
                  <h3 className="text-sm font-semibold text-foreground">Key Insights</h3>
                  <ul className="list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground">
                    {result.insights.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </section>

                <section className="space-y-2">
                  <h3 className="text-sm font-semibold text-foreground">Recommendations</h3>
                  <ul className="list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground">
                    {result.recommendations.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </section>

                <section className="space-y-2">
                  <h3 className="text-sm font-semibold text-foreground">Source</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{result.source}</p>
                </section>

                <div className="flex flex-wrap gap-3">
                  <Button variant="outline" onClick={copy}>
                    <Copy className="size-4" aria-hidden="true" />
                    Copy
                  </Button>
                  <Button variant="outline" onClick={run}>
                    <RotateCcw className="size-4" aria-hidden="true" />
                    Regenerate
                  </Button>
                </div>
              </div>
            )}
          </OutputPanel>
        </Panel>
      </div>
    </AppShell>
  );
}
