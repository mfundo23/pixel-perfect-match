import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Mail,
  BookOpenText,
  MessagesSquare,
  Settings as SettingsIcon,
  Menu,
  ShieldAlert,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";

export const NAV_ITEMS = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/email", label: "Email Generator", icon: Mail },
  { to: "/research", label: "Research Assistant", icon: BookOpenText },
  { to: "/chat", label: "AI Chatbot", icon: MessagesSquare },
  { to: "/settings", label: "Settings", icon: SettingsIcon },
] as const;

export const DISCLAIMER =
  "AI-generated content may be inaccurate, incomplete, or biased. Verify all critical information before use. Do not submit confidential or personal data.";

export function DisclaimerBanner() {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-accent/30 bg-accent/10 p-4 text-sm text-foreground">
      <ShieldAlert className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden="true" />
      <p>{DISCLAIMER}</p>
    </div>
  );
}

function NavLinks({ compact, onNavigate }: { compact?: boolean; onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav aria-label="Main" className="flex flex-col gap-1">
      {NAV_ITEMS.map(({ to, label, icon: Icon }) => {
        const active = pathname === to;
        return (
          <Link
            key={to}
            to={to}
            onClick={onNavigate}
            aria-label={label}
            aria-current={active ? "page" : undefined}
            title={compact ? label : undefined}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              compact && "justify-center px-0",
              active
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
            )}
          >
            <Icon className="size-5 shrink-0" aria-hidden="true" />
            {!compact && <span>{label}</span>}
          </Link>
        );
      })}
    </nav>
  );
}

function Brand({ compact }: { compact?: boolean }) {
  return (
    <div className={cn("flex items-center gap-2 px-3 py-4", compact && "justify-center px-0")}>
      <span
        aria-hidden="true"
        className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary text-sm font-bold text-primary-foreground"
      >
        W
      </span>
      {!compact && (
        <span className="text-base font-semibold tracking-tight text-foreground">WorkSmart AI</span>
      )}
    </div>
  );
}

export function AppShell({
  title,
  description,
  children,
  fullHeight,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  fullHeight?: boolean;
}) {
  // Restore the saved light/dark preference on every page.
  useTheme();
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Tablet icon rail */}
      <aside className="hidden w-[72px] shrink-0 flex-col border-r border-sidebar-border bg-sidebar px-2 md:flex lg:hidden">
        <Brand compact />
        <NavLinks compact />
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden w-60 shrink-0 flex-col border-r border-sidebar-border bg-sidebar px-3 lg:flex">
        <Brand />
        <NavLinks />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-3 border-b border-border bg-card px-4 py-3 md:px-6">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open navigation">
                <Menu className="size-5" aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 bg-sidebar p-3">
              <SheetHeader className="p-0">
                <SheetTitle className="px-3 text-base">WorkSmart AI</SheetTitle>
              </SheetHeader>
              <div className="mt-4">
                <NavLinks onNavigate={() => setOpen(false)} />
              </div>
            </SheetContent>
          </Sheet>
          <div className="min-w-0">
            <h1 className="truncate text-lg font-semibold tracking-tight text-foreground">
              {title}
            </h1>
            {description && (
              <p className="truncate text-sm text-muted-foreground">{description}</p>
            )}
          </div>
        </header>

        <main
          className={cn(
            "flex-1 px-4 py-6 md:px-6 lg:px-8",
            fullHeight && "flex min-h-0 flex-col overflow-hidden",
          )}
        >
          {children}
        </main>

        <footer className="border-t border-border bg-card px-4 py-3 md:px-6">
          <p className="text-xs leading-relaxed text-muted-foreground">{DISCLAIMER}</p>
        </footer>
      </div>
    </div>
  );
}
