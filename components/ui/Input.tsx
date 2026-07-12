import { cn } from "@/lib/utils";

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700">{label}</label>
      {children}
      {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
    </div>
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "mt-1 w-full rounded-lg border border-[#d8d2c3] px-3 py-2 text-sm focus:border-[#004741] focus:outline-none focus:ring-1 focus:ring-[#004741]",
        props.className
      )}
    />
  );
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cn(
        "mt-1 w-full rounded-lg border border-[#d8d2c3] px-3 py-2 text-sm focus:border-[#004741] focus:outline-none focus:ring-1 focus:ring-[#004741]",
        props.className
      )}
    />
  );
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={cn(
        "mt-1 w-full rounded-lg border border-[#d8d2c3] bg-white px-3 py-2 text-sm focus:border-[#004741] focus:outline-none focus:ring-1 focus:ring-[#004741]",
        props.className
      )}
    />
  );
}
