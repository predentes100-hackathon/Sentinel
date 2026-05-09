import { useAppStore } from '../store';
import { supabase } from '../lib/supabase';
import type { TaskItem, HabitItem, TransactionItem, SubscriptionItem, MemberProfile } from '../types';
import { calculateXpGoal, isDateInCurrentMonth } from '../data';
import { triggerGoldBurst } from '../lib/confetti';

export function useAppActions() {
  const store = useAppStore();

  function awardXp(points: number) {
    let nextLevel = store.member.level;
    let nextGoal = store.member.xpGoal;
    let nextXp = store.member.xp + points;

    while (nextXp >= nextGoal) {
      nextXp -= nextGoal;
      nextLevel += 1;
      nextGoal = calculateXpGoal(nextLevel);
    }

    const nextMember = { ...store.member, level: nextLevel, xp: nextXp, xpGoal: nextGoal };
    store.setMember(nextMember);
    if (store.session?.user && supabase) {
      void saveMemberProfile(store.session.user.id, nextMember);
    }
  }

  function updateBalances(transaction: TransactionItem) {
    const inCurrentMonth = isDateInCurrentMonth(transaction.date);
    const delta = transaction.type === "Earn" ? transaction.amount : -transaction.amount;
    
    const nextMember = {
      ...store.member,
      totalBalance: store.member.totalBalance + delta,
      monthlySpend:
        transaction.type === "Spend" && inCurrentMonth
          ? store.member.monthlySpend + transaction.amount
          : store.member.monthlySpend,
      monthlyEarned:
        transaction.type === "Earn" && inCurrentMonth
          ? store.member.monthlyEarned + transaction.amount
          : store.member.monthlyEarned
    };
    store.setMember(nextMember);
    if (store.session?.user && supabase) {
      void saveMemberProfile(store.session.user.id, nextMember);
    }
  }

  async function saveMemberProfile(userId: string, nextMember: MemberProfile) {
    if (!supabase) return null;
    return supabase.from("member_profiles").upsert({
      user_id: userId,
      display_name: nextMember.displayName,
      avatar_url: nextMember.avatarUrl,
      level: nextMember.level,
      xp: nextMember.xp,
      xp_goal: nextMember.xpGoal,
      total_balance: nextMember.totalBalance,
      monthly_spend: nextMember.monthlySpend,
      monthly_earned: nextMember.monthlyEarned,
      budget_limits: nextMember.budgetLimits
    });
  }

  async function handleResetWorkspace() {
    const shouldReset = window.confirm(
      store.session?.user
        ? "Reset your workspace? This will clear tasks, habits, transactions, subscriptions, balances, and XP."
        : "Reset the local workspace view on this device?"
    );

    if (!shouldReset) return;

    store.setIsSaving(true);
    const blankMember = store.session?.user ? buildBlankMember(store.session.user as any) : buildGuestMember();

    try {
      if (store.session?.user && supabase) {
        const [taskResult, habitResult, transactionResult, subscriptionResult, memberResult] =
          await Promise.all([
            supabase.from("tasks").delete().eq("user_id", store.session.user.id),
            supabase.from("habits").delete().eq("user_id", store.session.user.id),
            supabase.from("transactions").delete().eq("user_id", store.session.user.id),
            supabase.from("subscriptions").delete().eq("user_id", store.session.user.id),
            saveMemberProfile(store.session.user.id, blankMember)
          ]);

        const resetError = taskResult.error || habitResult.error || transactionResult.error || subscriptionResult.error || memberResult?.error;
        if (resetError) throw resetError;
      } else {
        window.localStorage.removeItem("life-os-demo-cache");
      }

      store.setMember(blankMember);
      store.setTasks([]);
      store.setHabits([]);
      store.setTransactions([]);
      store.setSubscriptions([]);
      store.setHabitBurstId(null);
      store.setExportOpen(false);
      store.resetActionForm();
      store.pushToast("Workspace reset. You are back to a fresh start.");
    } catch {
      store.pushToast("Workspace reset failed. Please try again in a moment.");
    } finally {
      store.setIsSaving(false);
    }
  }

  async function saveTask(userId: string, task: TaskItem) {
    if (!supabase) return;
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
      due_date: task.dueDate,
      scheduled_time: task.scheduledTime,
      last_completed_on: task.lastCompletedOn
    });

    if (error && (error.message.includes("recurrence_type") || error.message.includes("scheduled_time") || error.message.includes("last_completed_on"))) {
      await supabase.from("tasks").upsert(basePayload);
      store.pushToast("Run the SQL migration for daily tasks to sync recurring fields to Supabase.");
    }
  }

  async function saveHabit(userId: string, habit: HabitItem) {
    if (!supabase) return;
    const basePayload = {
      id: habit.id,
      user_id: userId,
      title: habit.title,
      icon_key: habit.iconKey,
      xp_value: habit.xpValue,
      completed: habit.completed
    };
    const { error } = await supabase.from("habits").upsert({
      ...basePayload,
      streak_count: habit.streakCount
    });

    if (error && error.message.includes("streak_count")) {
      await supabase.from("habits").upsert(basePayload);
      store.pushToast("Run the SQL migration to add streak_count to habits table.");
    }
  }

  async function saveTransaction(userId: string, transaction: TransactionItem) {
    if (!supabase) return;
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
    if (!supabase) return;
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

  function handleCompleteTask(taskId: string) {
    const targetTask = store.tasks.find((task) => task.id === taskId);
    if (!targetTask) return;
    const isCompleted = targetTask.recurrenceType === "daily" ? targetTask.lastCompletedOn === getTodayIsoDate() : targetTask.completed;
    if (isCompleted) return;

    const nextTask: TaskItem = targetTask.recurrenceType === "daily"
        ? { ...targetTask, lastCompletedOn: getTodayIsoDate() }
        : { ...targetTask, completed: true };
        
    store.setTasks((current) => current.map((task) => (task.id === taskId ? nextTask : task)));
    awardXp(targetTask.xpValue);
    triggerGoldBurst();
    store.pushToast(`${targetTask.title} completed. +${targetTask.xpValue} XP`);
    if (store.session?.user) {
      void saveTask(store.session.user.id, nextTask);
    }
  }

  function handleCompleteHabit(habitId: string) {
    const targetHabit = store.habits.find((habit) => habit.id === habitId);
    if (!targetHabit || targetHabit.completed) return;

    const nextStreak = (targetHabit.streakCount || 0) + 1;
    const streakBonus = nextStreak * 2;
    const totalXp = targetHabit.xpValue + streakBonus;

    const nextHabit = { ...targetHabit, completed: true, streakCount: nextStreak };
    store.setHabits((current) => current.map((habit) => (habit.id === habitId ? nextHabit : habit)));
    awardXp(totalXp);
    triggerGoldBurst();
    store.setHabitBurstId(habitId);
    window.setTimeout(() => store.setHabitBurstId(null), 900);
    store.pushToast(`Streak ${nextStreak}! +${totalXp} XP`);
    if (store.session?.user) {
      void saveHabit(store.session.user.id, nextHabit);
    }
  }

  async function commitAction(splitNames: string[], splitPerHead: number) {
    const { actionForm } = store;
    if (!actionForm.title.trim()) {
      store.pushToast("Action title is required before you commit.");
      return;
    }
    if (actionForm.involvesTransaction && (!actionForm.amount || Number(actionForm.amount) <= 0)) {
      store.pushToast("Enter a valid transaction amount to unlock the finance engine.");
      return;
    }
    if (actionForm.splitBill && splitNames.length === 0) {
      store.pushToast("Add at least one name when a bill is being split.");
      return;
    }

    store.setIsSaving(true);

    const task: TaskItem = {
      id: crypto.randomUUID(),
      title: actionForm.title.trim(),
      description: actionForm.description.trim() || "Freshly forged action ready for execution.",
      priority: actionForm.priority,
      xpValue: actionForm.priority === "Deep Work" ? 50 : actionForm.priority === "High" ? 30 : actionForm.priority === "Medium" ? 20 : 10,
      dueLabel: actionForm.dueDate ? actionForm.dueDate : (actionForm.repeatsDaily ? "Daily" : "Today"),
      completed: false,
      recurrenceType: actionForm.repeatsDaily ? "daily" : "once",
      dueDate: actionForm.dueDate || null,
      scheduledTime: actionForm.repeatsDaily ? actionForm.dailyTime : null,
      lastCompletedOn: null
    };

    store.setTasks((current) => [task, ...current]);
    if (store.session?.user) {
      void saveTask(store.session.user.id, task);
    }

    if (actionForm.involvesTransaction) {
      const owedToMe = actionForm.transactionType === "Spend" && actionForm.splitBill
          ? actionForm.amIncluded ? splitPerHead * splitNames.length : Number(actionForm.amount)
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
        owedToMe,
        tags: actionForm.tags.split(",").map(t => t.trim()).filter(Boolean)
      };

      store.setTransactions((current) => [transaction, ...current]);
      updateBalances(transaction);
      if (store.session?.user) {
        void saveTransaction(store.session.user.id, transaction);
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

      store.setSubscriptions((current) =>
        [...current, subscription].sort(
          (left, right) => new Date(left.nextDueAt).getTime() - new Date(right.nextDueAt).getTime()
        )
      );
      if (store.session?.user) {
        void saveSubscription(store.session.user.id, subscription);
      }
    }

    store.setIsSaving(false);
    store.setIsModalOpen(false);
    store.resetActionForm();
    store.pushToast("Action committed. The board, wealth, and reminders are updated.");
  }

  async function handleGoogleAuth() {
    if (!supabase) {
      store.pushToast("Add your Supabase env keys to enable Google login.");
      return;
    }
    store.setSyncState("syncing");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin }
    });
    if (error) {
      store.setSyncState("error");
      store.pushToast("Google sign-in could not start. Check Supabase auth settings.");
    }
  }

  async function handleSignOut() {
    if (!supabase) return;
    const { error } = await supabase.auth.signOut();
    if (error) {
      store.pushToast("Sign-out failed. Session remains active.");
      return;
    }
    store.setSyncState("demo");
    store.pushToast("Signed out. Demo cache is still available locally.");
  }

  function handleAddHabit(title: string, emoji: string) {
    const newHabit: HabitItem = {
      id: crypto.randomUUID(),
      title,
      iconKey: "surya", // fallback icon key (emoji takes priority in display)
      xpValue: 15,
      completed: false,
      streakCount: 0,
      ...(emoji ? { emoji } : {})
    } as HabitItem & { emoji?: string };
    store.setHabits((curr) => [...curr, newHabit]);
    store.pushToast(`Habit "${title}" added! +15 XP per completion.`);
  }

  return {
    awardXp,
    updateBalances,
    handleResetWorkspace,
    handleCompleteTask,
    handleCompleteHabit,
    handleAddHabit,
    commitAction,
    handleGoogleAuth,
    handleSignOut,
  };
}

