import { useState } from "react";
import { Plus, X, Sparkles, Loader2 } from "lucide-react";
import { FINANCE_CATEGORIES, PRIORITY_META, formatCurrency } from "../data";
import { Field, Toggle } from "../components/shared";
import { useAppStore } from "../store";
import { generateActionSuggestions, type AISuggestion } from "../lib/gemini";
import type { ActionFormState, FinanceCategory, SubscriptionItem, TransactionType } from "../types";

export function ActionForgeModal({
  form, isSaving, splitNames, liveSplitSummary, splitPerHead,
  onClose, onFormChange, onCommit
}: {
  form: ActionFormState; isSaving: boolean; splitNames: string[];
  liveSplitSummary: string; splitPerHead: number;
  onClose: () => void;
  onFormChange: (updater: ActionFormState | ((current: ActionFormState) => ActionFormState)) => void;
  onCommit: () => void;
}) {
  const store = useAppStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);

  function update<K extends keyof ActionFormState>(key: K, value: ActionFormState[K]) {
    onFormChange((current) => ({ ...current, [key]: value }));
  }

  function updateSplitName(index: number, value: string) {
    onFormChange((current) => ({
      ...current,
      splitNames: current.splitNames.map((name, i) => (i === index ? value : name))
    }));
  }

  function addSplitName() {
    onFormChange((current) => ({ ...current, splitNames: [...current.splitNames, ""] }));
  }

  function removeSplitName(index: number) {
    onFormChange((current) => ({
      ...current,
      splitNames: current.splitNames.filter((_, i) => i !== index)
    }));
  }

  async function handleGenerate() {
    if (!store.aiProfile) return;
    setIsGenerating(true);
    try {
      const results = await generateActionSuggestions(store.aiProfile);
      setSuggestions(results);
    } catch (err: any) {
      console.error(err);
      alert("AI Error: " + (err.message || "Failed to generate AI ideas."));
    } finally {
      setIsGenerating(false);
    }
  }

  function applySuggestion(suggestion: AISuggestion) {
    onFormChange((current) => ({
      ...current,
      title: suggestion.title,
      description: suggestion.description,
      priority: suggestion.priority
    }));
    setSuggestions([]);
  }

  const inputClass = "w-full rounded-[4px] border border-[#D4AF37]/15 bg-[#232a34] px-4 py-4 text-[#dce3f0] outline-none transition placeholder:text-[#99907c] focus:border-[#D4AF37]/50 focus:ring-0";
  const selectClass = "w-full rounded-[4px] border border-[#D4AF37]/15 bg-[#232a34] px-4 py-3 text-[#dce3f0] outline-none focus:border-[#D4AF37]/50";

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-[#0d141d]/70 p-4 backdrop-blur-md">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Action Forge"
        className="max-h-[92vh] w-full max-w-4xl overflow-auto rounded-[8px] border border-[#D4AF37]/20 bg-[#192029]/90 p-5 backdrop-blur-2xl sm:p-8"
        style={{ boxShadow: "0 0 60px rgba(212,175,55,0.06), 0 24px 80px rgba(0,0,0,0.6)" }}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-[#99907c]">Action Forge</p>
            <h2 className="serif mt-2 text-3xl font-semibold tracking-tight text-[#dce3f0]">Commit your next move</h2>
            <p className="mt-2 text-sm text-[#99907c]">
              Title it, gamify it, wire the money flow, and optionally attach a subscription reminder.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleGenerate}
              disabled={isGenerating || !store.aiProfile}
              className="inline-flex items-center justify-center gap-2 rounded-[4px] border border-[#D4AF37]/20 bg-[#D4AF37]/10 px-4 py-2 text-sm font-medium text-[#D4AF37] transition hover:bg-[#D4AF37]/20 disabled:opacity-50"
            >
              {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              Generate AI Ideas
            </button>
            <button
              type="button"
              aria-label="Close Action Forge"
              onClick={onClose}
              className="rounded-[4px] border border-[#D4AF37]/20 bg-[#232a34] p-3 text-[#d0c5af] transition hover:border-[#D4AF37]/40 hover:text-[#D4AF37]"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* AI Suggestions Box */}
        {suggestions.length > 0 && (
          <div className="mt-6 space-y-3 rounded-[8px] border border-[#D4AF37]/30 bg-[#D4AF37]/5 p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[#D4AF37]">AI Suggestions</h3>
              <button onClick={() => setSuggestions([])} className="text-xs text-[#99907c] hover:text-white">Clear</button>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => applySuggestion(s)}
                  className="rounded-[4px] border border-[#D4AF37]/20 bg-[#232a34] p-3 text-left transition hover:border-[#D4AF37]/50"
                >
                  <p className="font-semibold text-[#dce3f0]">{s.title}</p>
                  <p className="mt-1 line-clamp-2 text-xs text-[#99907c]">{s.description}</p>
                  <span className="mt-2 inline-block rounded-[2px] bg-[#192029] px-2 py-1 text-[10px] uppercase text-[#D4AF37]">
                    {s.priority}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Body grid */}
        <div className="mt-8 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-5">
            {/* Title */}
            <Field label="Action Title">
              <input
                value={form.title}
                onChange={(e) => update("title", e.target.value)}
                placeholder="Finish AxiomIVE onboarding flow"
                className={inputClass}
              />
            </Field>

            {/* Description */}
            <Field label="Description">
              <textarea
                rows={5}
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                placeholder="Capture the why, the deliverable, and any context your future self will thank you for."
                className={inputClass}
              />
            </Field>

            {/* Priority pills */}
            <Field label="Priority Level" helper="XP is automatically assigned: Low 10, Medium 20, High 30, Deep Work 50.">
              <div className="grid gap-3 sm:grid-cols-2">
                {(Object.keys(PRIORITY_META) as Array<keyof typeof PRIORITY_META>).map((priority) => {
                  const meta = PRIORITY_META[priority];
                  const active = form.priority === priority;
                  return (
                    <button
                      key={priority}
                      type="button"
                      onClick={() => update("priority", priority)}
                      className={`rounded-[4px] border p-4 text-left transition ${
                        active
                          ? "border-[#D4AF37]/50 bg-[#D4AF37]/10 text-[#D4AF37]"
                          : "border-[#D4AF37]/12 bg-[#232a34] text-[#d0c5af] hover:border-[#D4AF37]/25 hover:bg-[#2e353f]"
                      }`}
                      style={active ? { boxShadow: "0 0 16px rgba(212,175,55,0.10)" } : undefined}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">{priority}</span>
                        <span className="rounded-[2px] border border-[#4d4635] bg-[#080f17] px-3 py-1 text-xs text-[#D4AF37]">
                          +{meta.xp} XP
                        </span>
                      </div>
                      <p className={`mt-2 text-sm ${active ? "text-[#D4AF37]/80" : "text-[#99907c]"}`}>
                        {priority === "Low" ? "Quick reset"
                          : priority === "Medium" ? "Structured follow-through"
                          : priority === "High" ? "High-friction deliverable"
                          : "Full-focus execution block"}
                      </p>
                    </button>
                  );
                })}
              </div>
            </Field>

            {/* Repeats Daily */}
            <div className="rounded-[8px] border border-[#D4AF37]/15 bg-[#232a34] p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-[#99907c]">Daily Task Engine</p>
                  <h3 className="serif mt-2 text-xl font-semibold text-[#dce3f0]">Repeat every day</h3>
                  <p className="mt-2 text-sm text-[#99907c]">
                    Daily tasks reset automatically each new day and can award XP once per day.
                  </p>
                </div>
                <Toggle checked={form.repeatsDaily} onChange={(checked) => update("repeatsDaily", checked)} />
              </div>
              {form.repeatsDaily ? (
                <div className="mt-5">
                  <Field label="Daily time">
                    <input type="time" value={form.dailyTime}
                      onChange={(e) => update("dailyTime", e.target.value)}
                      className={selectClass} />
                  </Field>
                </div>
              ) : (
                <p className="mt-5 text-sm text-[#99907c]">
                  Leave this off for one-time tasks that disappear after completion.
                </p>
              )}
            </div>
          </div>

          <div className="space-y-5">
            {/* Transaction toggle */}
            <div className="rounded-[8px] border border-[#D4AF37]/15 bg-[#232a34] p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-[#99907c]">Finance Engine</p>
                  <h3 className="serif mt-2 text-xl font-semibold text-[#dce3f0]">Transaction-aware action</h3>
                </div>
                <Toggle checked={form.involvesTransaction}
                  onChange={(checked) => update("involvesTransaction", checked)} />
              </div>

              {form.involvesTransaction ? (
                <div className="mt-5 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Type">
                      <select value={form.transactionType}
                        onChange={(e) => update("transactionType", e.target.value as TransactionType)}
                        className={selectClass}>
                        <option value="Spend">Spend</option>
                        <option value="Earn">Earn</option>
                      </select>
                    </Field>
                    <Field label="Amount (₹)">
                      <input type="number" min="0" value={form.amount}
                        onChange={(e) => update("amount", e.target.value)}
                        className={selectClass} placeholder="500" />
                    </Field>
                  </div>

                  <Field label="Category">
                    <select value={form.category}
                      onChange={(e) => update("category", e.target.value as FinanceCategory)}
                      className={selectClass}>
                      {FINANCE_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Tags" helper="Comma separated (e.g. travel, dinner)">
                    <input value={form.tags}
                      onChange={(e) => update("tags", e.target.value)}
                      placeholder="uber, late-night"
                      className={inputClass} />
                  </Field>

                  {/* Split Bill */}
                  <div className="space-y-3 rounded-[4px] border border-[#D4AF37]/12 bg-[#2e353f] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold text-[#dce3f0]">Split Bill?</p>
                        <p className="mt-1 text-sm text-[#99907c]">Share the amount with friends and see the split live.</p>
                      </div>
                      <Toggle checked={form.splitBill} onChange={(checked) => update("splitBill", checked)} />
                    </div>

                    {form.splitBill ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between gap-3 rounded-[4px] border border-[#D4AF37]/12 bg-[#232a34] px-4 py-3">
                          <div>
                            <p className="font-medium text-[#dce3f0]">Am I included?</p>
                            <p className="mt-1 text-xs text-[#99907c]">Toggle off if you paid on behalf of everyone else.</p>
                          </div>
                          <Toggle checked={form.amIncluded} onChange={(checked) => update("amIncluded", checked)} />
                        </div>

                        <div className="space-y-3">
                          {form.splitNames.map((name, index) => (
                            <div key={`${index}-${name}`} className="flex gap-3">
                              <input value={name}
                                onChange={(e) => updateSplitName(index, e.target.value)}
                                placeholder={index === 0 ? "Nihali" : "Add another name"}
                                className="w-full rounded-[4px] border border-[#D4AF37]/15 bg-[#232a34] px-4 py-3 text-[#dce3f0] outline-none focus:border-[#D4AF37]/40 placeholder:text-[#99907c]" />
                              {form.splitNames.length > 1 ? (
                                <button type="button" onClick={() => removeSplitName(index)}
                                  className="rounded-[4px] border border-[#D4AF37]/15 bg-[#2e353f] px-4 py-3 text-[#d0c5af] transition hover:border-[#D4AF37]/30">
                                  Remove
                                </button>
                              ) : null}
                            </div>
                          ))}
                        </div>

                        <button type="button" onClick={addSplitName}
                          className="inline-flex items-center gap-2 rounded-[4px] border border-[#D4AF37]/20 bg-[#D4AF37]/5 px-4 py-3 text-sm text-[#D4AF37] transition hover:bg-[#D4AF37]/10">
                          <Plus className="h-4 w-4" />
                          Add name
                        </button>

                        <div className="rounded-[4px] border border-[#D4AF37]/25 bg-[#D4AF37]/8 p-4">
                          <p className="text-sm font-semibold text-[#D4AF37]">{liveSplitSummary}</p>
                          {splitNames.length > 0 && splitPerHead > 0 ? (
                            <p className="mt-2 text-sm text-[#D4AF37]/80">
                              {splitNames.join(", ")} {splitNames.length === 1 ? "owes" : "owe"} {formatCurrency(splitPerHead)} each.
                            </p>
                          ) : null}
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              ) : (
                <p className="mt-5 text-sm text-[#99907c]">
                  Toggle this on to log spend/earn activity, categories, splits, and balance updates.
                </p>
              )}
            </div>

            {/* Subscription toggle */}
            <div className="rounded-[8px] border border-[#D4AF37]/15 bg-[#232a34] p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-[#99907c]">Subscription Reminder</p>
                  <h3 className="serif mt-2 text-xl font-semibold text-[#dce3f0]">Recurring charge tracking</h3>
                </div>
                <Toggle checked={form.createSubscription}
                  onChange={(checked) => update("createSubscription", checked)} />
              </div>

              {form.createSubscription ? (
                <div className="mt-5 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Frequency">
                      <select value={form.subscriptionFrequency}
                        onChange={(e) => update("subscriptionFrequency", e.target.value as SubscriptionItem["frequency"])}
                        className={selectClass}>
                        <option value="Weekly">Weekly</option>
                        <option value="Monthly">Monthly</option>
                        <option value="Quarterly">Quarterly</option>
                        <option value="Yearly">Yearly</option>
                      </select>
                    </Field>
                    <Field label="Reminder lead time (hours)">
                      <input type="number" min="1" value={form.reminderHours}
                        onChange={(e) => update("reminderHours", Number(e.target.value))}
                        className={selectClass} />
                    </Field>
                  </div>
                  <Field label="Next due time">
                    <input type="datetime-local" value={form.nextDueAt}
                      onChange={(e) => update("nextDueAt", e.target.value)}
                      className={selectClass} />
                  </Field>
                </div>
              ) : (
                <p className="mt-5 text-sm text-[#99907c]">
                  Turn this on for fixed subscriptions and custom reminder timing.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-t border-[#D4AF37]/10 pt-6">
          <p className="text-sm text-[#99907c]">
            Committing this action updates the board instantly, plus wealth and reminder modules when enabled.
          </p>
          <div className="flex items-center gap-3">
            <button type="button" onClick={onClose}
              className="inline-flex items-center justify-center gap-2 rounded-[4px] border border-[#D4AF37]/25 bg-transparent px-5 py-3 text-sm font-semibold text-[#d0c5af] transition hover:border-[#D4AF37]/50 hover:text-[#D4AF37]">
              Cancel
            </button>
            <button type="button" disabled={isSaving} onClick={onCommit}
              className="inline-flex items-center justify-center gap-2 rounded-[4px] bg-[#D4AF37] px-6 py-3 text-sm font-bold text-[#0d141d] transition hover:bg-[#f2ca50] disabled:cursor-not-allowed disabled:opacity-60"
              style={{ boxShadow: "0 0 24px rgba(212,175,55,0.25)" }}>
              <Plus className="h-5 w-5" />
              {isSaving ? "Committing..." : "Commit Action"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
