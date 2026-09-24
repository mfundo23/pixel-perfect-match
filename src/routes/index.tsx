import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, BookOpenText, MessagesSquare, ArrowRight } from "lucide-react";
import { AppShell, DisclaimerBanner } from "@/components/AppShell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "WorkSmart AI — Workplace productivity dashboard" },
      {
        name: "description",
        content:
          "WorkSmart AI brings an email generator, research assistant, and AI chatbot together in one clean workplace dashboard.",
      },
      { property: "og:title", content: "WorkSmart AI — Workplace productivity dashboard" },
      {
        property: "og:description",
        content:
          "Draft emails, summarise research, and chat with an AI assistant from one workplace dashboard.",
      },
    ],
  }),
  component: Dashboard,
});

const TOOLS = [
  {
    to: "/email",
    label: "Email Generator",
    description: "Turn rough notes into a polished email in the tone you need.",
    icon: Mail,
  },
  {
    to: "/research",
    label: "Research Assistant",
    description: "Summarise text or a topic into insights and recommendations.",
    icon: BookOpenText,
  },
  {
    to: "/chat",
    label: "AI Chatbot",
    description: "Brainstorm, rewrite, and check your work in a running conversation.",
    icon: MessagesSquare,
  },
] as const;

function Dashboard() {
  return (
    <AppShell title="Dashboard" description="Three AI tools for everyday work">
      <div className="mx-auto max-w-5xl space-y-8">
        <DisclaimerBanner />

        <div className="grid gap-4 md:grid-cols-3">
          {TOOLS.map(({ to, label, description, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className="group flex flex-col gap-3 rounded-lg border border-border bg-card p-5 transition-colors hover:border-accent"
            >
              <span className="grid size-10 place-items-center rounded-lg bg-primary/10 text-primary">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <h2 className="text-base font-semibold text-foreground">{label}</h2>
              <p className="text-sm text-muted-foreground">{description}</p>
              <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-medium text-accent">
                Open tool
                <ArrowRight
                  className="size-4 transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
