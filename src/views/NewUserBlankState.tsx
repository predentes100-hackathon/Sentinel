import {
  ArrowRight,
  CalendarClock,
  Plus,
  Sparkles,
  Target,
  Wallet
} from "lucide-react";

export function NewUserBlankState({
  displayName,
  onCreateAction,
  onOpenWealthLedger
}: {
  displayName: string;
  onCreateAction: () => void;
  onOpenWealthLedger: () => void;
}) {
  return (
    <section className="glass-panel min-h-[calc(100vh-2rem)] rounded-[32px] p-4 sm:p-6">
      <div className="flex min-h-[calc(100vh-7rem)] flex-col justify-between rounded-[28px] border border-white/6 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.08),transparent_35%),linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01))] p-6 sm:p-8">
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/15 bg-cyan-400/10 px-4 py-2 text-xs uppercase tracking-[0.28em] text-cyan-100">
            <Sparkles className="h-4 w-4" />
            Fresh workspace
          </div>

          <h2 className="mt-6 max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Welcome, {displayName}. Your Life Operating System is ready for a clean start.
          </h2>

          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300">
            There is no sample data in this account. Start by creating your first action, logging your first
            transaction, or setting up a recurring subscription reminder.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={onCreateAction}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-cyan-200/20 bg-gradient-to-r from-cyan-400/90 to-indigo-500/90 px-5 py-4 text-sm font-semibold text-slate-950 transition hover:scale-[1.01]"
            >
              <Plus className="h-5 w-5" />
              Create first action
            </button>

            <button
              type="button"
              onClick={onOpenWealthLedger}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-5 py-4 text-sm font-semibold text-white transition hover:bg-white/[0.06]"
            >
              <Wallet className="h-5 w-5" />
              Open wealth ledger
            </button>
          </div>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          <div className="rounded-[24px] border border-white/8 bg-white/[0.03] p-5">
            <div className="flex items-center gap-3">
              <span className="rounded-2xl bg-cyan-400/10 p-3 text-cyan-100">
                <Target className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-white">Actions</p>
                <p className="mt-1 text-sm text-slate-400">Plan what matters next.</p>
              </div>
            </div>
            <p className="mt-5 text-sm leading-6 text-slate-300">
              Add study blocks, work deliverables, habits, or errands and assign XP to turn progress into momentum.
            </p>
          </div>

          <div className="rounded-[24px] border border-white/8 bg-white/[0.03] p-5">
            <div className="flex items-center gap-3">
              <span className="rounded-2xl bg-emerald-400/10 p-3 text-emerald-100">
                <Wallet className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-white">Money flow</p>
                <p className="mt-1 text-sm text-slate-400">Track spend, earn, and splits.</p>
              </div>
            </div>
            <p className="mt-5 text-sm leading-6 text-slate-300">
              Use the finance toggle inside Action Forge to log transactions, categories, and split-bill recovery from day one.
            </p>
          </div>

          <div className="rounded-[24px] border border-white/8 bg-white/[0.03] p-5">
            <div className="flex items-center gap-3">
              <span className="rounded-2xl bg-fuchsia-400/10 p-3 text-fuchsia-100">
                <CalendarClock className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-white">Recurring rhythm</p>
                <p className="mt-1 text-sm text-slate-400">Never miss subscriptions.</p>
              </div>
            </div>
            <p className="mt-5 text-sm leading-6 text-slate-300">
              Turn on subscription tracking when you create an action to set due dates and reminder timing in one place.
            </p>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between rounded-[24px] border border-white/8 bg-slate-950/35 px-5 py-4">
          <p className="text-sm text-slate-300">Next best step: forge your first action and the rest of the dashboard will light up automatically.</p>
          <button
            type="button"
            onClick={onCreateAction}
            className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-100 transition hover:text-cyan-50"
          >
            Start now
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
