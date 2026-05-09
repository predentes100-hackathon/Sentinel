import type { LucideIcon } from "lucide-react";

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  const Icon = icon;
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center sm:p-12">
      <div className="mb-4 rounded-full border border-[#D4AF37]/10 bg-[#D4AF37]/5 p-4">
        <Icon className="h-8 w-8 text-[#D4AF37]/60" strokeWidth={1.5} />
      </div>
      <h3 className="serif text-xl font-semibold text-[#dce3f0]">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-[#99907c]">{description}</p>
      {actionLabel && onAction ? (
        <button
          type="button"
          onClick={onAction}
          className="mt-6 inline-flex items-center gap-2 rounded-[4px] border border-[#D4AF37]/20 bg-[#D4AF37]/5 px-4 py-2 text-sm font-semibold text-[#D4AF37] transition hover:bg-[#D4AF37]/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}
