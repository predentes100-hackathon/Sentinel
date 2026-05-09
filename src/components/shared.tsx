import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { getInitials } from "../data";
import type { MemberProfile, SortDirection, SyncState } from "../types";

export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}

export function StaggeredList({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: 0.05 }
        }
      }}
    >
      {children}
    </motion.div>
  );
}

export function StaggeredItem({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
      }}
    >
      {children}
    </motion.div>
  );
}

export function Avatar({ member, large }: { member: MemberProfile; large?: boolean }) {
  if (member.avatarUrl) {
    return (
      <img
        src={member.avatarUrl}
        alt={member.displayName}
        className={`rounded-[4px] object-cover ${large ? "h-16 w-16" : "h-12 w-12"}`}
      />
    );
  }
  return (
    <div
      className={`flex items-center justify-center rounded-[4px] bg-gradient-to-br from-[#D4AF37]/20 to-[#D4AF37]/8 font-semibold text-[#D4AF37] ${
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
      <span className="text-xs font-semibold uppercase tracking-[0.1em] text-[#d0c5af]">{label}</span>
      {helper ? <span className="mt-1 block text-xs text-[#99907c]">{helper}</span> : null}
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
      className={`relative inline-flex h-8 w-14 shrink-0 items-center rounded-full border transition ${
        checked ? "border-[#D4AF37]/40 bg-[#D4AF37]/20" : "border-[#4d4635] bg-[#192029]"
      }`}
    >
      <span
        className={`absolute h-6 w-6 rounded-full shadow-md transition-all ${
          checked ? "left-[30px] bg-[#D4AF37]" : "left-1 bg-[#99907c]"
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
  value: ReactNode;
  sublabel: string;
  icon: LucideIcon;
  tone: "gold" | "amber" | "emerald" | "cyan" | "fuchsia";
}) {
  const toneClass =
    tone === "gold"
      ? "bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/20"
      : tone === "amber"
        ? "bg-[#D4AF37]/8 text-[#d0c5af] border-[#D4AF37]/12"
        : tone === "emerald"
          ? "bg-[#1a3a2e]/60 text-[#6ee7b7] border-[#2d4a3e]/60"
          : tone === "fuchsia"
            ? "bg-[#D4AF37]/8 text-[#D4AF37] border-[#D4AF37]/15"
            : "bg-[#D4AF37]/5 text-[#d0c5af] border-[#D4AF37]/10";
  const Icon = icon;

  return (
    <div className="glass-panel rounded-[8px] p-4 transition hover:-translate-y-0.5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-[#99907c]">{title}</p>
          <p className="serif mt-3 text-3xl font-semibold text-[#dce3f0]">{value}</p>
          <p className="mt-2 text-sm text-[#99907c]">{sublabel}</p>
        </div>
        <span className={`rounded-[4px] border p-3 ${toneClass}`}>
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
  value: ReactNode;
  delta: string;
  icon: LucideIcon;
  negative?: boolean;
}) {
  const Icon = icon;
  return (
    <div className="rounded-[4px] border border-[#D4AF37]/12 bg-[#192029] px-4 py-4 transition hover:-translate-y-0.5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-[#99907c]">{label}</p>
          <p className={`serif mt-2 text-3xl font-semibold ${negative ? "text-[#c0392b]/80" : "text-[#D4AF37]"}`}>
            {value}
          </p>
        </div>
        <span
          className={`rounded-[4px] p-3 ${
            negative ? "bg-[#7a2020]/20 text-[#c0392b]/80" : "bg-[#D4AF37]/10 text-[#D4AF37]"
          }`}
        >
          <Icon className="h-5 w-5" />
        </span>
      </div>
      <p className="mt-2 text-sm text-[#99907c]">{delta}</p>
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
    <button type="button" onClick={onClick} className="flex items-center gap-2 text-left transition hover:text-[#D4AF37]">
      <span className={active ? "text-[#D4AF37]" : ""}>{label}</span>
      <span className={`text-[10px] ${active ? "text-[#D4AF37]" : "text-[#4d4635]"}`}>
        {active ? (direction === "asc" ? "↑" : "↓") : ""}
      </span>
    </button>
  );
}

export function SyncBadge({ syncState }: { syncState: SyncState }) {
  const label =
    syncState === "live" ? "Live"
      : syncState === "syncing" ? "Syncing"
      : syncState === "error" ? "Needs setup"
      : "Demo";

  const className =
    syncState === "live"
      ? "border-[#2d4a3e]/60 bg-[#1a3a2e]/60 text-[#6ee7b7]"
      : syncState === "syncing"
        ? "border-[#D4AF37]/25 bg-[#D4AF37]/10 text-[#D4AF37]"
        : syncState === "error"
          ? "border-[#7a2020]/40 bg-[#7a2020]/15 text-[#f87171]"
          : "border-[#4d4635] bg-[#192029] text-[#99907c]";

  return (
    <span className={`rounded-full border px-3 py-1 text-xs font-medium ${className}`}>{label}</span>
  );
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
      className="inline-flex items-center gap-2 rounded-[4px] border border-[#D4AF37]/25 bg-[#D4AF37]/8 px-4 py-3 text-sm font-semibold text-[#D4AF37] transition hover:bg-[#D4AF37]/15"
    >
      Export Ledger
      <ChevronDown className={`h-4 w-4 transition ${open ? "rotate-180" : ""}`} />
    </button>
  );
}
