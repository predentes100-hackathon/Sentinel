import { Plus, X } from "lucide-react";
import { FINANCE_CATEGORIES, PRIORITY_META, formatCurrency } from "../data";
import { Field, Toggle } from "../components/shared";
import type {
  ActionFormState,
  FinanceCategory,
  SubscriptionItem,
  TransactionType
} from "../types";

export function ActionForgeModal({
  form,
  isSaving,
  splitNames,
  liveSplitSummary,
  splitPerHead,
  onClose,
  onFormChange,
  onCommit
}: {
  form: ActionFormState;
  isSaving: boolean;
  splitNames: string[];
  liveSplitSummary: string;
  splitPerHead: number;
  onClose: () => void;
  onFormChange: (updater: ActionFormState | ((current: ActionFormState) => ActionFormState)) => void;
  onCommit: () => void;
}) {
  function update<K extends keyof ActionFormState>(key: K, value: ActionFormState[K]) {
    onFormChange((current) => ({
      ...current,
      [key]: value
    }));
  }

  function updateSplitName(index: number, value: string) {
    onFormChange((current) => ({
      ...current,
      splitNames: current.splitNames.map((name, nameIndex) => (nameIndex === index ? value : name))
    }));
  }

  function addSplitName() {
    onFormChange((current) => ({
      ...current,
      splitNames: [...current.splitNames, ""]
    }));
  }

  function removeSplitName(index: number) {
    onFormChange((current) => ({
      ...current,
      splitNames: current.splitNames.filter((_, nameIndex) => nameIndex !== index)
    }));
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/65 p-4 backdrop-blur-md">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Global Add Task"
        className="glass-panel max-h-[92vh] w-full max-w-4xl overflow-auto rounded-[32px] p-5 sm:p-6"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-slate-400">Action Forge</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white">Global Add Task</h2>
            <p className="mt-2 text-sm text-slate-400">
              Title it, gamify it, wire the money flow, and optionally attach a subscription reminder.
            </p>
          </div>
          <button
            type="button"
            aria-label="Close Action Forge"
            onClick={onClose}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-slate-300 transition hover:bg-white/[0.06]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-5">
            <Field label="Title">
              <input
                value={form.title}
                onChange={(event) => update("title", event.target.value)}
                placeholder="Finish AxiomIVE onboarding flow"
                className="w-full rounded-[22px] border border-white/10 bg-slate-950/45 px-4 py-4 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/25"
              />
            </Field>

            <Field label="Description">
              <textarea
                rows={6}
                value={form.description}
                onChange={(event) => update("description", event.target.value)}
                placeholder="Capture the why, the deliverable, and any context your future self will thank you for."
                className="w-full rounded-[22px] border border-white/10 bg-slate-950/45 px-4 py-4 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/25"
              />
            </Field>

            <Field
              label="Priority Level"
              helper="XP is automatically assigned: Low 10, Medium 20, High 30, Deep Work 50."
            >
              <div className="grid gap-3 sm:grid-cols-2">
                {(Object.keys(PRIORITY_META) as Array<keyof typeof PRIORITY_META>).map((priority) => {
                  const meta = PRIORITY_META[priority];
                  const active = form.priority === priority;
                  return (
                    <button
                      key={priority}
                      type="button"
                      onClick={() => update("priority", priority)}
                      className={`rounded-[22px] border p-4 text-left transition ${
                        active
                          ? "border-cyan-300/25 bg-cyan-300/10 text-white"
                          : "border-white/10 bg-white/[0.03] text-slate-300 hover:border-white/15 hover:bg-white/[0.05]"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">{priority}</span>
                        <span className="rounded-full border border-white/10 bg-slate-950/55 px-3 py-1 text-xs text-cyan-100">
                          +{meta.xp} XP
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-slate-400">
                        {priority === "Low"
                          ? "Quick reset"
                          : priority === "Medium"
                            ? "Structured follow-through"
                            : priority === "High"
                              ? "High-friction deliverable"
                              : "Full-focus execution block"}
                      </p>
                    </button>
                  );
                })}
              </div>
            </Field>

            <div className="glass-panel rounded-[28px] p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Daily Task Engine</p>
                  <h3 className="mt-2 text-xl font-semibold text-white">Repeat every day</h3>
                  <p className="mt-2 text-sm text-slate-400">
                    Daily tasks reset automatically each new day and can award XP once per day.
                  </p>
                </div>
                <Toggle checked={form.repeatsDaily} onChange={(checked) => update("repeatsDaily", checked)} />
              </div>

              {form.repeatsDaily ? (
                <div className="mt-5">
                  <Field label="Daily time">
                    <input
                      type="time"
                      value={form.dailyTime}
                      onChange={(event) => update("dailyTime", event.target.value)}
                      className="w-full rounded-[20px] border border-white/10 bg-slate-950/45 px-4 py-3 text-white outline-none focus:border-cyan-300/25"
                    />
                  </Field>
                </div>
              ) : (
                <p className="mt-5 text-sm text-slate-400">
                  Leave this off for one-time tasks that disappear after completion.
                </p>
              )}
            </div>
          </div>

          <div className="space-y-5">
            <div className="glass-panel rounded-[28px] p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Finance Engine</p>
                  <h3 className="mt-2 text-xl font-semibold text-white">Transaction-aware action</h3>
                </div>
                <Toggle
                  checked={form.involvesTransaction}
                  onChange={(checked) => update("involvesTransaction", checked)}
                />
              </div>

              {form.involvesTransaction ? (
                <div className="mt-5 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Type">
                      <select
                        value={form.transactionType}
                        onChange={(event) => update("transactionType", event.target.value as TransactionType)}
                        className="w-full rounded-[20px] border border-white/10 bg-slate-950/45 px-4 py-3 text-white outline-none focus:border-cyan-300/25"
                      >
                        <option value="Spend">Spend</option>
                        <option value="Earn">Earn</option>
                      </select>
                    </Field>
                    <Field label="Amount (₹)">
                      <input
                        type="number"
                        min="0"
                        value={form.amount}
                        onChange={(event) => update("amount", event.target.value)}
                        className="w-full rounded-[20px] border border-white/10 bg-slate-950/45 px-4 py-3 text-white outline-none focus:border-cyan-300/25"
                        placeholder="500"
                      />
                    </Field>
                  </div>

                  <Field label="Category">
                    <select
                      value={form.category}
                      onChange={(event) => update("category", event.target.value as FinanceCategory)}
                      className="w-full rounded-[20px] border border-white/10 bg-slate-950/45 px-4 py-3 text-white outline-none focus:border-cyan-300/25"
                    >
                      {FINANCE_CATEGORIES.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <div className="space-y-3 rounded-[24px] border border-white/10 bg-white/[0.03] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold text-white">Split Bill?</p>
                        <p className="mt-1 text-sm text-slate-400">Share the amount with friends and see the split live.</p>
                      </div>
                      <Toggle checked={form.splitBill} onChange={(checked) => update("splitBill", checked)} />
                    </div>

                    {form.splitBill ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between gap-3 rounded-[20px] border border-white/10 bg-slate-950/45 px-4 py-3">
                          <div>
                            <p className="font-medium text-white">Am I included?</p>
                            <p className="mt-1 text-xs text-slate-400">
                              Toggle off if you paid on behalf of everyone else.
                            </p>
                          </div>
                          <Toggle checked={form.amIncluded} onChange={(checked) => update("amIncluded", checked)} />
                        </div>

                        <div className="space-y-3">
                          {form.splitNames.map((name, index) => (
                            <div key={`${index}-${name}`} className="flex gap-3">
                              <input
                                value={name}
                                onChange={(event) => updateSplitName(index, event.target.value)}
                                placeholder={index === 0 ? "Nihali" : "Add another name"}
                                className="w-full rounded-[18px] border border-white/10 bg-slate-950/45 px-4 py-3 text-white outline-none focus:border-cyan-300/25"
                              />
                              {form.splitNames.length > 1 ? (
                                <button
                                  type="button"
                                  onClick={() => removeSplitName(index)}
                                  className="rounded-[18px] border border-white/10 bg-white/[0.03] px-4 py-3 text-slate-300 transition hover:bg-white/[0.06]"
                                >
                                  Remove
                                </button>
                              ) : null}
                            </div>
                          ))}
                        </div>

                        <button
                          type="button"
                          onClick={addSplitName}
                          className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-200 transition hover:bg-white/[0.06]"
                        >
                          <Plus className="h-4 w-4" />
                          Add name
                        </button>

                        <div className="rounded-[20px] border border-cyan-300/15 bg-cyan-400/10 p-4">
                          <p className="text-sm font-semibold text-cyan-100">{liveSplitSummary}</p>
                          {splitNames.length > 0 && splitPerHead > 0 ? (
                            <p className="mt-2 text-sm text-cyan-50">
                              {splitNames.join(", ")} {splitNames.length === 1 ? "owes" : "owe"} {formatCurrency(splitPerHead)} each.
                            </p>
                          ) : null}
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              ) : (
                <p className="mt-5 text-sm text-slate-400">
                  Toggle this on to log spend/earn activity, categories, splits, and balance updates.
                </p>
              )}
            </div>

            <div className="glass-panel rounded-[28px] p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Subscription Reminder</p>
                  <h3 className="mt-2 text-xl font-semibold text-white">Recurring charge tracking</h3>
                </div>
                <Toggle
                  checked={form.createSubscription}
                  onChange={(checked) => update("createSubscription", checked)}
                />
              </div>

              {form.createSubscription ? (
                <div className="mt-5 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Frequency">
                      <select
                        value={form.subscriptionFrequency}
                        onChange={(event) =>
                          update(
                            "subscriptionFrequency",
                            event.target.value as SubscriptionItem["frequency"]
                          )
                        }
                        className="w-full rounded-[20px] border border-white/10 bg-slate-950/45 px-4 py-3 text-white outline-none focus:border-cyan-300/25"
                      >
                        <option value="Weekly">Weekly</option>
                        <option value="Monthly">Monthly</option>
                        <option value="Quarterly">Quarterly</option>
                        <option value="Yearly">Yearly</option>
                      </select>
                    </Field>
                    <Field label="Reminder lead time (hours)">
                      <input
                        type="number"
                        min="1"
                        value={form.reminderHours}
                        onChange={(event) => update("reminderHours", Number(event.target.value))}
                        className="w-full rounded-[20px] border border-white/10 bg-slate-950/45 px-4 py-3 text-white outline-none focus:border-cyan-300/25"
                      />
                    </Field>
                  </div>

                  <Field label="Next due time">
                    <input
                      type="datetime-local"
                      value={form.nextDueAt}
                      onChange={(event) => update("nextDueAt", event.target.value)}
                      className="w-full rounded-[20px] border border-white/10 bg-slate-950/45 px-4 py-3 text-white outline-none focus:border-cyan-300/25"
                    />
                  </Field>
                </div>
              ) : (
                <p className="mt-5 text-sm text-slate-400">
                  Turn this on for fixed subscriptions and custom reminder timing.
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-400">
            Committing this action updates the board instantly, plus wealth and reminder modules when enabled.
          </p>
          <button
            type="button"
            disabled={isSaving}
            onClick={onCommit}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-cyan-200/20 bg-gradient-to-r from-cyan-400/90 to-indigo-500/90 px-5 py-4 text-sm font-semibold text-slate-950 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Plus className="h-5 w-5" />
            {isSaving ? "Committing..." : "Commit Action"}
          </button>
        </div>
      </div>
    </div>
  );
}
