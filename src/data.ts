import type { LucideIcon } from "lucide-react";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  BookOpen,
  Bus,
  CreditCard,
  Dumbbell,
  Film,
  Flame,
  Gift,
  GraduationCap,
  HeartPulse,
  Home,
  LayoutDashboard,
  LineChart,
  Package,
  PiggyBank,
  Pizza,
  Plane,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  SunMedium,
  Target,
  TrendingUp,
  Users,
  Wallet,
  Wifi,
  Wrench
} from "lucide-react";
import type {
  ActionFormState,
  CachedState,
  FinanceCategory,
  HabitItem,
  HabitIconKey,
  HeatmapCell,
  MemberProfile,
  Priority,
  SortDirection,
  SortKey,
  SubscriptionItem,
  TaskItem,
  TransactionItem,
  ViewDefinition
} from "./types";

export const STORAGE_KEY = "life-os-demo-cache";
export const TODAY = new Date();
export const TODAY_LABEL = TODAY.toLocaleDateString("en-IN", {
  weekday: "short",
  day: "numeric",
  month: "short"
});

export const VIEWS: ViewDefinition[] = [
  { key: "command", label: "Command Center", icon: LayoutDashboard },
  { key: "wealth", label: "Wealth Ledger", icon: Wallet },
  { key: "analytics", label: "Analytics Hub", icon: LineChart }
];

export const PRIORITY_META: Record<
  Priority,
  {
    xp: number;
    label: string;
    pillClass: string;
    glowClass: string;
  }
> = {
  Low: {
    xp: 10,
    label: "Low",
    pillClass: "border-sky-400/25 bg-sky-400/10 text-sky-200",
    glowClass: "from-sky-500/25 via-sky-500/10 to-transparent"
  },
  Medium: {
    xp: 20,
    label: "Medium",
    pillClass: "border-cyan-400/25 bg-cyan-400/10 text-cyan-100",
    glowClass: "from-cyan-500/25 via-cyan-500/10 to-transparent"
  },
  High: {
    xp: 30,
    label: "High",
    pillClass: "border-amber-400/25 bg-amber-400/10 text-amber-100",
    glowClass: "from-amber-500/25 via-amber-500/10 to-transparent"
  },
  "Deep Work": {
    xp: 50,
    label: "Deep Work",
    pillClass: "border-fuchsia-400/25 bg-fuchsia-400/10 text-fuchsia-100",
    glowClass: "from-fuchsia-500/25 via-fuchsia-500/10 to-transparent"
  }
};

export const FINANCE_CATEGORIES: FinanceCategory[] = [
  "Housing",
  "Transportation",
  "Groceries & food",
  "Healthcare & insurance",
  "Debt payments",
  "Clothing",
  "Personal care & hygiene",
  "Household supplies",
  "Phone & internet",
  "Dining out & takeaway",
  "Entertainment",
  "Travel & vacations",
  "Shopping (non-essential)",
  "Fitness & wellness",
  "Savings & emergency fund",
  "Investments",
  "Retirement contributions",
  "Donations & giving",
  "Gifts",
  "Home maintenance & repairs",
  "Medical/dental (out of pocket)",
  "Education & courses"
];

export const CATEGORY_META: Record<
  FinanceCategory,
  {
    icon: LucideIcon;
    className: string;
  }
> = {
  Housing: { icon: Home, className: "bg-violet-500/15 text-violet-200" },
  Transportation: { icon: Bus, className: "bg-cyan-500/15 text-cyan-200" },
  "Groceries & food": {
    icon: ShoppingCart,
    className: "bg-emerald-500/15 text-emerald-200"
  },
  "Healthcare & insurance": {
    icon: HeartPulse,
    className: "bg-rose-500/15 text-rose-200"
  },
  "Debt payments": {
    icon: CreditCard,
    className: "bg-slate-500/20 text-slate-200"
  },
  Clothing: { icon: ShoppingBag, className: "bg-indigo-500/15 text-indigo-200" },
  "Personal care & hygiene": {
    icon: Sparkles,
    className: "bg-fuchsia-500/15 text-fuchsia-200"
  },
  "Household supplies": {
    icon: Package,
    className: "bg-orange-500/15 text-orange-200"
  },
  "Phone & internet": { icon: Wifi, className: "bg-sky-500/15 text-sky-200" },
  "Dining out & takeaway": {
    icon: Pizza,
    className: "bg-red-500/15 text-red-200"
  },
  Entertainment: { icon: Film, className: "bg-pink-500/15 text-pink-200" },
  "Travel & vacations": { icon: Plane, className: "bg-teal-500/15 text-teal-200" },
  "Shopping (non-essential)": {
    icon: ShoppingBag,
    className: "bg-purple-500/15 text-purple-200"
  },
  "Fitness & wellness": {
    icon: Dumbbell,
    className: "bg-lime-500/15 text-lime-200"
  },
  "Savings & emergency fund": {
    icon: PiggyBank,
    className: "bg-green-500/15 text-green-200"
  },
  Investments: { icon: TrendingUp, className: "bg-emerald-500/15 text-emerald-200" },
  "Retirement contributions": {
    icon: ShieldCheck,
    className: "bg-blue-500/15 text-blue-200"
  },
  "Donations & giving": { icon: Gift, className: "bg-amber-500/15 text-amber-200" },
  Gifts: { icon: Gift, className: "bg-yellow-500/15 text-yellow-200" },
  "Home maintenance & repairs": {
    icon: Wrench,
    className: "bg-stone-500/20 text-stone-200"
  },
  "Medical/dental (out of pocket)": {
    icon: HeartPulse,
    className: "bg-rose-500/15 text-rose-200"
  },
  "Education & courses": {
    icon: GraduationCap,
    className: "bg-blue-500/15 text-blue-200"
  }
};

