import { Suspense, lazy, startTransition, useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import {
  Check,
  Database,
  LogIn,
  LogOut,
  Plus,
  Target,
  Users
} from "lucide-react";
import {
  DEFAULT_HABITS,
  DEFAULT_MEMBER,
  DEFAULT_SUBSCRIPTIONS,
  DEFAULT_TASKS,
  DEFAULT_TRANSACTIONS,
  STORAGE_KEY,
  TODAY,
  TODAY_LABEL,
  VIEWS,
  buildFinancialComparisonSeries,
  buildInitialActionForm,
  buildMonthlyCalendarHeatmap,
  buildTrendSeries,
  buildWeeklyHeatmap,
  calculateXpGoal,
  escapeCsv,
  formatCurrency,
  formatIndianTaxYear,
  isDateInCurrentMonth,
  isWithinIndianTaxYear,
  loadCachedState,
  sortTransactions
} from "./data";
import { Avatar, MetricCard, SyncBadge } from "./components/shared";
import { isSupabaseConfigured, supabase } from "./lib/supabase";
import type {
  MemberProfile,
  SortDirection,
  SortKey,
  SubscriptionItem,
  SyncState,
  TaskItem,
  ToastState,
  TransactionItem,
  ViewKey
} from "./types";

const CommandCenter = lazy(async () => {
  const module = await import("./views/CommandCenter");
  return { default: module.CommandCenter };
});

const WealthLedger = lazy(async () => {
  const module = await import("./views/WealthLedger");
  return { default: module.WealthLedger };
});

const AnalyticsHub = lazy(async () => {
  const module = await import("./views/AnalyticsHub");
  return { default: module.AnalyticsHub };
});

const NewUserBlankState = lazy(async () => {
  const module = await import("./views/NewUserBlankState");
  return { default: module.NewUserBlankState };
});

const ActionForgeModal = lazy(async () => {
  const module = await import("./views/ActionForgeModal");
  return { default: module.ActionForgeModal };
});

type RemoteMemberRow = {
  user_id: string;
  display_name: string;
  avatar_url: string | null;
  level: number;
  xp: number;
  xp_goal: number;
  total_balance: number;
  monthly_spend: number;
  monthly_earned: number;
};

type RemoteTaskRow = {
  id: string;
  title: string;
  description: string;
  priority: TaskItem["priority"];
  xp_value: number;
  due_label: string;
  completed: boolean;
  recurrence_type?: "once" | "daily" | null;
  scheduled_time?: string | null;
  last_completed_on?: string | null;
};

type RemoteHabitRow = {
  id: string;
  title: string;
  icon_key: "surya" | "footwork" | "read" | "hydrate";
  xp_value: number;
  completed: boolean;
};

type RemoteTransactionRow = {
  id: string;
  transaction_date: string;
  task_name: string;
  category: TransactionItem["category"];
  transaction_type: TransactionItem["type"];
  amount: number;
  split_status: TransactionItem["splitStatus"];
  participants: string[];
  owed_to_me: number;
};

type RemoteSubscriptionRow = {
  id: string;
  title: string;
  amount: number;
  frequency: SubscriptionItem["frequency"];
  next_due_at: string;
  reminder_minutes: number;
};

function App() {
  const cached = loadCachedState();
  const [activeView, setActiveView] = useState<ViewKey>("command");
  const [member, setMember] = useState<MemberProfile>(cached.member);
  const [tasks, setTasks] = useState<TaskItem[]>(cached.tasks);
  const [habits, setHabits] = useState(cached.habits);
  const [transactions, setTransactions] = useState<TransactionItem[]>(cached.transactions);
  const [subscriptions, setSubscriptions] = useState<SubscriptionItem[]>(cached.subscriptions);
  const [session, setSession] = useState<Session | null>(null);
  const [syncState, setSyncState] = useState<SyncState>(isSupabaseConfigured ? "syncing" : "demo");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [habitBurstId, setHabitBurstId] = useState<string | null>(null);
  const [exportOpen, setExportOpen] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [isSaving, setIsSaving] = useState(false);
  const [actionForm, setActionForm] = useState(buildInitialActionForm());

  useEffect(() => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ member, tasks, habits, transactions, subscriptions })
    );
  }, [habits, member, subscriptions, tasks, transactions]);

  useEffect(() => {
    const client = supabase;
    if (!client) {
      setSyncState("demo");
      return;
    }

    let isActive = true;

    startTransition(() => {
      void client.auth.getSession().then(({ data, error }) => {
        if (!isActive) {
          return;
        }
        if (error) {
          setSyncState("error");
          pushToast("Supabase session check failed. Staying in demo mode.");
          return;
        }

        setSession(data.session ?? null);
        if (data.session?.user) {
          setSyncState("syncing");
          void loadDashboardFromSupabase(data.session.user);
        } else {
          setSyncState("demo");
        }
      });
    });

    const { data: listener } = client.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      if (nextSession?.user) {
        setSyncState("syncing");
        startTransition(() => {
          void loadDashboardFromSupabase(nextSession.user);
        });
      } else {
        setSyncState("demo");
      }
    });

    return () => {
      isActive = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const currentUser = session?.user ?? null;
  const displayTasks = tasks.map((task) => ({
    ...task,
    completed: isTaskCompletedForToday(task),
    dueLabel: getTaskDisplayDueLabel(task)
  }));
  const totalOwedToMe = transactions.reduce(
    (sum, transaction) => sum + (transaction.splitStatus === "Pending" ? transaction.owedToMe : 0),
    0
  );
  const burnRate = TODAY.getDate() > 0 ? member.monthlySpend / TODAY.getDate() : member.monthlySpend;
  const completedTasks = displayTasks.filter((task) => task.completed).length;
  const completionRate = displayTasks.length > 0 ? Math.round((completedTasks / displayTasks.length) * 100) : 0;
  const xpHeatmap = buildWeeklyHeatmap(14, member.xp + completedTasks * 6);
  const monthlyInflowHeatmap = buildMonthlyCalendarHeatmap("inflow", transactions);
  const monthlyOutflowHeatmap = buildMonthlyCalendarHeatmap("outflow", transactions);
  const trendSeries = buildTrendSeries(displayTasks, transactions);
  const comparisonSeries = buildFinancialComparisonSeries(transactions);
  const sortedTransactions = sortTransactions(transactions, sortKey, sortDirection);
  const splitNames = actionForm.splitNames.filter((name) => name.trim().length > 0);
  const splitParticipantCount =
    actionForm.splitBill && Number(actionForm.amount) > 0
      ? splitNames.length + (actionForm.amIncluded ? 1 : 0)
      : 0;
  const splitPerHead =
    splitParticipantCount > 0 ? Number(actionForm.amount || 0) / splitParticipantCount : 0;
  const liveSplitSummary =
    actionForm.splitBill && Number(actionForm.amount) > 0
      ? `${splitParticipantCount} participants | ${formatCurrency(splitPerHead)} each`
      : "Enable split bill to calculate shares.";
  const hasWorkspaceData =
    tasks.length > 0 ||
    habits.length > 0 ||
    transactions.length > 0 ||
    subscriptions.length > 0 ||
    member.totalBalance > 0 ||
    member.monthlySpend > 0 ||
    member.monthlyEarned > 0 ||
    member.xp > 0 ||
    member.level > 1;
  const showNewUserBlankState = Boolean(currentUser) && syncState !== "syncing" && !hasWorkspaceData;

  function pushToast(message: string) {
    setToast({ id: Date.now(), message });
  }

  useEffect(() => {
    if (!toast) {
      return;
    }
    const timeout = window.setTimeout(() => {
      setToast((current) => (current?.id === toast.id ? null : current));
    }, 2600);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  function updateMemberAndPersist(nextMember: MemberProfile) {
    setMember(nextMember);
    if (currentUser && supabase) {
      void saveMemberProfile(currentUser.id, nextMember);
    }
  }

  function awardXp(points: number) {
    setMember((current) => {
      let nextLevel = current.level;
      let nextGoal = current.xpGoal;
      let nextXp = current.xp + points;

      while (nextXp >= nextGoal) {
        nextXp -= nextGoal;
        nextLevel += 1;
        nextGoal = calculateXpGoal(nextLevel);
      }

      const nextMember = { ...current, level: nextLevel, xp: nextXp, xpGoal: nextGoal };
      if (currentUser && supabase) {
        void saveMemberProfile(currentUser.id, nextMember);
      }
      return nextMember;
    });
  }

  function updateBalances(transaction: TransactionItem) {
    const inCurrentMonth = isDateInCurrentMonth(transaction.date);
    setMember((current) => {
      const delta = transaction.type === "Earn" ? transaction.amount : -transaction.amount;
      const nextMember = {
        ...current,
        totalBalance: current.totalBalance + delta,
        monthlySpend:
          transaction.type === "Spend" && inCurrentMonth
            ? current.monthlySpend + transaction.amount
            : current.monthlySpend,
        monthlyEarned:
          transaction.type === "Earn" && inCurrentMonth
            ? current.monthlyEarned + transaction.amount
            : current.monthlyEarned
      };
      if (currentUser && supabase) {
        void saveMemberProfile(currentUser.id, nextMember);
      }
      return nextMember;
    });
  }

  async function loadDashboardFromSupabase(user: User) {
    if (!supabase) {
      return;
    }

    try {
      const [profileResponse, taskResponse, habitResponse, transactionResponse, subscriptionResponse] =
        await Promise.all([
          supabase.from("member_profiles").select("*").eq("user_id", user.id).maybeSingle(),
          supabase.from("tasks").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
          supabase.from("habits").select("*").eq("user_id", user.id).order("created_at", { ascending: true }),
          supabase
            .from("transactions")
            .select("*")
            .eq("user_id", user.id)
            .order("transaction_date", { ascending: false }),
          supabase
            .from("subscriptions")
            .select("*")
            .eq("user_id", user.id)
            .order("next_due_at", { ascending: true })
        ]);

      if (profileResponse.error && profileResponse.error.code !== "PGRST116") {
        throw profileResponse.error;
      }
      if (taskResponse.error || habitResponse.error || transactionResponse.error || subscriptionResponse.error) {
        throw taskResponse.error || habitResponse.error || transactionResponse.error || subscriptionResponse.error;
      }

      const remoteProfile = profileResponse.data as RemoteMemberRow | null;
      const remoteTasks = ((taskResponse.data as RemoteTaskRow[]) ?? []).map((row) => ({
        id: row.id,
        title: row.title,
        description: row.description,
        priority: row.priority,
        xpValue: row.xp_value,
        dueLabel: row.due_label,
        completed: row.completed,
        recurrenceType: row.recurrence_type ?? "once",
        scheduledTime: row.scheduled_time ?? null,
        lastCompletedOn: row.last_completed_on ?? null
      }));
      const remoteHabits = ((habitResponse.data as RemoteHabitRow[]) ?? []).map((row) => ({
        id: row.id,
        title: row.title,
        iconKey: row.icon_key,
        xpValue: row.xp_value,
        completed: row.completed
      }));
      const remoteTransactions = ((transactionResponse.data as RemoteTransactionRow[]) ?? []).map((row) => ({
        id: row.id,
        date: row.transaction_date,
        taskName: row.task_name,
        category: row.category,
        type: row.transaction_type,
        amount: Number(row.amount),
        splitStatus: row.split_status,
        participants: row.participants ?? [],
        owedToMe: Number(row.owed_to_me)
      }));
      const remoteSubscriptions = ((subscriptionResponse.data as RemoteSubscriptionRow[]) ?? []).map((row) => ({
        id: row.id,
        title: row.title,
        amount: Number(row.amount),
        frequency: row.frequency,
        nextDueAt: row.next_due_at,
        reminderMinutes: row.reminder_minutes
      }));
      const isFreshUser =
        !remoteProfile &&
        remoteTasks.length === 0 &&
        remoteHabits.length === 0 &&
        remoteTransactions.length === 0 &&
        remoteSubscriptions.length === 0;

      if (isFreshUser) {
        const blankMember = buildBlankMember(user);
        setMember(blankMember);
        setTasks([]);
        setHabits([]);
        setTransactions([]);
        setSubscriptions([]);
        void saveMemberProfile(user.id, blankMember);
      } else if (!remoteProfile) {
        const seededMember = buildBlankMember(user);
        setMember(seededMember);
        void saveMemberProfile(user.id, seededMember);
      } else {
        setMember({
          displayName: remoteProfile.display_name,
          avatarUrl: remoteProfile.avatar_url,
          level: remoteProfile.level,
          xp: remoteProfile.xp,
          xpGoal: remoteProfile.xp_goal,
          totalBalance: Number(remoteProfile.total_balance),
          monthlySpend: Number(remoteProfile.monthly_spend),
          monthlyEarned: Number(remoteProfile.monthly_earned)
        });
      }

      setTasks(remoteTasks);
      setHabits(remoteHabits);
      setTransactions(remoteTransactions);
      setSubscriptions(remoteSubscriptions);

      setSyncState("live");
      pushToast(
        isFreshUser
          ? "Fresh workspace ready. Start with your first action."
          : "Supabase sync live. Your dashboard is using member data."
      );
    } catch {
      setSyncState("error");
      pushToast("Supabase tables are not ready yet. Demo data remains active.");
    }
  }

  async function saveMemberProfile(userId: string, nextMember: MemberProfile) {
    if (!supabase) {
      return;
    }
    await supabase.from("member_profiles").upsert({
      user_id: userId,
      display_name: nextMember.displayName,
      avatar_url: nextMember.avatarUrl,
      level: nextMember.level,
      xp: nextMember.xp,
      xp_goal: nextMember.xpGoal,
      total_balance: nextMember.totalBalance,
      monthly_spend: nextMember.monthlySpend,
      monthly_earned: nextMember.monthlyEarned
    });
  }

  async function saveTask(userId: string, task: TaskItem) {
    if (!supabase) {
      return;
    }
    const basePayload = {
      id: task.id,
      user_id: userId,
      title: task.title,
      description: task.description,
      priority: task.priority,
      xp_value: task.xpValue,
      due_label: task.dueLabel,
      completed: task.completed
    };

    const { error } = await supabase.from("tasks").upsert({
      ...basePayload,
      recurrence_type: task.recurrenceType,
      scheduled_time: task.scheduledTime,
      last_completed_on: task.lastCompletedOn
    });

    if (!error) {
      return;
    }

    const missingRecurrenceColumns =
      error.message.includes("recurrence_type") ||
      error.message.includes("scheduled_time") ||
      error.message.includes("last_completed_on");

    if (missingRecurrenceColumns) {
      await supabase.from("tasks").upsert(basePayload);
      pushToast("Run the SQL migration for daily tasks to sync recurring fields to Supabase.");
    }
  }

  async function saveHabit(userId: string, habit: (typeof habits)[number]) {
    if (!supabase) {
      return;
    }
    await supabase.from("habits").upsert({
      id: habit.id,
      user_id: userId,
      title: habit.title,
      icon_key: habit.iconKey,
      xp_value: habit.xpValue,
      completed: habit.completed
    });
  }

  async function saveTransaction(userId: string, transaction: TransactionItem) {
    if (!supabase) {
      return;
    }
    await supabase.from("transactions").upsert({
      id: transaction.id,
      user_id: userId,
      transaction_date: transaction.date,
      task_name: transaction.taskName,
      category: transaction.category,
      transaction_type: transaction.type,
      amount: transaction.amount,
      split_status: transaction.splitStatus,
      participants: transaction.participants,
      owed_to_me: transaction.owedToMe
    });
  }

  async function saveSubscription(userId: string, subscription: SubscriptionItem) {
    if (!supabase) {
      return;
    }
    await supabase.from("subscriptions").upsert({
      id: subscription.id,
      user_id: userId,
      title: subscription.title,
      amount: subscription.amount,
      frequency: subscription.frequency,
      next_due_at: subscription.nextDueAt,
      reminder_minutes: subscription.reminderMinutes
    });
  }

  async function handleGoogleAuth() {
    if (!supabase) {
      pushToast("Add your Supabase env keys to enable Google login.");
      return;
    }

    setSyncState("syncing");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin }
    });

    if (error) {
      setSyncState("error");
      pushToast("Google sign-in could not start. Check Supabase auth settings.");
    }
  }

  async function handleSignOut() {
    if (!supabase) {
      return;
    }
    const { error } = await supabase.auth.signOut();
    if (error) {
      pushToast("Sign-out failed. Session remains active.");
      return;
    }
    setMember(DEFAULT_MEMBER);
    setTasks(DEFAULT_TASKS);
    setHabits(DEFAULT_HABITS);
    setTransactions(DEFAULT_TRANSACTIONS);
    setSubscriptions(DEFAULT_SUBSCRIPTIONS);
    setSyncState("demo");
    pushToast("Signed out. Demo cache is still available locally.");
  }

  function handleCompleteTask(taskId: string) {
    const targetTask = tasks.find((task) => task.id === taskId);
    if (!targetTask || isTaskCompletedForToday(targetTask)) {
      return;
    }

    const nextTask =
      targetTask.recurrenceType === "daily"
        ? { ...targetTask, lastCompletedOn: getTodayIsoDate() }
        : { ...targetTask, completed: true };
    setTasks((current) => current.map((task) => (task.id === taskId ? nextTask : task)));
    awardXp(targetTask.xpValue);
    pushToast(`${targetTask.title} completed. +${targetTask.xpValue} XP`);
    if (currentUser) {
      void saveTask(currentUser.id, nextTask);
    }
  }

  function handleCompleteHabit(habitId: string) {
    const targetHabit = habits.find((habit) => habit.id === habitId);
    if (!targetHabit || targetHabit.completed) {
      return;
    }

    const nextHabit = { ...targetHabit, completed: true };
    setHabits((current) => current.map((habit) => (habit.id === habitId ? nextHabit : habit)));
    awardXp(targetHabit.xpValue);
    setHabitBurstId(habitId);
    window.setTimeout(() => setHabitBurstId((current) => (current === habitId ? null : current)), 900);
    pushToast(`${targetHabit.title} locked in. +${targetHabit.xpValue} XP`);
    if (currentUser) {
      void saveHabit(currentUser.id, nextHabit);
    }
  }

  function resetActionForm() {
    setActionForm(buildInitialActionForm());
  }

  async function commitAction() {
    if (!actionForm.title.trim()) {
      pushToast("Action title is required before you commit.");
      return;
    }
    if (actionForm.involvesTransaction && (!actionForm.amount || Number(actionForm.amount) <= 0)) {
      pushToast("Enter a valid transaction amount to unlock the finance engine.");
      return;
    }
    if (actionForm.splitBill && splitNames.length === 0) {
      pushToast("Add at least one name when a bill is being split.");
      return;
    }

    setIsSaving(true);

    const task: TaskItem = {
      id: crypto.randomUUID(),
      title: actionForm.title.trim(),
      description: actionForm.description.trim() || "Freshly forged action ready for execution.",
      priority: actionForm.priority,
      xpValue: actionForm.priority === "Low" ? 10 : actionForm.priority === "Medium" ? 20 : actionForm.priority === "High" ? 30 : 50,
      dueLabel: actionForm.repeatsDaily ? "Daily" : `Created | ${TODAY_LABEL}`,
      completed: false,
      recurrenceType: actionForm.repeatsDaily ? "daily" : "once",
      scheduledTime: actionForm.repeatsDaily ? actionForm.dailyTime : null,
      lastCompletedOn: null
    };

    setTasks((current) => [task, ...current]);
    if (currentUser) {
      void saveTask(currentUser.id, task);
    }

    if (actionForm.involvesTransaction) {
      const owedToMe =
        actionForm.transactionType === "Spend" && actionForm.splitBill
          ? actionForm.amIncluded
            ? splitPerHead * splitNames.length
            : Number(actionForm.amount)
          : 0;

      const transaction: TransactionItem = {
        id: crypto.randomUUID(),
        date: new Date().toISOString().slice(0, 10),
        taskName: actionForm.title.trim(),
        category: actionForm.category,
        type: actionForm.transactionType,
        amount: Number(actionForm.amount),
        splitStatus: actionForm.splitBill ? "Pending" : "Solo",
        participants: splitNames,
        owedToMe
      };

      setTransactions((current) => [transaction, ...current]);
      updateBalances(transaction);
      if (currentUser) {
        void saveTransaction(currentUser.id, transaction);
      }
    }

    if (actionForm.createSubscription) {
      const subscription: SubscriptionItem = {
        id: crypto.randomUUID(),
        title: actionForm.title.trim(),
        amount: Number(actionForm.amount || 0),
        frequency: actionForm.subscriptionFrequency,
        nextDueAt: new Date(actionForm.nextDueAt).toISOString(),
        reminderMinutes: actionForm.reminderHours * 60
      };

      setSubscriptions((current) =>
        [...current, subscription].sort(
          (left, right) => new Date(left.nextDueAt).getTime() - new Date(right.nextDueAt).getTime()
        )
      );
      if (currentUser) {
        void saveSubscription(currentUser.id, subscription);
      }
    }

    setIsSaving(false);
    setIsModalOpen(false);
    resetActionForm();
    pushToast("Action committed. The board, wealth, and reminders are updated.");
  }

  function handleSort(nextKey: SortKey) {
    if (sortKey === nextKey) {
      setSortDirection((current) => (current === "asc" ? "desc" : "asc"));
      return;
    }
    setSortKey(nextKey);
    setSortDirection("desc");
  }

  function exportLedger(mode: "full" | "tax") {
    const filtered =
      mode === "full"
        ? transactions
        : transactions.filter((transaction) => isWithinIndianTaxYear(transaction.date, TODAY));

    const csvRows = [
      ["Date", "Task Name", "Category", "Type", "Amount", "Split Status", "Participants", "Owed To Me"].join(","),
      ...filtered.map((transaction) =>
        [
          transaction.date,
          escapeCsv(transaction.taskName),
          escapeCsv(transaction.category),
          transaction.type,
          transaction.amount.toFixed(2),
          transaction.splitStatus,
          escapeCsv(transaction.participants.join(" | ")),
          transaction.owedToMe.toFixed(2)
        ].join(",")
      )
    ];

    const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const href = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = href;
    anchor.download =
      mode === "full" ? "life-os-ledger.csv" : `life-os-tax-report-${formatIndianTaxYear(TODAY)}.csv`;
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(href);
    setExportOpen(false);
    pushToast(mode === "full" ? "Full ledger CSV ready." : "Tax year report downloaded.");
  }

  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-4 text-slate-100 sm:px-6 lg:px-8">
      <div className="orb left-[-120px] top-[140px] h-64 w-64 bg-cyan-500/40" />
      <div className="orb bottom-[-80px] right-[10%] h-72 w-72 bg-fuchsia-600/30" />

      <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-[1800px] flex-col gap-4 lg:flex-row">
        <aside className="glass-panel relative flex w-full shrink-0 flex-col overflow-hidden rounded-[30px] p-4 lg:w-[300px]">
          <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/35 to-transparent" />
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-slate-400">Life OS</p>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white">Command Loop</h1>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
              <Target className="h-5 w-5 text-cyan-200" />
            </div>
          </div>

          <div className="glass-panel mb-6 rounded-[26px] p-4">
            <div className="flex items-center gap-3">
              <Avatar member={member} />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-white">{member.displayName}</p>
                <p className="mt-1 text-xs text-slate-400">
                  {currentUser ? currentUser.email : "Demo mode with local cache"}
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/35 px-3 py-2">
              <div className="text-xs uppercase tracking-[0.28em] text-slate-400">Sync</div>
              <SyncBadge syncState={syncState} />
            </div>
          </div>

          <nav className="space-y-2">
            {VIEWS.map((view) => {
              const Icon = view.icon;
              const active = activeView === view.key;
              return (
                <button
                  key={view.key}
                  type="button"
                  aria-current={active ? "page" : undefined}
                  onClick={() => setActiveView(view.key)}
                  className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left transition ${
                    active
                      ? "border-cyan-300/25 bg-cyan-400/12 text-white shadow-[0_12px_40px_rgba(34,211,238,0.14)]"
                      : "border-white/5 bg-white/[0.03] text-slate-300 hover:border-white/10 hover:bg-white/[0.05]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`rounded-2xl p-2 ${
                        active ? "bg-cyan-300/15 text-cyan-100" : "bg-white/5 text-slate-400"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="font-medium">{view.label}</p>
                      <p className="mt-1 text-xs text-slate-400">
                        {view.key === "command"
                          ? "Focus, tasks, rituals"
                          : view.key === "wealth"
                            ? "Transactions and splits"
                            : "XP + finance heatmaps"}
                      </p>
                    </div>
                  </div>
                  <Check className={`h-4 w-4 ${active ? "text-cyan-200" : "text-transparent"}`} />
                </button>
              );
            })}
          </nav>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <MetricCard
              title="Streak health"
              value={`${habits.filter((habit) => habit.completed).length}/${habits.length}`}
              sublabel="routines locked today"
              icon={Target}
              tone="amber"
            />
            <MetricCard
              title="Pending splits"
              value={formatCurrency(totalOwedToMe)}
              sublabel="owed back to you"
              icon={Users}
              tone="emerald"
            />
          </div>

          <div className="mt-auto space-y-3 pt-6">
            <div className="glass-panel rounded-[24px] p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Google Login</p>
                  <p className="mt-2 text-sm text-slate-300">
                    Connect Supabase auth to sync your member balances and activity stream.
                  </p>
                </div>
                <Database className="mt-0.5 h-5 w-5 text-cyan-200" />
              </div>
              <button
                type="button"
                onClick={currentUser ? handleSignOut : handleGoogleAuth}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white transition hover:border-cyan-300/20 hover:bg-cyan-300/10"
              >
                {currentUser ? (
                  <>
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </>
                ) : (
                  <>
                    <LogIn className="h-4 w-4" />
                    Connect with Google
                  </>
                )}
              </button>
            </div>
          </div>
        </aside>

        <main className="flex-1 overflow-hidden rounded-[32px]">
          <Suspense fallback={<SectionFallback />}>
            {showNewUserBlankState ? (
              <NewUserBlankState
                displayName={member.displayName}
                onCreateAction={() => setIsModalOpen(true)}
                onOpenWealthLedger={() => setActiveView("wealth")}
              />
            ) : activeView === "command" ? (
              <CommandCenter
                member={member}
                tasks={displayTasks}
                habits={habits}
                subscriptions={subscriptions}
                completionRate={completionRate}
                habitBurstId={habitBurstId}
                onCompleteTask={handleCompleteTask}
                onCompleteHabit={handleCompleteHabit}
              />
            ) : activeView === "wealth" ? (
              <WealthLedger
                member={member}
                burnRate={burnRate}
                totalOwedToMe={totalOwedToMe}
                transactions={sortedTransactions}
                exportOpen={exportOpen}
                sortKey={sortKey}
                sortDirection={sortDirection}
                onToggleExport={() => setExportOpen((current) => !current)}
                onSort={handleSort}
                onExport={exportLedger}
              />
            ) : (
              <AnalyticsHub
                xpHeatmap={xpHeatmap}
                inflowHeatmap={monthlyInflowHeatmap}
                outflowHeatmap={monthlyOutflowHeatmap}
                trendSeries={trendSeries}
                comparisonSeries={comparisonSeries}
              />
            )}
          </Suspense>
        </main>
      </div>

      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 z-30 inline-flex items-center gap-3 rounded-full border border-cyan-200/20 bg-gradient-to-r from-cyan-400/90 to-indigo-500/90 px-5 py-4 text-sm font-semibold text-slate-950 shadow-[0_20px_60px_rgba(34,211,238,0.3)] transition hover:scale-[1.02] hover:shadow-[0_30px_80px_rgba(34,211,238,0.4)]"
      >
        <Plus className="h-5 w-5" />
        Global Add Task
      </button>

      {isModalOpen ? (
        <Suspense fallback={null}>
          <ActionForgeModal
            form={actionForm}
            isSaving={isSaving}
            splitNames={splitNames}
            liveSplitSummary={liveSplitSummary}
            splitPerHead={splitPerHead}
            onClose={() => {
              setIsModalOpen(false);
              resetActionForm();
            }}
            onFormChange={setActionForm}
            onCommit={commitAction}
          />
        </Suspense>
      ) : null}

      {toast ? (
        <div className="fixed left-1/2 top-6 z-40 -translate-x-1/2 rounded-full border border-white/10 bg-slate-950/80 px-4 py-2 text-sm text-slate-100 shadow-[0_16px_40px_rgba(0,0,0,0.45)] backdrop-blur-xl">
          {toast.message}
        </div>
      ) : null}
    </div>
  );
}

