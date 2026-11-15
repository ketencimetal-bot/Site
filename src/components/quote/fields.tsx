import { CircleAlert } from "lucide-react";

export const inputCls =
  "w-full rounded-xl border-0 bg-paper px-4 py-3.5 text-base text-ink ring-1 ring-inset ring-ink/12 transition placeholder:text-steel focus:bg-white focus:outline-none focus:ring-2 focus:ring-copper aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-red-600";

export function Field({
  id,
  label,
  hint,
  error,
  optional,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 flex items-baseline justify-between gap-3 text-sm font-semibold text-ink">
        {label}
        {optional && <span className="font-mono text-[0.68rem] font-normal uppercase tracking-wider text-steel-ink">İsteğe bağlı</span>}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-2 text-sm text-steel-ink">
          {hint}
        </p>
      )}
      <ErrorText id={`${id}-err`} error={error} />
    </div>
  );
}

export function ErrorText({ id, error }: { id: string; error?: string }) {
  if (!error) return null;
  return (
    <p id={id} role="alert" className="mt-2 flex items-center gap-1.5 text-sm font-medium text-red-700">
      <CircleAlert className="size-4 shrink-0" aria-hidden /> {error}
    </p>
  );
}

export function describedBy(id: string, error?: string, hint?: string) {
  return error ? `${id}-err` : hint ? `${id}-hint` : undefined;
}