export async function loadDashboardFromSupabase(user: import("@supabase/supabase-js").User, store: any) {
  if (!supabase) return;

  try {
    const [profileResponse, taskResponse, habitResponse, transactionResponse, subscriptionResponse] = await Promise.all([
      supabase.from("member_profiles").select("*").eq("user_id", user.id).maybeSingle(),
      supabase.from("tasks").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
      supabase.from("habits").select("*").eq("user_id", user.id).order("created_at", { ascending: true }),
      supabase.from("transactions").select("*").eq("user_id", user.id).order("transaction_date", { ascending: false }),
      supabase.from("subscriptions").select("*").eq("user_id", user.id).order("next_due_at", { ascending: true })
    ]);

    if (profileResponse.error && profileResponse.error.code !== "PGRST116") throw profileResponse.error;
    if (taskResponse.error || habitResponse.error || transactionResponse.error || subscriptionResponse.error) {
      throw taskResponse.error || habitResponse.error || transactionResponse.error || subscriptionResponse.error;
    }

    const remoteProfile = profileResponse.data;
    const remoteTasks = (taskResponse.data || []).map((t: any) => ({
      id: t.id, title: t.title, description: t.description, priority: t.priority,
      xpValue: t.xp_value, dueLabel: t.due_label, completed: t.completed,
      recurrenceType: t.recurrence_type ?? "once", dueDate: t.due_date,
      scheduledTime: t.scheduled_time ?? null,
      lastCompletedOn: t.last_completed_on ?? null
    }));
    const remoteHabits = (habitResponse.data || []).map((row: any) => ({
      id: row.id, title: row.title, iconKey: row.icon_key, xpValue: row.xp_value, completed: row.completed, streakCount: row.streak_count ?? 0
    }));
    const remoteTransactions = (transactionResponse.data || []).map((row: any) => ({
      id: row.id, date: row.transaction_date, taskName: row.task_name, category: row.category,
      type: row.transaction_type, amount: Number(row.amount), splitStatus: row.split_status,
      participants: row.participants ?? [], owedToMe: Number(row.owed_to_me)
    }));
    const remoteSubscriptions = (subscriptionResponse.data || []).map((row: any) => ({
      id: row.id, title: row.title, amount: Number(row.amount), frequency: row.frequency,
      nextDueAt: row.next_due_at, reminderMinutes: row.reminder_minutes
    }));

    const isFreshUser = !remoteProfile && remoteTasks.length === 0 && remoteHabits.length === 0 && remoteTransactions.length === 0 && remoteSubscriptions.length === 0;

    if (isFreshUser) {
      const blankMember = buildBlankMember(user as import("@supabase/supabase-js").User);
      store.setMember(blankMember);
      store.setTasks([]); store.setHabits([]); store.setTransactions([]); store.setSubscriptions([]);
      supabase.from("member_profiles").upsert({
        user_id: user.id, display_name: blankMember.displayName, avatar_url: blankMember.avatarUrl,
        level: blankMember.level, xp: blankMember.xp, xp_goal: blankMember.xpGoal,
        total_balance: blankMember.totalBalance, monthly_spend: blankMember.monthlySpend, monthly_earned: blankMember.monthlyEarned
      }).then();
    } else if (!remoteProfile) {
      const seededMember = buildBlankMember(user as import("@supabase/supabase-js").User);
      store.setMember(seededMember);
      supabase.from("member_profiles").upsert({
        user_id: user.id, display_name: seededMember.displayName, avatar_url: seededMember.avatarUrl,
        level: seededMember.level, xp: seededMember.xp, xp_goal: seededMember.xpGoal,
        total_balance: seededMember.totalBalance, monthly_spend: seededMember.monthlySpend, monthly_earned: seededMember.monthlyEarned
      }).then();
    } else {
      store.setMember({
        displayName: remoteProfile.display_name, avatarUrl: remoteProfile.avatar_url, level: remoteProfile.level,
        xp: remoteProfile.xp, xpGoal: remoteProfile.xp_goal, totalBalance: Number(remoteProfile.total_balance),
        monthlySpend: Number(remoteProfile.monthly_spend), monthlyEarned: Number(remoteProfile.monthly_earned)
      });
    }

    store.setTasks(remoteTasks); store.setHabits(remoteHabits); store.setTransactions(remoteTransactions); store.setSubscriptions(remoteSubscriptions);
    store.setSyncState("live");
    store.pushToast(isFreshUser ? "Fresh workspace ready. Start with your first action." : "Supabase sync live. Your dashboard is using member data.");
  } catch {
    store.setSyncState("error");
    store.pushToast("Supabase tables are not ready yet. Demo data remains active.");
  }
}

// Helpers
function getDisplayName(user: import("@supabase/supabase-js").User) {
  return (
    (user.user_metadata.full_name as string | undefined) ||
    (user.user_metadata.name as string | undefined) ||
    user.email?.split("@")[0] ||
    "Life OS User"
  );
}

function getAvatarUrl(user: import("@supabase/supabase-js").User) {
  return (
    (user.user_metadata.avatar_url as string | undefined) ||
    (user.user_metadata.picture as string | undefined) ||
    null
  );
}

export function getTodayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

export function buildBlankMember(user: import("@supabase/supabase-js").User): MemberProfile {
  return buildPristineMember(getDisplayName(user), getAvatarUrl(user));
}

export function buildGuestMember(): MemberProfile {
  return buildPristineMember("Life OS User", null);
}

function buildPristineMember(displayName: string, avatarUrl: string | null): MemberProfile {
  return {
    displayName,
    avatarUrl,
    level: 1,
    xp: 0,
    xpGoal: 100,
    totalBalance: 0,
    monthlySpend: 0,
    monthlyEarned: 0,
    budgetLimits: {}
  };
}