function getDisplayName(user: User) {
  return (
    (user.user_metadata.full_name as string | undefined) ||
    (user.user_metadata.name as string | undefined) ||
    user.email?.split("@")[0] ||
    "Life OS User"
  );
}

function getAvatarUrl(user: User) {
  return (
    (user.user_metadata.avatar_url as string | undefined) ||
    (user.user_metadata.picture as string | undefined) ||
    null
  );
}

function getTodayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

function isTaskCompletedForToday(task: TaskItem) {
  return task.recurrenceType === "daily" ? task.lastCompletedOn === getTodayIsoDate() : task.completed;
}

function getTaskDisplayDueLabel(task: TaskItem) {
  if (task.recurrenceType !== "daily") {
    return task.dueLabel;
  }

  if (!task.scheduledTime) {
    return "Daily";
  }

  const [hours, minutes] = task.scheduledTime.split(":").map(Number);
  const time = new Date();
  time.setHours(hours, minutes, 0, 0);
  return `Daily | ${time.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit"
  })}`;
}

function buildBlankMember(user: User): MemberProfile {
  return {
    displayName: getDisplayName(user),
    avatarUrl: getAvatarUrl(user),
    level: 1,
    xp: 0,
    xpGoal: 100,
    totalBalance: 0,
    monthlySpend: 0,
    monthlyEarned: 0
  };
}

function SectionFallback() {
  return (
    <div className="glass-panel flex min-h-[calc(100vh-2rem)] items-center justify-center rounded-[32px] p-6">
      <div className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-slate-300">
        Loading view...
      </div>
    </div>
  );
}

export default App;
