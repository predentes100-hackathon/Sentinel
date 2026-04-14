import {
  ArrowDownRight,
  ArrowUpRight,
  BadgeCheck,
  BellRing,
  CalendarClock,
  Check,
  Flame,
  IndianRupee,
  LineChart,
  Target
} from "lucide-react";
import { formatCurrency, formatDateTime, HABIT_ICON_MAP, PRIORITY_META } from "../data";
import { Avatar, MetricCard, WealthStat } from "../components/shared";
import type { HabitItem, MemberProfile, SubscriptionItem, TaskItem } from "../types";

export function CommandCenter({
  member,
  tasks,
  habits,
  subscriptions,
  completionRate,
  habitBurstId,
  onCompleteTask,
  onCompleteHabit
}: {
  member: MemberProfile;
  tasks: TaskItem[];
  habits: HabitItem[];
  subscriptions: SubscriptionItem[];
  completionRate: number;
  habitBurstId: string | null;
  onCompleteTask: (taskId: string) => void;
  onCompleteHabit: (habitId: string) => void;
}) {
  return (
    <section className="glass-panel min-h-[calc(100vh-2rem)] rounded-[32px] p-4 sm:p-6">
      <div className="grid gap-6 xl:grid-cols-[1.65fr_1fr]">
        <div className="space-y-6">
          <div className="grid gap-4 xl:grid-cols-[1.25fr_0.9fr]">
            <div className="glass-panel rounded-[28px] p-5 sm:p-6">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-4">
                  <Avatar member={member} large />
                  <div>
                    <p className="text-xs uppercase tracking-[0.32em] text-slate-400">Top Header</p>
                    <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white">
                      Level {member.level}
                    </h2>
                    <p className="mt-2 text-sm text-slate-400">
                      Your operating rhythm looks strong. Keep stacking clean wins.
                    </p>
                  </div>
                </div>

                <div className="rounded-[24px] border border-white/10 bg-white/[0.03] px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Momentum</p>
                  <div className="mt-2 flex items-center gap-2 text-2xl font-semibold text-white">
                    <BadgeCheck className="h-5 w-5 text-cyan-200" />
                    {completionRate}% executed
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <div className="flex items-center justify-between text-sm text-slate-300">
                  <span className="mono">
                    {member.xp}/{member.xpGoal} XP to Level {member.level + 1}
                  </span>
                  <span className="text-xs uppercase tracking-[0.25em] text-cyan-200">
                    Animated Progress
                  </span>
                </div>
                <div className="mt-3 h-4 overflow-hidden rounded-full bg-slate-950/50">
                  <div
                    className="progress-shimmer h-full animate-shimmer rounded-full bg-gradient-to-r from-cyan-300 via-indigo-300 to-fuchsia-300 transition-all duration-700"
                    style={{ width: `${Math.min((member.xp / member.xpGoal) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="glass-panel rounded-[28px] p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.32em] text-slate-400">Wealth Widget</p>
                  <h3 className="mt-2 text-xl font-semibold text-white">Balance Pulse</h3>
                </div>
                <div className="rounded-2xl border border-emerald-300/15 bg-emerald-400/10 p-3 text-emerald-100">
                  <IndianRupee className="h-5 w-5" />
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <WealthStat
                  label="Total Balance"
                  value={formatCurrency(member.totalBalance)}
                  delta="Live from member profile"
                  icon={Target}
                />
                <WealthStat
                  label="MTD Spend"
                  value={formatCurrency(member.monthlySpend)}
                  delta="This month's burn"
                  icon={ArrowDownRight}
                  negative
                />
                <WealthStat
                  label="MTD Earned"
                  value={formatCurrency(member.monthlyEarned)}
                  delta="Current month inflow"
                  icon={ArrowUpRight}
                />
              </div>
            </div>
          </div>

          <div className="glass-panel rounded-[28px] p-5 sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.32em] text-slate-400">Action Board</p>
                <h3 className="mt-2 text-2xl font-semibold text-white">Today&apos;s mission queue</h3>
              </div>
              <div className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-slate-300">
                {tasks.filter((task) => !task.completed).length} active actions
              </div>
            </div>

            <div className="mt-6 grid gap-4">
              {tasks.map((task) => {
                const meta = PRIORITY_META[task.priority];
                return (
                  <article
                    key={task.id}
                    className={`relative overflow-hidden rounded-[26px] border p-4 transition sm:p-5 ${
                      task.completed
                        ? "border-emerald-300/20 bg-emerald-500/10"
                        : "border-white/8 bg-white/[0.03] hover:-translate-y-0.5 hover:border-white/12 hover:bg-white/[0.05]"
                    }`}
                  >
                    <div className={`absolute inset-y-0 left-0 w-1 bg-gradient-to-b ${meta.glowClass}`} />
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="pr-4">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${meta.pillClass}`}
                          >
                            {meta.label}
                          </span>
                          {task.recurrenceType === "daily" ? (
                            <span className="inline-flex items-center rounded-full border border-fuchsia-300/20 bg-fuchsia-400/10 px-3 py-1 text-xs font-semibold text-fuchsia-100">
                              Daily
                            </span>
                          ) : null}
                          <span className="inline-flex items-center rounded-full border border-white/10 bg-slate-950/50 px-3 py-1 text-xs text-slate-300">
                            +{task.xpValue} XP
                          </span>
                          <span className="text-xs uppercase tracking-[0.28em] text-slate-500">
                            {task.dueLabel}
                          </span>
                        </div>
                        <h4 className="mt-4 text-lg font-semibold text-white">{task.title}</h4>
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">{task.description}</p>
                        {task.recurrenceType === "daily" ? (
                          <p className="mt-2 text-xs uppercase tracking-[0.24em] text-fuchsia-200">
                            Resets automatically tomorrow
                          </p>
                        ) : null}
                      </div>

                      <button
                        type="button"
                        disabled={task.completed}
                        onClick={() => onCompleteTask(task.id)}
                        className={`inline-flex min-w-[160px] items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                          task.completed
                            ? "border-emerald-300/15 bg-emerald-400/10 text-emerald-100"
                            : "border-cyan-300/15 bg-cyan-400/10 text-cyan-100 hover:border-cyan-200/25 hover:bg-cyan-300/15"
                        }`}
                      >
                        <Check className="h-4 w-4" />
                        {task.completed ? "Completed" : "Mark done"}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-panel rounded-[28px] p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.32em] text-slate-400">Focus Readout</p>
                <h3 className="mt-2 text-xl font-semibold text-white">Execution telemetry</h3>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-cyan-100">
                <LineChart className="h-5 w-5" />
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              <MetricCard
                title="Deep work queued"
                value={`${tasks.filter((task) => task.priority === "Deep Work" && !task.completed).length}`}
                sublabel="high-leverage blocks"
                icon={Target}
                tone="fuchsia"
              />
              <MetricCard
                title="Completed today"
                value={`${tasks.filter((task) => task.completed).length}`}
                sublabel="actions pushed across the line"
                icon={Check}
                tone="emerald"
              />
              <MetricCard
                title="Daily rituals"
                value={`${habits.filter((habit) => habit.completed).length}/${habits.length}`}
                sublabel="habit streak cards claimed"
                icon={Flame}
                tone="amber"
              />
            </div>
          </div>

          <div className="glass-panel rounded-[28px] p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.32em] text-slate-400">Subscriptions</p>
                <h3 className="mt-2 text-xl font-semibold text-white">Upcoming reminders</h3>
              </div>
              <BellRing className="h-5 w-5 text-cyan-200" />
            </div>

            <div className="mt-5 space-y-3">
              {subscriptions.map((subscription) => (
                <div
                  key={subscription.id}
                  className="rounded-[24px] border border-white/8 bg-white/[0.03] p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-white">{subscription.title}</p>
                      <p className="mt-1 text-xs text-slate-400">
                        {subscription.frequency} | remind {Math.floor(subscription.reminderMinutes / 60)}h before
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-slate-950/50 px-3 py-2 text-sm text-cyan-100">
                      {formatCurrency(subscription.amount)}
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-sm text-slate-300">
                    <CalendarClock className="h-4 w-4 text-slate-500" />
                    Due {formatDateTime(subscription.nextDueAt)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 glass-panel rounded-[28px] p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-slate-400">Habit Streak</p>
            <h3 className="mt-2 text-xl font-semibold text-white">Daily routines with XP feedback</h3>
          </div>
          <div className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs uppercase tracking-[0.28em] text-slate-300">
            Tap to complete
          </div>
        </div>

        <div className="mt-6 flex gap-4 overflow-x-auto pb-2 hide-scrollbar">
          {habits.map((habit) => {
            const Icon = HABIT_ICON_MAP[habit.iconKey];
            return (
              <button
                key={habit.id}
                type="button"
                onClick={() => onCompleteHabit(habit.id)}
                disabled={habit.completed}
                className={`relative min-w-[220px] overflow-hidden rounded-[26px] border p-5 text-left transition ${
                  habit.completed
                    ? "border-emerald-300/20 bg-emerald-500/10"
                    : "border-white/8 bg-white/[0.03] hover:-translate-y-0.5 hover:border-cyan-200/20 hover:bg-white/[0.05]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`rounded-2xl p-3 ${
                      habit.completed ? "bg-emerald-400/15 text-emerald-100" : "bg-white/5 text-cyan-100"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="rounded-full border border-white/10 bg-slate-950/50 px-3 py-1 text-xs text-slate-300">
                    +{habit.xpValue} XP
                  </span>
                </div>
                <h4 className="mt-4 text-base font-semibold text-white">{habit.title}</h4>
                <p className="mt-2 text-sm text-slate-400">
                  {habit.completed ? "Completed for today" : "Click to lock the streak and bank XP"}
                </p>
                {habitBurstId === habit.id ? (
                  <span className="absolute right-5 top-3 rounded-full bg-cyan-400/15 px-3 py-1 text-xs font-semibold text-cyan-100 animate-float-up">
                    +{habit.xpValue} XP
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
