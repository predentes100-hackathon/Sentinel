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
    <section className="glass-panel min-h-[calc(100vh-2rem)] rounded-[8px] p-4 sm:p-6">
      <div className="grid gap-6 xl:grid-cols-[1.65fr_1fr]">
        <div className="space-y-6">
          <div className="grid gap-4 xl:grid-cols-[1.25fr_0.9fr]">
            {/* Profile + XP Card */}
            <div className="glass-panel rounded-[8px] p-5 sm:p-6">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-4">
                  <Avatar member={member} large />
                  <div>
                    <p className="text-xs uppercase tracking-[0.32em] text-[#d0c5af]">Life OS · Command Center</p>
                    <h2 className="serif mt-2 text-3xl font-semibold tracking-tight text-[#dce3f0]">
                      Level {member.level}
                    </h2>
                    <p className="mt-2 text-sm text-[#d0c5af]">
                      Your operating rhythm looks strong. Keep stacking clean wins.
                    </p>
                  </div>
                </div>

                <div className="rounded-[4px] border border-[#D4AF37]/20 bg-[#D4AF37]/5 px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.28em] text-[#d0c5af]">Momentum</p>
                  <div className="mt-2 flex items-center gap-2 text-2xl font-semibold text-[#dce3f0]">
                    <BadgeCheck className="h-5 w-5 text-[#D4AF37]" />
                    {completionRate}% executed
                  </div>
                </div>
              </div>

              {/* Gold XP bar */}
              <div className="mt-6">
                <div className="flex items-center justify-between text-sm text-[#d0c5af]">
                  <span className="mono">
                    {member.xp}/{member.xpGoal} XP to Level {member.level + 1}
                  </span>
                  <span className="text-xs uppercase tracking-[0.25em] text-[#D4AF37]">
                    Golden Thread
                  </span>
                </div>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#080f17]">
                  <div
                    className="progress-shimmer h-full rounded-full bg-gradient-to-r from-[#D4AF37] via-[#f2ca50] to-[#D4AF37] transition-all duration-700"
                    style={{ width: `${Math.min((member.xp / member.xpGoal) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Balance Pulse */}
            <div className="glass-panel rounded-[8px] p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.32em] text-[#d0c5af]">Wealth Widget</p>
                  <h3 className="serif mt-2 text-xl font-semibold text-[#dce3f0]">Balance Pulse</h3>
                </div>
                <div className="rounded-[4px] border border-[#D4AF37]/20 bg-[#D4AF37]/10 p-3 text-[#D4AF37]">
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

          {/* Task Board */}
          <div className="glass-panel rounded-[8px] p-5 sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.32em] text-[#d0c5af]">Action Board</p>
                <h3 className="serif mt-2 text-2xl font-semibold text-[#dce3f0]">Today&apos;s mission queue</h3>
              </div>
              <div className="rounded-[4px] border border-[#D4AF37]/20 bg-[#D4AF37]/5 px-4 py-2 text-sm text-[#d0c5af]">
                {tasks.filter((task) => !task.completed).length} active actions
              </div>
            </div>

            <div className="mt-6 grid gap-4">
              {tasks.map((task) => {
                const meta = PRIORITY_META[task.priority];
                return (
                  <article
                    key={task.id}
                    className={`relative overflow-hidden rounded-[4px] border p-4 transition sm:p-5 ${
                      task.completed
                        ? "border-[#D4AF37]/15 bg-[#D4AF37]/5"
                        : "border-[#D4AF37]/10 bg-[#192029] hover:-translate-y-0.5 hover:border-[#D4AF37]/25 hover:bg-[#232a34]"
                    }`}
                  >
                    {/* Priority left-border marker */}
                    <div className={`absolute inset-y-0 left-0 w-0.5 bg-gradient-to-b ${meta.glowClass}`} />
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="pr-4">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`inline-flex items-center rounded-[2px] border px-3 py-1 text-xs font-semibold ${meta.pillClass}`}
                          >
                            {meta.label}
                          </span>
                          {task.recurrenceType === "daily" ? (
                            <span className="inline-flex items-center rounded-[2px] border border-[#D4AF37]/20 bg-[#D4AF37]/10 px-3 py-1 text-xs font-semibold text-[#D4AF37]">
                              Daily
                            </span>
                          ) : null}
                          <span className="inline-flex items-center rounded-[2px] border border-[#4d4635] bg-[#080f17] px-3 py-1 text-xs text-[#d0c5af]">
                            +{task.xpValue} XP
                          </span>
                          <span className="text-xs uppercase tracking-[0.28em] text-[#99907c]">
                            {task.dueLabel}
                          </span>
                        </div>
                        <h4 className="mt-4 text-lg font-semibold text-[#dce3f0]">{task.title}</h4>
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#d0c5af]">{task.description}</p>
                        {task.recurrenceType === "daily" ? (
                          <p className="mt-2 text-xs uppercase tracking-[0.24em] text-[#D4AF37]/70">
                            Resets automatically tomorrow
                          </p>
                        ) : null}
                      </div>

                      <button
                        type="button"
                        disabled={task.completed}
                        onClick={() => onCompleteTask(task.id)}
                        className={`inline-flex min-w-[160px] items-center justify-center gap-2 rounded-[4px] border px-4 py-3 text-sm font-semibold transition ${
                          task.completed
                            ? "border-[#D4AF37]/20 bg-[#D4AF37]/10 text-[#D4AF37]"
                            : "border-[#D4AF37]/20 bg-[#192029] text-[#dce3f0] hover:border-[#D4AF37]/40 hover:bg-[#D4AF37]/10 hover:text-[#D4AF37]"
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
          {/* Telemetry cards */}
          <div className="glass-panel rounded-[8px] p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.32em] text-[#d0c5af]">Focus Readout</p>
                <h3 className="serif mt-2 text-xl font-semibold text-[#dce3f0]">Execution telemetry</h3>
              </div>
              <div className="rounded-[4px] border border-[#D4AF37]/15 bg-[#D4AF37]/5 p-3 text-[#D4AF37]">
                <LineChart className="h-5 w-5" />
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              <MetricCard
                title="Deep work queued"
                value={`${tasks.filter((task) => task.priority === "Deep Work" && !task.completed).length}`}
                sublabel="high-leverage blocks"
                icon={Target}
                tone="gold"
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

          {/* Subscriptions */}
          <div className="glass-panel rounded-[8px] p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.32em] text-[#d0c5af]">Subscriptions</p>
                <h3 className="serif mt-2 text-xl font-semibold text-[#dce3f0]">Upcoming reminders</h3>
              </div>
              <BellRing className="h-5 w-5 text-[#D4AF37]" />
            </div>

            <div className="mt-5 space-y-3">
              {subscriptions.map((subscription) => (
                <div
                  key={subscription.id}
                  className="rounded-[4px] border border-[#D4AF37]/15 bg-[#192029] p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-[#dce3f0]">{subscription.title}</p>
                      <p className="mt-1 text-xs text-[#99907c]">
                        {subscription.frequency} | remind {Math.floor(subscription.reminderMinutes / 60)}h before
                      </p>
                    </div>
                    <div className="rounded-[4px] border border-[#D4AF37]/25 bg-[#D4AF37]/10 px-3 py-2 text-sm text-[#D4AF37]">
                      {formatCurrency(subscription.amount)}
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-sm text-[#d0c5af]">
                    <CalendarClock className="h-4 w-4 text-[#99907c]" />
                    Due {formatDateTime(subscription.nextDueAt)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Habit Streak Grid */}
      <div className="mt-6 glass-panel rounded-[8px] p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-[#d0c5af]">Habit Streak</p>
            <h3 className="serif mt-2 text-xl font-semibold text-[#dce3f0]">Daily routines with XP feedback</h3>
          </div>
          <div className="rounded-[4px] border border-[#D4AF37]/20 bg-[#D4AF37]/5 px-4 py-2 text-xs uppercase tracking-[0.28em] text-[#d0c5af]">
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
                className={`relative min-w-[220px] overflow-hidden rounded-[4px] border p-5 text-left transition ${
                  habit.completed
                    ? "border-[#D4AF37]/25 bg-[#D4AF37]/8"
                    : "border-[#D4AF37]/12 bg-[#192029] hover:-translate-y-0.5 hover:border-[#D4AF37]/30 hover:bg-[#232a34]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`rounded-[4px] p-3 ${
                      habit.completed ? "bg-[#D4AF37]/15 text-[#D4AF37]" : "bg-[#232a34] text-[#d0c5af]"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="rounded-[2px] border border-[#4d4635] bg-[#080f17] px-3 py-1 text-xs text-[#d0c5af]">
                    +{habit.xpValue} XP
                  </span>
                </div>
                <h4 className="mt-4 text-base font-semibold text-[#dce3f0]">{habit.title}</h4>
                <p className="mt-2 text-sm text-[#99907c]">
                  {habit.completed ? "Streak secured for today" : "Click to lock the streak and bank XP"}
                </p>
                {habitBurstId === habit.id ? (
                  <span className="absolute right-5 top-3 rounded-[2px] bg-[#D4AF37]/15 px-3 py-1 text-xs font-semibold text-[#D4AF37] animate-float-up">
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