export const HABIT_ICON_MAP: Record<HabitIconKey, LucideIcon> = {
  surya: SunMedium,
  footwork: Dumbbell,
  read: BookOpen,
  hydrate: Activity
};

export const SIDEBAR_METRICS = {
  streak: Flame,
  owed: Users,
  focus: Target,
  spend: ArrowDownRight,
  earn: ArrowUpRight
};

export const DEFAULT_MEMBER: MemberProfile = {
  displayName: "Vedant Sentinel",
  avatarUrl: null,
  level: 12,
  xp: 450,
  xpGoal: 500,
  totalBalance: 128640,
  monthlySpend: 14250,
  monthlyEarned: 26800,
  budgetLimits: {
    "Dining out & takeaway": 3000,
    "Entertainment": 2000
  }
};

export const DEFAULT_TASKS: TaskItem[] = [
  {
    id: "task-1",
    title: "Complete C++ logic building challenge",
    description: "Close out one high-friction problem and document the reusable pattern.",
    priority: "High",
    xpValue: PRIORITY_META.High.xp,
    dueLabel: "Today | 8:00 PM",
    completed: false,
    recurrenceType: "once",
    dueDate: null,
    scheduledTime: null,
    lastCompletedOn: null
  },
  {
    id: "task-2",
    title: "Finish AxiomIVE documentation",
    description: "Polish the architecture walkthrough and release notes for the next milestone.",
    priority: "Deep Work",
    xpValue: PRIORITY_META["Deep Work"].xp,
    dueLabel: "Today | 5:30 PM",
    completed: false,
    recurrenceType: "once",
    dueDate: null,
    scheduledTime: null,
    lastCompletedOn: null
  },
  {
    id: "task-3",
    title: "Book ST bus tickets for Rajgad trek",
    description: "Confirm outbound timing, split the fare, and post the itinerary in the group chat.",
    priority: "Medium",
    xpValue: PRIORITY_META.Medium.xp,
    dueLabel: "Today | 3:15 PM",
    completed: false,
    recurrenceType: "once",
    dueDate: null,
    scheduledTime: null,
    lastCompletedOn: null
  },
  {
    id: "task-4",
    title: "Review Supabase member sync model",
    description: "Map task, wealth, and subscription persistence before the next data pass.",
    priority: "Low",
    xpValue: PRIORITY_META.Low.xp,
    dueLabel: "Today | 10:30 PM",
    completed: false,
    recurrenceType: "once",
    dueDate: null,
    scheduledTime: null,
    lastCompletedOn: null
  }
];

export const DEFAULT_HABITS: HabitItem[] = [
  { id: "habit-1", title: "Surya Namaskar", iconKey: "surya", xpValue: 15, completed: true, streakCount: 0 },
  { id: "habit-2", title: "Table Tennis footwork", iconKey: "footwork", xpValue: 20, completed: false, streakCount: 0 },
  { id: "habit-3", title: "Read 10 pages", iconKey: "read", xpValue: 10, completed: false, streakCount: 0 },
  { id: "habit-4", title: "Hydration checkpoint", iconKey: "hydrate", xpValue: 10, completed: false, streakCount: 0 }
];

