import { Suspense, lazy, startTransition, useEffect, useRef, Component, ErrorInfo, ReactNode } from "react";
import { BrowserRouter, Routes, Route, NavLink, Navigate, useNavigate, useLocation } from "react-router-dom";
import { Check, Database, LogIn, LogOut, Menu, Plus, RefreshCcw, Target, Users, X as XIcon } from "lucide-react";

import { useAppStore } from "./store";
import { useAppActions, loadDashboardFromSupabase } from "./hooks/useAppActions";
import { VIEWS, buildWeeklyHeatmap, buildMonthlyCalendarHeatmap, buildTrendSeries, buildFinancialComparisonSeries, sortTransactions, formatCurrency, formatIndianTaxYear, isWithinIndianTaxYear, escapeCsv, TODAY } from "./data";
import { AnimatePresence } from "framer-motion";
import { Avatar, MetricCard, SyncBadge, PageTransition } from "./components/shared";
import { SkeletonLoader } from "./components/SkeletonLoader";
import { AnimatedNumber } from "./components/AnimatedNumber";
import { MotionLanding } from "./components/MotionLanding";
import { DisclaimerView } from "./components/DisclaimerView";
import { AIProfileForm } from "./components/AIProfileForm";
import { supabase } from "./lib/supabase";
import { LevelUpBanner } from "./components/LevelUpBanner";
import { OnboardingTutorial } from "./components/OnboardingTutorial";

const CommandCenter = lazy(() => import("./views/CommandCenter").then(m => ({ default: m.CommandCenter })));
const WealthLedger = lazy(() => import("./views/WealthLedger").then(m => ({ default: m.WealthLedger })));
const AnalyticsHub = lazy(() => import("./views/AnalyticsHub").then(m => ({ default: m.AnalyticsHub })));
const NewUserBlankState = lazy(() => import("./views/NewUserBlankState").then(m => ({ default: m.NewUserBlankState })));
const ActionForgeModal = lazy(() => import("./views/ActionForgeModal").then(m => ({ default: m.ActionForgeModal })));

