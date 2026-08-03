import { Loader2 } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function LoadingBlock({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="container-x py-40 flex flex-col items-center justify-center text-center">
      <Loader2 className="h-7 w-7 animate-spin text-[var(--steel)]" />
      <p className="mt-4 text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

export function EmptyBlock({
  title,
  message,
  actionTo,
  actionLabel,
}: {
  title: string;
  message: string;
  actionTo?: "/products" | "/services" | "/";
  actionLabel?: string;
}) {
  return (
    <div className="container-x py-40 text-center">
      <h1 className="text-3xl font-bold text-[var(--navy-deep)]">{title}</h1>
      <p className="mt-3 text-muted-foreground max-w-xl mx-auto">{message}</p>
      {actionTo && (
        <Link to={actionTo} className="mt-6 inline-block text-[var(--steel)] underline">
          {actionLabel ?? "Go back"}
        </Link>
      )}
    </div>
  );
}
