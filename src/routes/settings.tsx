import { createFileRoute } from "@tanstack/react-router";
import { Moon, Sun } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Panel } from "@/components/OutputPanel";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/lib/theme";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — WorkSmart AI" },
      {
        name: "description",
        content:
          "Switch between light and dark appearance and read how WorkSmart AI approaches responsible AI use.",
      },
      { property: "og:title", content: "Settings — WorkSmart AI" },
      {
        property: "og:description",
        content: "Appearance settings and responsible AI guidance for WorkSmart AI.",
      },
    ],
  }),
  component: Settings,
});

function Settings() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <AppShell title="Settings" description="Appearance and responsible AI">
      <div className="mx-auto max-w-3xl space-y-6">
        <Panel title="Appearance">
          <div className="flex items-center justify-between gap-4 rounded-lg border border-border bg-card p-5">
            <div className="flex items-start gap-3">
              {isDark ? (
                <Moon className="mt-0.5 size-5 text-accent" aria-hidden="true" />
              ) : (
                <Sun className="mt-0.5 size-5 text-accent" aria-hidden="true" />
              )}
              <div>
                <Label htmlFor="theme-toggle" className="text-sm font-medium">
                  Dark mode
                </Label>
                <p className="mt-1 text-sm text-muted-foreground">
                  Saved in this browser for your next visit.
                </p>
              </div>
            </div>
            <Switch
              id="theme-toggle"
              checked={isDark}
              onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
              aria-label="Toggle dark mode"
            />
          </div>
        </Panel>

        <Panel title="About & Responsible AI">
          <div className="space-y-4 rounded-lg border border-border bg-surface p-5 text-sm leading-relaxed text-surface-foreground">
            <p>
              WorkSmart AI is a workplace productivity dashboard with three assistants: an email
              generator, a research assistant, and a chatbot. Nothing you type is stored — your work
              lives only in this browser session and is gone when you refresh or close the tab.
            </p>
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-foreground">How we use AI responsibly</h3>
              <ul className="list-disc space-y-1.5 pl-5">
                <li>
                  The assistants are instructed to use neutral, inclusive language and to make no
                  assumptions about anyone's gender, nationality, or seniority.
                </li>
                <li>
                  They must not invent authors, dates, statistics, or links, and must not claim to
                  have browsed the web, opened files, or sent anything.
                </li>
                <li>
                  Output is a first draft, not a decision. Review anything important before you act
                  on it or send it.
                </li>
                <li>
                  Never paste confidential, personal, or regulated information into these tools.
                </li>
              </ul>
            </div>
            <p className="text-muted-foreground">
              AI-generated content may be inaccurate, incomplete, or biased. You remain responsible
              for what you send and publish.
            </p>
          </div>
        </Panel>
      </div>
    </AppShell>
  );
}
