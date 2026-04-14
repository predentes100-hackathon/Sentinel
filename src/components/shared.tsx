import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { ChevronDown } from "lucide-react";
import { getInitials } from "../data";
import type { MemberProfile, SortDirection, SyncState } from "../types";

export function Avatar({ member, large }: { member: MemberProfile; large?: boolean }) {
  if (member.avatarUrl) {
    return (
      <img
        src={member.avatarUrl}
        alt={member.displayName}
        className={`rounded-[24px] object-cover ${large ? "h-16 w-16" : "h-12 w-12"}`}
      />
    );
  }

  return (
    <div
      className={`flex items-center justify-center rounded-[24px] bg-gradient-to-br from-cyan-300/20 to-indigo-400/20 font-semibold text-cyan-100 ${
        large ? "h-16 w-16 text-lg" : "h-12 w-12 text-sm"
      }`}
    >
      {getInitials(member.displayName)}
    </div>
  );
}

export function Field({
  label,
  helper,
  children
}: {
  label: string;
  helper?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-white">{label}</span>
      {helper ? <span className="mt-1 block text-xs text-slate-400">{helper}</span> : null}
      <div className="mt-3">{children}</div>
    </label>
  );
}

export function Toggle({
  checked,
  onChange
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-8 w-14 items-center rounded-full border transition ${
        checked ? "border-cyan-300/25 bg-cyan-400/20" : "border-white/10 bg-white/[0.04]"
      }`}
    >
      <span
        className={`absolute h-6 w-6 rounded-full bg-white shadow-md transition ${
          checked ? "left-[30px]" : "left-1"
        }`}
      />
    </button>
  );
}

export function MetricCard({
  title,
  value,
  sublabel,
  icon,
  tone
}: {
  title: string;
  value: string;
  sublabel: string;
  icon: LucideIcon;
  tone: "amber" | "emerald" | "cyan" | "fuchsia";
}) {
  const toneClass =
    tone === "amber"
      ? "bg-amber-400/10 text-amber-100 border-amber-300/15"
      : tone === "emerald"
        ? "bg-emerald-400/10 text-emerald-100 border-emerald-300/15"
        : tone === "fuchsia"
          ? "bg-fuchsia-400/10 text-fuchsia-100 border-fuchsia-300/15"
          : "bg-cyan-400/10 text-cyan-100 border-cyan-300/15";
  const Icon = icon;

  return (
    <div className="glass-panel rounded-[24px] p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-slate-400">{title}</p>
          <p className="mt-3 text-2xl font-semibold text-white">{value}</p>
          <p className="mt-2 text-sm text-slate-400">{sublabel}</p>
        </div>
        <span className={`rounded-2xl border p-3 ${toneClass}`}>
          <Icon className="h-5 w-5" />
        </span>
      </div>
    </div>
  );
}

export function WealthStat({
  label,
  value,
  delta,
  icon,
  negative
}: {
  label: string;
  value: string;
  delta: string;
  icon: LucideIcon;
  negative?: boolean;
}) {
  const Icon = icon;
  return (
    <div className="rounded-[22px] border border-white/8 bg-white/[0.03] px-4 py-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-slate-400">{label}</p>
          <p className={`mt-2 text-2xl font-semibold ${negative ? "text-rose-200" : "text-white"}`}>{value}</p>
        </div>
        <span
          className={`rounded-2xl p-3 ${
            negative ? "bg-rose-500/10 text-rose-200" : "bg-emerald-500/10 text-emerald-200"
          }`}
        >
          <Icon className="h-5 w-5" />
        </span>
      </div>
      <p className="mt-2 text-sm text-slate-400">{delta}</p>
    </div>
  );
}

export function SortButton({
  label,
  active,
  direction,
  onClick
}: {
  label: string;
  active: boolean;
  direction: SortDirection;
  onClick: () => void;
}) {
  return (
    <button type="button" onClick={onClick} className="flex items-center gap-2 text-left">
      <span>{label}</span>
      <span className={`text-[10px] ${active ? "text-cyan-200" : "text-slate-500"}`}>
        {active ? (direction === "asc" ? "↑" : "↓") : ""}
      </span>
    </button>
  );
}

export function SyncBadge({ syncState }: { syncState: SyncState }) {
  const label =
    syncState === "live"
      ? "Live"
      : syncState === "syncing"
        ? "Syncing"
        : syncState === "error"
          ? "Needs setup"
          : "Demo";

  const className =
    syncState === "live"
      ? "border-emerald-300/20 bg-emerald-400/10 text-emerald-100"
      : syncState === "syncing"
        ? "border-cyan-300/20 bg-cyan-400/10 text-cyan-100"
        : syncState === "error"
          ? "border-amber-300/20 bg-amber-400/10 text-amber-100"
          : "border-white/10 bg-white/[0.03] text-slate-300";

  return <span className={`rounded-full border px-3 py-1 text-xs font-medium ${className}`}>{label}</span>;
}

export function ExportMenuToggle({
  open,
  onClick
}: {
  open: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-expanded={open}
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-2xl border border-cyan-300/20 bg-cyan-300/10 px-4 py-3 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-300/15"
    >
      Export Ledger
      <ChevronDown className={`h-4 w-4 transition ${open ? "rotate-180" : ""}`} />
    </button>
  );
}