export const DEFAULT_TRANSACTIONS: TransactionItem[] = [
  {
    id: "txn-1",
    date: offsetDate(-1),
    taskName: "Rajgad trek bus tickets",
    category: "Travel & vacations",
    type: "Spend",
    amount: 800,
    splitStatus: "Pending",
    participants: ["Aman", "Rohan"],
    owedToMe: 10000,
    tags: ["bali", "trip"]
  },
  {
    id: "txn-2",
    date: offsetDate(-2),
    taskName: "Bought SSD for dev rig",
    category: "Shopping (non-essential)",
    type: "Spend",
    amount: 12000,
    splitStatus: "Solo",
    participants: [],
    owedToMe: 0,
    tags: ["tech"]
  },
  {
    id: "txn-3",
    date: offsetDate(-4),
    taskName: "Freelance sprint payout",
    category: "Investments",
    type: "Earn",
    amount: 25000,
    splitStatus: "Solo",
    participants: [],
    owedToMe: 0,
    tags: ["stocks"]
  },
  {
    id: "txn-4",
    date: offsetDate(-6),
    taskName: "Dinner after practice",
    category: "Dining out & takeaway",
    type: "Spend",
    amount: 3200,
    splitStatus: "Pending",
    participants: ["Kavya"],
    owedToMe: 1600,
    tags: ["dinner"]
  },
  {
    id: "txn-5",
    date: offsetDate(-8),
    taskName: "Cloud architecture course",
    category: "Education & courses",
    type: "Spend",
    amount: 500,
    splitStatus: "Solo",
    participants: [],
    owedToMe: 0,
    tags: ["course"]
  }
];

export const DEFAULT_SUBSCRIPTIONS: SubscriptionItem[] = [
  {
    id: "sub-1",
    title: "Notion Plus",
    amount: 249,
    frequency: "Monthly",
    nextDueAt: offsetDateTime(4, 9),
    reminderMinutes: 360
  },
  {
    id: "sub-2",
    title: "Table Tennis Academy",
    amount: 1800,
    frequency: "Monthly",
    nextDueAt: offsetDateTime(7, 18),
    reminderMinutes: 1440
  }
];

export function loadCachedState(): CachedState {
  const fallback: CachedState = {
    member: DEFAULT_MEMBER,
    tasks: DEFAULT_TASKS,
    habits: DEFAULT_HABITS,
    transactions: DEFAULT_TRANSACTIONS,
    subscriptions: DEFAULT_SUBSCRIPTIONS
  };

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return fallback;
    }

    const parsed = JSON.parse(raw) as Partial<CachedState>;
    return {
      member: parsed.member ?? fallback.member,
      tasks:
        parsed.tasks?.map((task) => ({
          ...task,
          recurrenceType: task.recurrenceType ?? "once",
          scheduledTime: task.scheduledTime ?? null,
          lastCompletedOn: task.lastCompletedOn ?? null
        })) ?? fallback.tasks,
      habits: parsed.habits ?? fallback.habits,
      transactions: parsed.transactions ?? fallback.transactions,
      subscriptions: parsed.subscriptions ?? fallback.subscriptions
    };
  } catch {
    return fallback;
  }
}

export function buildInitialActionForm(): ActionFormState {
  return {
    title: "",
    description: "",
    priority: "High",
    repeatsDaily: false,
    dailyTime: "07:00",
    involvesTransaction: false,
    transactionType: "Spend",
    category: "Travel & vacations",
    amount: "",
    splitBill: false,
    amIncluded: true,
    splitNames: [""],
    createSubscription: false,
    subscriptionFrequency: "Monthly",
    nextDueAt: toLocalDateTimeInput(offsetDateTime(7, 9)),
    reminderHours: 24,
    tags: "",
    dueDate: ""
  };
}

export function calculateXpGoal(level: number) {
  return 440 + level * 5;
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(value);
}

export function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}

export function formatDateTime(value: string) {
  return new Date(value).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit"
  });
}

export function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

export function getFinancialHeatColor(value: number, variant: "inflow" | "outflow") {
  if (value <= 0) {
    return "rgba(15, 23, 42, 0.5)";
  }

  const intensity = Math.min(value / 8000, 1);
  return variant === "inflow"
    ? `rgba(34, 197, 94, ${0.18 + intensity * 0.72})`
    : `rgba(239, 68, 68, ${0.18 + intensity * 0.72})`;
}

export function isDateInCurrentMonth(value: string) {
  const date = new Date(value);
  return date.getMonth() === TODAY.getMonth() && date.getFullYear() === TODAY.getFullYear();
}

export function sortTransactions(
  transactions: TransactionItem[],
  key: SortKey,
  direction: SortDirection
) {
  return [...transactions].sort((left, right) => {
    const modifier = direction === "asc" ? 1 : -1;

    if (key === "amount") {
      return (left.amount - right.amount) * modifier;
    }

    if (key === "date") {
      return (new Date(left.date).getTime() - new Date(right.date).getTime()) * modifier;
    }

    return String(left[key]).localeCompare(String(right[key])) * modifier;
  });
}