class ErrorBoundary extends Component<{children: ReactNode}, {hasError: boolean}> {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error: Error, info: ErrorInfo) { console.error("Caught by ErrorBoundary:", error, info); }
  render() {
    if (this.state.hasError) {
      return (
        <div className="glass-panel flex min-h-[calc(100vh-2rem)] items-center justify-center rounded-[8px] p-6 text-rose-400">
          <p>Something went wrong loading this view.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

function SectionFallback() {
  return (
    <div className="glass-panel flex min-h-[calc(100vh-2rem)] items-center justify-center rounded-[8px] p-6">
      <div className="rounded-[4px] border border-[#D4AF37]/20 bg-[#D4AF37]/5 px-4 py-2 text-sm text-[#D4AF37]">
        Loading view...
      </div>
    </div>
  );
}

function MainAppLayout() {
  const store = useAppStore();
  const actions = useAppActions();
  const location = useLocation();
  const navigate = useNavigate();

  const { member, tasks, habits, transactions, subscriptions, session, syncState, isModalOpen, toasts, habitBurstId, exportOpen, sortKey, sortDirection, isSaving, actionForm, sidebarOpen, levelUpShown } = store;

  const prevLevel = useRef(member.level);

  // Level-up detection
  useEffect(() => {
    if (member.level > prevLevel.current && member.level > levelUpShown) {
      store.setLevelUpShown(member.level);
    }
    prevLevel.current = member.level;
  }, [member.level]);

  const showLevelUp = member.level > 0 && member.level === levelUpShown && levelUpShown > (parseInt(localStorage.getItem('sentinel-last-level') || '0'));

  useEffect(() => {
    const client = supabase;
    if (!client) {
      store.setSyncState("demo");
      return;
    }

    let isActive = true;
    startTransition(() => {
      void client.auth.getSession().then(({ data, error }) => {
        if (!isActive) return;
        if (error) {
          store.setSyncState("error");
          store.pushToast("Supabase session check failed. Staying in demo mode.");
          return;
        }

        store.setSession(data.session ?? null);
        if (data.session?.user) {
          store.setSyncState("syncing");
          void loadDashboardFromSupabase(data.session.user, store);
        } else {
          store.setSyncState("demo");
        }
      });
    });

    const { data: listener } = client.auth.onAuthStateChange((_event, nextSession) => {
      store.setSession(nextSession);
      if (nextSession?.user) {
        store.setSyncState("syncing");
        startTransition(() => {
          void loadDashboardFromSupabase(nextSession.user, store);
        });
      } else {
        store.setSyncState("demo");
      }
    });

    return () => {
      isActive = false;
      listener.subscription.unsubscribe();
    };
  }, []); // Run once on mount

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key.toLowerCase() === "c" && !isModalOpen) {
        e.preventDefault();
        store.setIsModalOpen(true);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen, store]);

  const currentUser = session?.user ?? null;
  const displayTasks = tasks.map((task) => ({
    ...task,
    completed: task.recurrenceType === "daily" ? task.lastCompletedOn === new Date().toISOString().slice(0, 10) : task.completed,
    dueLabel: task.recurrenceType === "daily" ? "Daily" : task.dueLabel
  }));
  const totalOwedToMe = transactions.reduce((sum, txn) => sum + (txn.splitStatus === "Pending" ? txn.owedToMe : 0), 0);
  const burnRate = TODAY.getDate() > 0 ? member.monthlySpend / TODAY.getDate() : member.monthlySpend;
  const forecastedBurnRate = subscriptions.reduce((sum, sub) => {
    switch (sub.frequency) {
      case "Weekly": return sum + sub.amount * 4.33;
      case "Monthly": return sum + sub.amount;
      case "Quarterly": return sum + sub.amount / 3;
      case "Yearly": return sum + sub.amount / 12;
      default: return sum + sub.amount;
    }
  }, 0);
  const completedTasks = displayTasks.filter((t) => t.completed).length;
  const completionRate = displayTasks.length > 0 ? Math.round((completedTasks / displayTasks.length) * 100) : 0;
  
  const xpHeatmap = buildWeeklyHeatmap(14, member.xp + completedTasks * 6);
  const monthlyInflowHeatmap = buildMonthlyCalendarHeatmap("inflow", transactions);
  const monthlyOutflowHeatmap = buildMonthlyCalendarHeatmap("outflow", transactions);
  const trendSeries = buildTrendSeries(displayTasks, transactions);
  const comparisonSeries = buildFinancialComparisonSeries(transactions);
  const sortedTransactions = sortTransactions(transactions, sortKey, sortDirection);
  
  const splitNames = actionForm.splitNames.filter((name) => name.trim().length > 0);
  const splitParticipantCount = actionForm.splitBill && Number(actionForm.amount) > 0 ? splitNames.length + (actionForm.amIncluded ? 1 : 0) : 0;
  const splitPerHead = splitParticipantCount > 0 ? Number(actionForm.amount || 0) / splitParticipantCount : 0;
  const liveSplitSummary = actionForm.splitBill && Number(actionForm.amount) > 0
      ? `${splitParticipantCount} participants | ${formatCurrency(splitPerHead)} each`
      : "Enable split bill to calculate shares.";

  const hasWorkspaceData = tasks.length > 0 || habits.length > 0 || transactions.length > 0 || subscriptions.length > 0 || member.totalBalance > 0 || member.monthlySpend > 0 || member.monthlyEarned > 0 || member.xp > 0 || member.level > 1;
  const showNewUserBlankState = Boolean(currentUser) && syncState !== "syncing" && !hasWorkspaceData;

  function exportLedger(mode: "full" | "tax") {
    const filtered = mode === "full" ? transactions : transactions.filter((t) => isWithinIndianTaxYear(t.date, TODAY));
    const csvRows = [
      ["Date", "Task Name", "Category", "Type", "Amount", "Split Status", "Participants", "Owed To Me"].join(","),
      ...filtered.map((t) =>
        [t.date, escapeCsv(t.taskName), escapeCsv(t.category), t.type, t.amount.toFixed(2), t.splitStatus, escapeCsv(t.participants.join(" | ")), t.owedToMe.toFixed(2)].join(",")
      )
    ];
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const href = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = href;
    anchor.download = mode === "full" ? "life-os-ledger.csv" : `life-os-tax-report-${formatIndianTaxYear(TODAY)}.csv`;
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(href);
    store.setExportOpen(false);
    store.pushToast(mode === "full" ? "Full ledger CSV ready." : "Tax year report downloaded.");
  }

  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-4 text-[#dce3f0] sm:px-6 lg:px-8">
      <div className="orb left-[-160px] top-[100px] h-96 w-96 bg-[#D4AF37]/30" />
      <div className="orb bottom-[-120px] right-[8%] h-80 w-80 bg-[#D4AF37]/15" />

      {/* Mobile hamburger */}
      <button
        className="fixed left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-[4px] border border-[#D4AF37]/20 bg-[#192029] text-[#D4AF37] lg:hidden"
        onClick={() => store.setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle sidebar"
      >
        {sidebarOpen ? <XIcon className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-[#0d141d]/70 backdrop-blur-sm lg:hidden"
          onClick={() => store.setSidebarOpen(false)}
        />
      )}

      <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-[1800px] flex-col gap-4 lg:flex-row">
        <aside className={`glass-panel fixed top-0 left-0 z-40 flex h-full w-[300px] shrink-0 flex-col overflow-y-auto overflow-hidden rounded-[8px] p-4 transition-transform duration-300 lg:static lg:translate-x-0 lg:h-auto ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}>
          <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent" />
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-[#99907c]">Life OS</p>
              <h1 className="serif mt-2 text-2xl font-semibold tracking-tight text-[#dce3f0]">Sentinel</h1>
            </div>
            <div className="rounded-[4px] border border-[#D4AF37]/20 bg-[#D4AF37]/8 p-3">
              <Target className="h-5 w-5 text-[#D4AF37]" />
            </div>
          </div>

          <div className="glass-panel mb-6 rounded-[8px] p-4">
            <div className="flex items-center gap-3">
              <Avatar member={member} />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-[#dce3f0]">{member.displayName}</p>
                <p className="mt-1 text-xs text-[#99907c]">
                  {currentUser ? currentUser.email : "Demo mode with local cache"}
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between rounded-[4px] border border-[#D4AF37]/15 bg-[#0d141d]/50 px-3 py-2">
              <div className="text-xs uppercase tracking-[0.28em] text-[#99907c]">Sync</div>
              <SyncBadge syncState={syncState} />
            </div>
          </div>

          <nav className="space-y-2">
            {VIEWS.map((view) => {
              const Icon = view.icon;
              const active = location.pathname.includes(view.key);
              return (
                <NavLink
                  key={view.key}
                  to={`/${view.key}`}
                  aria-current={active ? "page" : undefined}
                  onClick={() => store.setSidebarOpen(false)}
                  className={`relative flex w-full items-center justify-between rounded-[4px] border px-4 py-3 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]/50 ${
                    active
                      ? "border-[#D4AF37]/30 bg-[#D4AF37]/8 text-[#dce3f0] nav-gold-glow"
                      : "border-[#D4AF37]/8 bg-[#192029] text-[#d0c5af] hover:border-[#D4AF37]/20 hover:bg-[#232a34]"
                  }`}
                  aria-label={view.label}
                >
                  <div className="flex items-center gap-3">
                    <span className={`rounded-[4px] p-2 ${active ? "bg-[#D4AF37]/15 text-[#D4AF37]" : "bg-[#232a34] text-[#99907c]"}`}>
                      <Icon className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="font-medium">{view.label}</p>
                      <p className="mt-1 text-xs text-[#99907c]">
                        {view.key === "command" ? "Focus, tasks, rituals" : view.key === "wealth" ? "Transactions and splits" : "XP + finance heatmaps"}
                      </p>
                    </div>
                  </div>
                  <Check className={`h-4 w-4 ${active ? "text-[#D4AF37]" : "text-transparent"}`} />
                </NavLink>
              );
            })}
          </nav>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <MetricCard title="Streak health" value={<><AnimatedNumber value={habits.filter((h) => h.completed).length} />/{habits.length}</>} sublabel="routines locked today" icon={Target} tone="amber" />
            <MetricCard title="Pending splits" value={<AnimatedNumber value={totalOwedToMe} prefix="₹" decimals={2} />} sublabel="owed back to you" icon={Users} tone="emerald" />
          </div>

          <div className="mt-auto space-y-3 pt-6">
            <div className="glass-panel rounded-[8px] p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-[#99907c]">Google Login</p>
                  <p className="mt-2 text-sm text-[#d0c5af]">Connect Supabase auth to sync your member balances.</p>
                </div>
                <Database className="mt-0.5 h-5 w-5 text-[#D4AF37]" />
              </div>
              <button
                type="button"
                onClick={currentUser ? actions.handleSignOut : actions.handleGoogleAuth}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-[4px] border border-[#D4AF37]/20 bg-[#D4AF37]/5 px-4 py-3 text-sm font-medium text-[#dce3f0] transition hover:border-[#D4AF37]/35 hover:bg-[#D4AF37]/12 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]/50"
              >
                {currentUser ? <><LogOut className="h-4 w-4" /> Sign out</> : <><LogIn className="h-4 w-4" /> Connect with Google</>}
              </button>
            </div>

            <div className="glass-panel rounded-[8px] p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-[#99907c]">Workspace Reset</p>
                </div>
                <RefreshCcw className="mt-0.5 h-5 w-5 text-[#99907c]" />
              </div>
              <button
                type="button"
                onClick={actions.handleResetWorkspace}
                disabled={isSaving}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-[4px] border border-[#7a2020]/30 bg-[#7a2020]/10 px-4 py-3 text-sm font-medium text-[#f87171]/80 transition hover:bg-[#7a2020]/20 disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/50"
              >
                <RefreshCcw className={`h-4 w-4 ${isSaving ? "animate-spin" : ""}`} />
                {isSaving ? "Resetting..." : "Reset workspace"}
              </button>
            </div>
          </div>
        </aside>

        <main className="flex-1 overflow-hidden rounded-[8px]">
          <ErrorBoundary>
            <Suspense fallback={<SectionFallback />}>
              {syncState === "syncing" ? (
                <SkeletonLoader />
              ) : showNewUserBlankState ? (
                <NewUserBlankState
                  displayName={member.displayName}
                  onCreateAction={() => store.setIsModalOpen(true)}
                  onOpenWealthLedger={() => navigate("/wealth")}
                />
              ) : (
                <AnimatePresence mode="wait">
                  <Routes location={location} key={location.pathname}>
                    <Route path="/command" element={<PageTransition><CommandCenter member={member} tasks={displayTasks} habits={habits} subscriptions={subscriptions} completionRate={completionRate} habitBurstId={habitBurstId} onCompleteTask={actions.handleCompleteTask} onCompleteHabit={actions.handleCompleteHabit} onAddHabit={actions.handleAddHabit} aiProfile={store.aiProfile} /></PageTransition>} />
                    <Route path="/wealth" element={<PageTransition><WealthLedger member={member} burnRate={burnRate} forecastedBurnRate={forecastedBurnRate} totalOwedToMe={totalOwedToMe} transactions={sortedTransactions} exportOpen={exportOpen} sortKey={sortKey} sortDirection={sortDirection} onToggleExport={() => store.setExportOpen(!exportOpen)} onSort={(k) => store.sortKey === k ? store.setSortDirection(store.sortDirection === "asc" ? "desc" : "asc") : (store.setSortKey(k), store.setSortDirection("desc"))} onExport={exportLedger} /></PageTransition>} />
                    <Route path="/analytics" element={<PageTransition><AnalyticsHub xpHeatmap={xpHeatmap} inflowHeatmap={monthlyInflowHeatmap} outflowHeatmap={monthlyOutflowHeatmap} trendSeries={trendSeries} comparisonSeries={comparisonSeries} transactions={transactions} member={member} /></PageTransition>} />
                    <Route path="*" element={<Navigate to="/command" replace />} />
                  </Routes>
                </AnimatePresence>
              )}
            </Suspense>
          </ErrorBoundary>
        </main>
      </div>

      <button
        type="button"
        aria-label="Open Action Forge"
        onClick={() => store.setIsModalOpen(true)}
        className="fixed bottom-6 right-6 z-30 inline-flex items-center gap-3 rounded-[4px] bg-[#D4AF37] px-5 py-4 text-sm font-bold text-[#0d141d] transition hover:bg-[#f2ca50] focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
        style={{ boxShadow: "0 0 40px rgba(212,175,55,0.30), 0 16px 48px rgba(0,0,0,0.5)" }}
      >
        <Plus className="h-5 w-5" />
        Action Forge
      </button>

      {isModalOpen ? (
        <Suspense fallback={null}>
          <ActionForgeModal
            form={actionForm}
            isSaving={isSaving}
            splitNames={splitNames}
            liveSplitSummary={liveSplitSummary}
            splitPerHead={splitPerHead}
            onClose={() => { store.setIsModalOpen(false); store.resetActionForm(); }}
            onFormChange={store.setActionForm}
            onCommit={() => actions.commitAction(splitNames, splitPerHead)}
          />
        </Suspense>
      ) : null}

      <div className="fixed left-1/2 top-6 z-40 flex -translate-x-1/2 flex-col gap-2">
        {toasts.map((toast) => (
          <div key={toast.id} className="rounded-full border border-white/10 bg-slate-950/80 px-4 py-2 text-sm text-slate-100 shadow-[0_16px_40px_rgba(0,0,0,0.45)] backdrop-blur-xl animate-in slide-in-from-top-4 fade-in duration-300">
            {toast.message}
          </div>
        ))}
      </div>

      {/* Level-Up Banner */}
      {showLevelUp && (
        <LevelUpBanner
          level={member.level}
          onClose={() => {
            localStorage.setItem('sentinel-last-level', String(member.level));
            store.setLevelUpShown(0);
          }}
        />
      )}

      <OnboardingTutorial />
    </div>
  );
}

export default function App() {
  const store = useAppStore();
  if (!store.hasEntered) {
    return <MotionLanding onEnter={() => store.setHasEntered(true)} />;
  }
  if (!store.hasAcceptedDisclaimer) {
    return <DisclaimerView onAccept={() => store.setHasAcceptedDisclaimer(true)} />;
  }
  if (!store.aiProfile) {
    return (
      <AIProfileForm
        onComplete={(profile) => {
          store.setAiProfile(profile);
          const bal = parseFloat(profile.initialBalance);
          if (bal > 0) {
            store.setMember((m) => ({ ...m, totalBalance: bal }));
          }
        }}
      />
    );
  }
  return (
    <BrowserRouter>
      <MainAppLayout />
    </BrowserRouter>
  );
}
