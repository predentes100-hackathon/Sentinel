import { ArrowDownRight, ArrowUpRight, Users, Wallet } from "lucide-react";
import { CATEGORY_META, formatCurrency, formatDate } from "../data";
import { ExportMenuToggle, MetricCard, SortButton } from "../components/shared";
import type {
  MemberProfile,
  SortDirection,
  SortKey,
  TransactionItem
} from "../types";

export function WealthLedger({
  member,
  burnRate,
  totalOwedToMe,
  transactions,
  exportOpen,
  sortKey,
  sortDirection,
  onToggleExport,
  onSort,
  onExport
}: {
  member: MemberProfile;
  burnRate: number;
  totalOwedToMe: number;
  transactions: TransactionItem[];
  exportOpen: boolean;
  sortKey: SortKey;
  sortDirection: SortDirection;
  onToggleExport: () => void;
  onSort: (key: SortKey) => void;
  onExport: (mode: "full" | "tax") => void;
}) {
  return (
    <section className="glass-panel min-h-[calc(100vh-2rem)] rounded-[32px] p-4 sm:p-6">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-slate-400">Financial Ledger</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white">Wealth view</h2>
            <p className="mt-3 max-w-2xl text-sm text-slate-400">
              Track spend, earnings, split status, and export-ready rows without leaving the system.
            </p>
          </div>

          <div className="relative">
            <ExportMenuToggle open={exportOpen} onClick={onToggleExport} />

            {exportOpen ? (
              <div className="glass-panel absolute right-0 top-14 z-20 w-64 rounded-[22px] p-2">
                <button
                  type="button"
                  onClick={() => onExport("full")}
                  className="flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm text-slate-200 transition hover:bg-white/[0.06]"
                >
                  <span>Download Full CSV</span>
                  <ArrowDownRight className="h-4 w-4 text-cyan-200" />
                </button>
                <button
                  type="button"
                  onClick={() => onExport("tax")}
                  className="flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm text-slate-200 transition hover:bg-white/[0.06]"
                >
                  <span>Download Tax Year Report</span>
                  <ArrowDownRight className="h-4 w-4 text-cyan-200" />
                </button>
              </div>
            ) : null}
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-3">
          <MetricCard
            title="Total Liquid Assets"
            value={formatCurrency(member.totalBalance)}
            sublabel="cash + liquid reserves"
            icon={Wallet}
            tone="emerald"
          />
          <MetricCard
            title="This Month's Burn Rate"
            value={`${formatCurrency(burnRate)}/day`}
            sublabel="average outflow cadence"
            icon={ArrowDownRight}
            tone="amber"
          />
          <MetricCard
            title="Owed to Me"
            value={formatCurrency(totalOwedToMe)}
            sublabel="pending split recovery"
            icon={Users}
            tone="cyan"
          />
        </div>

        <div className="glass-panel overflow-hidden rounded-[28px]">
          <div className="grid grid-cols-[1.15fr_1fr_1fr_0.9fr_0.95fr] gap-4 border-b border-white/8 px-4 py-4 text-xs uppercase tracking-[0.28em] text-slate-400 sm:px-6">
            <SortButton label="Date" active={sortKey === "date"} direction={sortDirection} onClick={() => onSort("date")} />
            <SortButton
              label="Task Name"
              active={sortKey === "taskName"}
              direction={sortDirection}
              onClick={() => onSort("taskName")}
            />
            <SortButton
              label="Category"
              active={sortKey === "category"}
              direction={sortDirection}
              onClick={() => onSort("category")}
            />
            <SortButton
              label="Amount"
              active={sortKey === "amount"}
              direction={sortDirection}
              onClick={() => onSort("amount")}
            />
            <SortButton
              label="Split Status"
              active={sortKey === "splitStatus"}
              direction={sortDirection}
              onClick={() => onSort("splitStatus")}
            />
          </div>

          <div className="max-h-[620px] overflow-auto">
            {transactions.map((transaction) => {
              const meta = CATEGORY_META[transaction.category];
              const Icon = meta.icon;
              return (
                <div
                  key={transaction.id}
                  className="grid grid-cols-1 gap-4 border-b border-white/5 px-4 py-4 transition hover:bg-white/[0.03] sm:px-6 lg:grid-cols-[1.15fr_1fr_1fr_0.9fr_0.95fr]"
                >
                  <div className="text-sm text-slate-300">{formatDate(transaction.date)}</div>
                  <div>
                    <p className="font-medium text-white">{transaction.taskName}</p>
                    {transaction.participants.length > 0 ? (
                      <p className="mt-1 text-xs text-slate-400">Split with {transaction.participants.join(", ")}</p>
                    ) : null}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`rounded-2xl p-2 ${meta.className}`}>
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="text-sm text-slate-300">{transaction.category}</span>
                  </div>
                  <div
                    className={`text-sm font-semibold ${
                      transaction.type === "Earn" ? "text-emerald-300" : "text-rose-300"
                    }`}
                  >
                    {transaction.type === "Earn" ? "+" : "-"}
                    {formatCurrency(transaction.amount)}
                  </div>
                  <div className="flex items-center justify-start lg:justify-end">
                    <span
                      className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${
                        transaction.splitStatus === "Pending"
                          ? "border-amber-300/20 bg-amber-400/10 text-amber-100"
                          : transaction.splitStatus === "Settled"
                            ? "border-emerald-300/20 bg-emerald-400/10 text-emerald-100"
                            : "border-white/10 bg-white/[0.03] text-slate-300"
                      }`}
                    >
                      {transaction.splitStatus}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
