import { create } from 'zustand';
import type { Session } from '@supabase/supabase-js';
import { loadCachedState } from '../data';
import type { 
  MemberProfile, TaskItem, HabitItem, TransactionItem, SubscriptionItem,
  SyncState, SortKey, SortDirection, ActionFormState, ToastState
} from '../types';
import { buildInitialActionForm } from '../data';

interface AppState {
  hasEntered: boolean;
  setHasEntered: (val: boolean) => void;
  
  hasAcceptedDisclaimer: boolean;
  setHasAcceptedDisclaimer: (val: boolean) => void;
  
  aiProfile: import('../types').AIProfileState | null;
  setAiProfile: (profile: import('../types').AIProfileState | null) => void;
  
  member: MemberProfile;
  setMember: (member: MemberProfile | ((curr: MemberProfile) => MemberProfile)) => void;
  
  tasks: TaskItem[];
  setTasks: (tasks: TaskItem[] | ((curr: TaskItem[]) => TaskItem[])) => void;
  
  habits: HabitItem[];
  setHabits: (habits: HabitItem[] | ((curr: HabitItem[]) => HabitItem[])) => void;
  
  transactions: TransactionItem[];
  setTransactions: (transactions: TransactionItem[] | ((curr: TransactionItem[]) => TransactionItem[])) => void;
  
  subscriptions: SubscriptionItem[];
  setSubscriptions: (subscriptions: SubscriptionItem[] | ((curr: SubscriptionItem[]) => SubscriptionItem[])) => void;
  
  session: Session | null;
  setSession: (session: Session | null) => void;
  
  syncState: SyncState;
  setSyncState: (state: SyncState) => void;
  
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  
  toasts: ToastState[];
  pushToast: (message: string) => void;
  removeToast: (id: number) => void;
  
  habitBurstId: string | null;
  setHabitBurstId: (id: string | null) => void;
  
  exportOpen: boolean;
  setExportOpen: (isOpen: boolean) => void;
  
  sortKey: SortKey;
  setSortKey: (key: SortKey) => void;
  
  sortDirection: SortDirection;
  setSortDirection: (dir: SortDirection) => void;
  
  isSaving: boolean;
  setIsSaving: (isSaving: boolean) => void;
  
  actionForm: ActionFormState;
  setActionForm: (form: ActionFormState | ((curr: ActionFormState) => ActionFormState)) => void;
  resetActionForm: () => void;

  sidebarOpen: boolean;
  setSidebarOpen: (val: boolean) => void;

  levelUpShown: number;
  setLevelUpShown: (level: number) => void;
}

const cached = loadCachedState();

export const useAppStore = create<AppState>((set) => ({
  hasEntered: false,
  setHasEntered: (hasEntered) => set({ hasEntered }),

  hasAcceptedDisclaimer: localStorage.getItem('sentinel-disclaimer') === 'true',
  setHasAcceptedDisclaimer: (hasAcceptedDisclaimer) => {
    localStorage.setItem('sentinel-disclaimer', hasAcceptedDisclaimer ? 'true' : 'false');
    set({ hasAcceptedDisclaimer });
  },

  aiProfile: JSON.parse(localStorage.getItem('sentinel-ai-profile') || 'null'),
  setAiProfile: (aiProfile) => {
    if (aiProfile) {
      localStorage.setItem('sentinel-ai-profile', JSON.stringify(aiProfile));
    } else {
      localStorage.removeItem('sentinel-ai-profile');
    }
    set({ aiProfile });
  },

  member: cached.member,
  setMember: (member) => set((state) => ({ member: typeof member === 'function' ? member(state.member) : member })),

  tasks: cached.tasks,
  setTasks: (tasks) => set((state) => ({ tasks: typeof tasks === 'function' ? tasks(state.tasks) : tasks })),

  habits: cached.habits,
  setHabits: (habits) => set((state) => ({ habits: typeof habits === 'function' ? habits(state.habits) : habits })),

  transactions: cached.transactions,
  setTransactions: (transactions) => set((state) => ({ transactions: typeof transactions === 'function' ? transactions(state.transactions) : transactions })),

  subscriptions: cached.subscriptions,
  setSubscriptions: (subscriptions) => set((state) => ({ subscriptions: typeof subscriptions === 'function' ? subscriptions(state.subscriptions) : subscriptions })),

  session: null,
  setSession: (session) => set({ session }),

  syncState: 'demo',
  setSyncState: (syncState) => set({ syncState }),

  isModalOpen: false,
  setIsModalOpen: (isModalOpen) => set({ isModalOpen }),

  toasts: [],
  pushToast: (message) => {
    const id = Date.now();
    set((state) => ({
      toasts: [...state.toasts, { id, message }]
    }));
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter(t => t.id !== id)
      }));
    }, 3000);
  },
  removeToast: (id) => set((state) => ({
    toasts: state.toasts.filter(t => t.id !== id)
  })),

  habitBurstId: null,
  setHabitBurstId: (habitBurstId) => set({ habitBurstId }),

  exportOpen: false,
  setExportOpen: (exportOpen) => set({ exportOpen }),

  sortKey: 'date',
  setSortKey: (sortKey) => set({ sortKey }),

  sortDirection: 'desc',
  setSortDirection: (sortDirection) => set({ sortDirection }),

  isSaving: false,
  setIsSaving: (isSaving) => set({ isSaving }),

  actionForm: buildInitialActionForm(),
  setActionForm: (actionForm) => set((state) => ({ actionForm: typeof actionForm === 'function' ? actionForm(state.actionForm) : actionForm })),
  resetActionForm: () => set({ actionForm: buildInitialActionForm() }),

  sidebarOpen: false,
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),

  levelUpShown: 0,
  setLevelUpShown: (levelUpShown) => set({ levelUpShown }),
}));
