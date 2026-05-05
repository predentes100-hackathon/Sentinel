import { ArrowDownRight, ArrowUpRight, Users, Wallet } from "lucide-react";
import { CATEGORY_META, formatCurrency, formatDate } from "../data";
import { ExportMenuToggle, MetricCard, SortButton } from "../components/shared";
import type { MemberProfile, SortDirection, SortKey, TransactionItem } from "../types";

export function WealthLedger({
  member, burnRate, totalOwedToMe, transactions, exportOpen,
  sortKey, sortDirection, onToggleExport, onSort, onExport
}: {
  member: MemberProfile; burnRate: number; totalOwedToMe: number;
  transactions: TransactionItem[]; exportOpen: boolean;
  sortKey: SortKey; sortDirection: SortDirection;
  onToggleExport: () => void; onSort: (key: SortKey) => void;
  onExport: (mode: "full" | "tax") => void;
}) {
  return (
    <section className="glass-panel min-h-[calc(100vh-2rem)] rounded-[8px] p-4 sm:p-6">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-[#d0c5af]">Financial Ledger</p>
            <h2 className="serif mt-2 text-3xl font-semibold tracking-tight text-[#dce3f0]">Wealth view</h2>
            <p className="mt-3 max-w-2xl text-sm text-[#99907c]">
              Track spend, earnings, split status, and export-ready rows without leaving the system.
            </p>
          </div>
          <div className="relative">
            <ExportMenuToggle open={exportOpen} onClick={onToggleExport} />
            {exportOpen ? (
              <div className="glass-panel absolute right-0 top-14 z-20 w-64 rounded-[8px] p-2">
                <button type="button" onClick={() => onExport("full")}
                  className="flex w-full items-center justify-between rounded-[4px] px-4 py-3 text-left text-sm text-[#dce3f0] transition hover:bg-[#D4AF37]/8">
                  <span>Download Full CSV</span>
                  <ArrowDownRight className="h-4 w-4 text-[#D4AF37]" />
                </button>
                <button type="button" onClick={() => onExport("tax")}
                  className="flex w-full items-center justify-between rounded-[4px] px-4 py-3 text-left text-sm text-[#dce3f0] transition hover:bg-[#D4AF37]/8">
                  <span>Download Tax Year Report</span>
                  <ArrowDownRight className="h-4 w-4 text-[#D4AF37]" />
                </button>
              </div>
            ) : null}
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-3">
          <MetricCard title="Total Liquid Assets" value={formatCurrency(member.totalBalance)}
            sublabel="cash + liquid reserves" icon={Wallet} tone="gold" />
          <MetricCard title="This Month's Burn Rate" value={`${formatCurrency(burnRate)}/day`}
            sublabel="average outflow cadence" icon={ArrowDownRight} tone="amber" />
          <MetricCard title="Owed to Me" value={formatCurrency(totalOwedToMe)}
            sublabel="pending split recovery" icon={Users} tone="emerald" />
        </div>

        <div className="glass-panel overflow-hidden rounded-[8px]">
          <div className="grid grid-cols-[1.15fr_1fr_1fr_0.9fr_0.95fr] gap-4 border-b border-[#D4AF37]/10 px-4 py-4 text-xs uppercase tracking-[0.28em] text-[#99907c] sm:px-6">
            <SortButton label="Date" active={sortKey === "date"} direction={sortDirection} onClick={() => onSort("date")} />
            <SortButton label="Task Name" active={sortKey === "taskName"} direction={sortDirection} onClick={() => onSort("taskName")} />
            <SortButton label="Category" active={sortKey === "category"} direction={sortDirection} onClick={() => onSort("category")} />
            <SortButton label="Amount" active={sortKey === "amount"} direction={sortDirection} onClick={() => onSort("amount")} />
            <SortButton label="Split Status" active={sortKey === "splitStatus"} direction={sortDirection} onClick={() => onSort("splitStatus")} />
          </div>

          <div className="max-h-[620px] overflow-auto">
            {transactions.map((tx) => {
              const meta = CATEGORY_META[tx.category];
              const Icon = meta.icon;
              return (
                <div key={tx.id}
                  className="grid grid-cols-1 gap-4 border-b border-[#D4AF37]/8 px-4 py-4 transition hover:bg-[#232a34] sm:px-6 lg:grid-cols-[1.15fr_1fr_1fr_0.9fr_0.95fr]">
                  <div className="text-sm text-[#d0c5af]">{formatDate(tx.date)}</div>
                  <div>
                    <p className="font-medium text-[#dce3f0]">{tx.taskName}</p>
                    {tx.participants.length > 0 ? (
                      <p className="mt-1 text-xs text-[#99907c]">Split with {tx.participants.join(", ")}</p>
                    ) : null}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`rounded-[4px] p-2 ${meta.className}`}><Icon className="h-4 w-4" /></span>
                    <span className="text-sm text-[#d0c5af]">{tx.category}</span>
                  </div>
                  <div className={`text-sm font-semibold ${tx.type === "Earn" ? "text-[#D4AF37]" : "text-[#c0392b]/80"}`}>
                    {tx.type === "Earn" ? "+" : "-"}{formatCurrency(tx.amount)}
                  </div>
                  <div className="flex items-center justify-start lg:justify-end">
                    <span className={`inline-flex rounded-[2px] border px-3 py-1 text-xs font-medium ${
                      tx.splitStatus === "Pending"
                        ? "border-[#D4AF37]/25 bg-[#D4AF37]/10 text-[#D4AF37]"
                        : tx.splitStatus === "Settled"
                          ? "border-[#2d4a3e]/60 bg-[#1a3a2e]/60 text-[#6ee7b7]"
                          : "border-[#4d4635] bg-[#080f17] text-[#d0c5af]"
                    }`}>
                      {tx.splitStatus}
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