export function buildWeeklyHeatmap(weeks: number, seed: number) {
  const totalDays = weeks * 7;
  const days: HeatmapCell[] = [];
  const base = new Date();
  base.setDate(base.getDate() - totalDays + 1);

  for (let index = 0; index < totalDays; index += 1) {
    const date = new Date(base);
    date.setDate(base.getDate() + index);
    const wave = Math.abs(Math.sin((seed + index) / 4)) * 58;
    const focusSpike = (index % 5 === 0 ? 20 : 0) + (index % 11 === 0 ? 15 : 0);
    days.push({
      date: date.toISOString().slice(0, 10),
      value: Math.round(wave + focusSpike)
    });
  }

  return days;
}

export function buildMonthlyCalendarHeatmap(
  kind: "inflow" | "outflow",
  transactions: TransactionItem[]
) {
  const year = TODAY.getFullYear();
  const month = TODAY.getMonth();
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const leadingBlanks = firstDay.getDay();
  const cells: HeatmapCell[] = [];

  for (let blank = 0; blank < leadingBlanks; blank += 1) {
    cells.push({ date: `blank-${blank}`, value: 0 });
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const iso = new Date(year, month, day).toISOString().slice(0, 10);
    const value = transactions
      .filter(
        (transaction) =>
          transaction.date === iso &&
          (kind === "inflow" ? transaction.type === "Earn" : transaction.type === "Spend")
      )
      .reduce((sum, transaction) => sum + transaction.amount, 0);

    cells.push({ date: iso, value });
  }

  while (cells.length % 7 !== 0) {
    cells.push({ date: `blank-tail-${cells.length}`, value: 0 });
  }

  return cells;
}

export function buildTrendSeries(tasks: TaskItem[], transactions: TransactionItem[]) {
  return ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"].map((label, index) => {
    const baseXp = 40 + index * 12;
    const completionBoost = tasks.filter((task) => task.completed).length * 5;
    const financeBoost = transactions.filter((transaction) => transaction.type === "Earn").length * 3;
    return {
      label,
      xp: baseXp + completionBoost + financeBoost + (index % 2 === 0 ? 12 : 0)
    };
  });
}

export function buildFinancialComparisonSeries(transactions: TransactionItem[]) {
  return ["W1", "W2", "W3", "W4", "W5"].map((label, index) => {
    const weekTransactions = transactions.filter((_transaction, transactionIndex) => transactionIndex % 5 === index);
    return {
      label,
      earned: weekTransactions
        .filter((transaction) => transaction.type === "Earn")
        .reduce((sum, transaction) => sum + transaction.amount, 0),
      spent: weekTransactions
        .filter((transaction) => transaction.type === "Spend")
        .reduce((sum, transaction) => sum + transaction.amount, 0)
    };
  });
}

export function escapeCsv(value: string) {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replaceAll('"', '""')}"`;
  }
  return value;
}

export function isWithinIndianTaxYear(value: string, reference: Date) {
  const transactionDate = new Date(value);
  const taxYearStart =
    reference.getMonth() >= 3
      ? new Date(reference.getFullYear(), 3, 1)
      : new Date(reference.getFullYear() - 1, 3, 1);
  const taxYearEnd = new Date(taxYearStart.getFullYear() + 1, 2, 31, 23, 59, 59, 999);
  return transactionDate >= taxYearStart && transactionDate <= taxYearEnd;
}

export function formatIndianTaxYear(reference: Date) {
  const startYear = reference.getMonth() >= 3 ? reference.getFullYear() : reference.getFullYear() - 1;
  const endYear = String(startYear + 1).slice(-2);
  return `${startYear}-${endYear}`;
}

export function offsetDate(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

export function offsetDateTime(days: number, hour: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(hour, 0, 0, 0);
  return date.toISOString();
}

export function toLocalDateTimeInput(value: string) {
  const date = new Date(value);
  const timezoneOffset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - timezoneOffset * 60_000);
  return local.toISOString().slice(0, 16);
}

export function getMemberAchievements(member: import("./types").MemberProfile, habits: import("./types").HabitItem[]): import("./types").Achievement[] {
  const maxStreak = habits.reduce((max, h) => Math.max(max, h.streakCount), 0);
  return [
    {
      id: "ach-1",
      title: "First Steps",
      description: "Reach Level 2",
      iconName: "Star",
      unlocked: member.level >= 2
    },
    {
      id: "ach-2",
      title: "Consistent Operator",
      description: "Achieve a 3-day streak",
      iconName: "Zap",
      unlocked: maxStreak >= 3
    },
    {
      id: "ach-3",
      title: "Wealth Builder",
      description: "Accumulate ₹50,000",
      iconName: "Shield",
      unlocked: member.totalBalance >= 50000
    },
    {
      id: "ach-4",
      title: "Centurion",
      description: "Reach Level 5",
      iconName: "Crown",
      unlocked: member.level >= 5
    }
  ];
}
