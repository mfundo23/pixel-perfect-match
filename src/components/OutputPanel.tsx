import type { ReactNode } from "react";
import { AlertCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export type PanelStatus = "empty" | "loading" | "success" | "error";

export function Panel({
  title,
  children,
  className,
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={className} aria-label={title}>
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </h2>
      {children}
    </section>
  );
}

export function OutputPanel({
  status,
  error,
  onRetry,
  emptyTitle,
  emptyHint,
  example,
  children,
}: {
  status: PanelStatus;
  error?: string | null;
  onRetry?: () => void;
  emptyTitle: string;
  emptyHint: string;
  example: string;
  children?: ReactNode;
}) {
  return (
    <div className="rounded-lg border border-border bg-surface p-5 text-surface-foreground">
      {status === "empty" && (
        <div className="space-y-3">
          <p className="text-sm font-medium text-foreground">{emptyTitle}</p>
          <p className="text-sm text-muted-foreground">{emptyHint}</p>
          <div className="rounded-lg border border-border bg-card p-3 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Example: </span>
            {example}
          </div>
        </div>
      )}

      {status === "loading" && (
        <div className="space-y-3" role="status" aria-live="polite">
          <span className="sr-only">Generating…</span>
          <Skeleton className="h-5 w-2/5" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-11/12" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      )}

      {status === "error" && (
        <div className="space-y-4">
          <div className="flex items-start gap-3 text-sm text-destructive">
            <AlertCircle className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
            <p>{error ?? "Something went wrong."}</p>
          </div>
          {onRetry && (
            <Button variant="outline" onClick={onRetry}>
              <RotateCcw className="size-4" aria-hidden="true" />
              Retry
            </Button>
          )}
        </div>
      )}

      {status === "success" && children}
    </div>
  );
}
