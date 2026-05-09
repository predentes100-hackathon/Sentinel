import type { LucideIcon } from "lucide-react";

export type ViewKey = "command" | "wealth" | "analytics";
export type Priority = "Low" | "Medium" | "High" | "Deep Work";
export type TransactionType = "Spend" | "Earn";
export type SortKey = "date" | "taskName" | "category" | "amount" | "splitStatus";
export type SortDirection = "asc" | "desc";
export type SyncState = "demo" | "syncing" | "live" | "error";
export type HabitIconKey = "surya" | "footwork" | "read" | "hydrate";

export type MemberProfile = {
  displayName: string;
  avatarUrl: string | null;
  level: number;
  xp: number;
  xpGoal: number;
  totalBalance: number;
  monthlySpend: number;
  monthlyEarned: number;
};

export type TaskItem = {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  xpValue: number;
  dueLabel: string;
  completed: boolean;
  recurrenceType: "once" | "daily";
  scheduledTime: string | null;
  lastCompletedOn: string | null;
};

export type HabitItem = {
  id: string;
  title: string;
  iconKey: HabitIconKey;
  xpValue: number;
  completed: boolean;
  streakCount: number;
};

export type SubscriptionFrequency = "Weekly" | "Monthly" | "Quarterly" | "Yearly";

export type FinanceCategory =
  | "Housing"
  | "Transportation"
  | "Groceries & food"
  | "Healthcare & insurance"
  | "Debt payments"
  | "Clothing"
  | "Personal care & hygiene"
  | "Household supplies"
  | "Phone & internet"
  | "Dining out & takeaway"
  | "Entertainment"
  | "Travel & vacations"
  | "Shopping (non-essential)"
  | "Fitness & wellness"
  | "Savings & emergency fund"
  | "Investments"
  | "Retirement contributions"
  | "Donations & giving"
  | "Gifts"
  | "Home maintenance & repairs"
  | "Medical/dental (out of pocket)"
  | "Education & courses";

export type TransactionItem = {
  id: string;
  date: string;
  taskName: string;
  category: FinanceCategory;
  type: TransactionType;
  amount: number;
  splitStatus: "Solo" | "Pending" | "Settled";
  participants: string[];
  owedToMe: number;
  tags: string[];
};

export type SubscriptionItem = {
  id: string;
  title: string;
  amount: number;
  frequency: SubscriptionFrequency;
  nextDueAt: string;
  reminderMinutes: number;
};

export type HeatmapCell = {
  date: string;
  value: number;
};

export type ViewDefinition = {
  key: ViewKey;
  label: string;
  icon: LucideIcon;
};

export type ToastState = {
  id: number;
  message: string;
};

export type CachedState = {
  member: MemberProfile;
  tasks: TaskItem[];
  habits: HabitItem[];
  transactions: TransactionItem[];
  subscriptions: SubscriptionItem[];
};

export type ActionFormState = {
  title: string;
  description: string;
  priority: Priority;
  repeatsDaily: boolean;
  dailyTime: string;
  involvesTransaction: boolean;
  transactionType: TransactionType;
  category: FinanceCategory;
  amount: string;
  splitBill: boolean;
  amIncluded: boolean;
  splitNames: string[];
  createSubscription: boolean;
  subscriptionFrequency: SubscriptionFrequency;
  nextDueAt: string;
  reminderHours: number;
  tags: string;
};

export type Achievement = {
  id: string;
  title: string;
  description: string;
  iconName: "Shield" | "Swords" | "Crown" | "Star" | "Zap";
  unlocked: boolean;
};

export type AIProfileState = {
  age: string;
  profession: string;
  goals: string;
  initialBalance: string;
};
