import { ArrowDownRight, ArrowUpRight, Sparkles, Wallet } from "lucide-react";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
  PieChart, Pie, Cell, Legend
} from "recharts";
import { HeatmapGrid, MonthlyHeatmap } from "../components/heatmaps";
import { StaggeredList, StaggeredItem } from "../components/shared";
import type { HeatmapCell, TransactionItem, MemberProfile } from "../types";

const PIE_COLORS = [
  "#D4AF37","#c0392b","#2980b9","#27ae60","#8e44ad",
  "#e67e22","#16a085","#d35400","#2c3e50","#e74c3c"
];

function buildCategorySpend(transactions: TransactionItem[]) {
  const map: Record<string, number> = {};
  for (const t of transactions) {
    if (t.type === "Spend") {
      map[t.category] = (map[t.category] ?? 0) + t.amount;
    }
  }
  return Object.entries(map)
    .map(([name, value]) => ({ name, value: Math.round(value) }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);
}

export function AnalyticsHub({
  xpHeatmap, inflowHeatmap, outflowHeatmap, trendSeries, comparisonSeries, transactions, member
}: {
  xpHeatmap: HeatmapCell[];
  inflowHeatmap: HeatmapCell[];
  outflowHeatmap: HeatmapCell[];
  trendSeries: { label: string; xp: number }[];
  comparisonSeries: { label: string; earned: number; spent: number }[];
  transactions: TransactionItem[];
  member: MemberProfile;
}) {
  const categorySpend = buildCategorySpend(transactions);
  const tooltipStyle = {
    borderRadius: 4,
    border: "1px solid rgba(212,175,55,0.30)",
    background: "rgba(25,32,41,0.96)",
    color: "#dce3f0"
  };

  return (
    <section className="glass-panel min-h-[calc(100vh-2rem)] rounded-[8px] p-4 sm:p-6">
      <div className="space-y-6">
        <div>
          <p className="text-xs uppercase tracking-[0.32em] text-[#d0c5af]">Analytics Hub</p>
          <h2 className="serif mt-2 text-3xl font-semibold tracking-tight text-[#dce3f0]">
            Heatmaps and momentum curves
          </h2>
          <p className="mt-3 max-w-3xl text-sm text-[#99907c]">
            Darker cells mark heavier focus or finance activity, while the charts surface XP velocity and spend versus earn rhythm.
          </p>
        </div>

        {/* XP Heatmap + Trend chart row */}
        <StaggeredList className="grid gap-6 2xl:grid-cols-[1.15fr_0.95fr]">
          <StaggeredItem>
            <div className="glass-panel rounded-[8px] p-5 sm:p-6 h-full">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.32em] text-[#d0c5af]">XP Matrix</p>
                <h3 className="serif mt-2 text-xl font-semibold text-[#dce3f0]">GitHub-style contribution calendar</h3>
              </div>
              <div className="rounded-[4px] border border-[#D4AF37]/20 bg-[#D4AF37]/5 px-3 py-2 text-xs uppercase tracking-[0.28em] text-[#D4AF37]">
                Productivity intensity
              </div>
            </div>
            <div className="mt-6 overflow-x-auto hide-scrollbar">
              <HeatmapGrid data={xpHeatmap} />
            </div>
          </div>

          <div className="glass-panel rounded-[8px] p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.32em] text-[#d0c5af]">XP Trend</p>
                <h3 className="serif mt-2 text-xl font-semibold text-[#dce3f0]">Weekly execution curve</h3>
              </div>
              <Sparkles className="h-5 w-5 text-[#D4AF37]" />
            </div>
            <div className="mt-6 h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendSeries}>
                  <defs>
                    <linearGradient id="xpFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#D4AF37" stopOpacity={0.7} />
                      <stop offset="100%" stopColor="#D4AF37" stopOpacity={0.04} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgba(212,175,55,0.08)" vertical={false} />
                  <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: "#99907c", fontSize: 12 }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fill: "#99907c", fontSize: 12 }} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Area type="monotone" dataKey="xp" stroke="#D4AF37" strokeWidth={2} fill="url(#xpFill)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            </div>
          </StaggeredItem>
        </StaggeredList>

        {/* Inflow / Outflow / Earn-vs-Spend row */}
        <StaggeredList className="grid gap-6 2xl:grid-cols-[1.15fr_1.15fr_0.9fr]">
          <StaggeredItem>
            <div className="glass-panel rounded-[8px] p-5 sm:p-6 h-full">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.32em] text-[#d0c5af]">Financial Heatmap</p>
                <h3 className="serif mt-2 text-xl font-semibold text-[#dce3f0]">Inflow</h3>
              </div>
              <ArrowUpRight className="h-5 w-5 text-[#D4AF37]" />
            </div>
            <div className="mt-6">
              <MonthlyHeatmap data={inflowHeatmap} variant="inflow" />
            </div>
            </div>
          </StaggeredItem>

          <StaggeredItem>
            <div className="glass-panel rounded-[8px] p-5 sm:p-6 h-full">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.32em] text-[#d0c5af]">Financial Heatmap</p>
                <h3 className="serif mt-2 text-xl font-semibold text-[#dce3f0]">Outflow</h3>
              </div>
              <ArrowDownRight className="h-5 w-5 text-[#c0392b]/80" />
            </div>
            <div className="mt-6">
              <MonthlyHeatmap data={outflowHeatmap} variant="outflow" />
            </div>
            </div>
          </StaggeredItem>

          <StaggeredItem>
            <div className="glass-panel rounded-[8px] p-5 sm:p-6 h-full">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.32em] text-[#d0c5af]">Cash Flow</p>
                <h3 className="serif mt-2 text-xl font-semibold text-[#dce3f0]">Earn vs Spend</h3>
              </div>
              <Wallet className="h-5 w-5 text-[#D4AF37]" />
            </div>
            <div className="mt-6 h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonSeries}>
                  <CartesianGrid stroke="rgba(212,175,55,0.08)" vertical={false} />
                  <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: "#99907c", fontSize: 12 }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fill: "#99907c", fontSize: 12 }} />
                  <Tooltip contentStyle={tooltipStyle} />
                  {/* Gold for earned, muted sienna for spent */}
                  <Bar dataKey="earned" fill="#D4AF37" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="spent" fill="#7a2020" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            </div>
          </StaggeredItem>
        </StaggeredList>

        {/* Spending Pie Chart */}
        <StaggeredList className="grid gap-6 lg:grid-cols-2">
          <StaggeredItem>
            <div className="glass-panel rounded-[8px] p-5 sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.32em] text-[#d0c5af]">Spending Breakdown</p>
                  <h3 className="serif mt-2 text-xl font-semibold text-[#dce3f0]">Category Distribution</h3>
                </div>
                <ArrowDownRight className="h-5 w-5 text-[#c0392b]/80" />
              </div>
              {categorySpend.length === 0 ? (
                <p className="mt-8 text-center text-sm text-[#99907c]">No spending data yet. Add some transactions.</p>
              ) : (
                <div className="mt-4 h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categorySpend}
                        cx="50%" cy="50%"
                        innerRadius={70} outerRadius={110}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {categorySpend.map((_, i) => (
                          <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={tooltipStyle}
                        formatter={(val: any) => `₹${Number(val).toLocaleString("en-IN")}`}
                      />
                      <Legend
                        iconType="circle"
                        iconSize={8}
                        formatter={(val) => <span className="text-xs text-[#d0c5af]">{val}</span>}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </StaggeredItem>

          <StaggeredItem>
            <div className="glass-panel rounded-[8px] p-5 sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.32em] text-[#d0c5af]">Top Spend Categories</p>
                  <h3 className="serif mt-2 text-xl font-semibold text-[#dce3f0]">Ranked by Amount</h3>
                </div>
                <Wallet className="h-5 w-5 text-[#D4AF37]" />
              </div>
              <div className="mt-5 space-y-3">
                {categorySpend.length === 0 ? (
                  <p className="text-sm text-[#99907c]">No data yet.</p>
                ) : categorySpend.map((cat, i) => {
                  const max = categorySpend[0].value;
                  const limit = member.budgetLimits?.[cat.name];
                  const overBudget = limit && cat.value > limit;
                  const pct = Math.round((cat.value / (limit || max)) * 100);
                  const displayPct = pct > 100 ? 100 : pct;

                  return (
                    <div key={cat.name}>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#d0c5af] truncate max-w-[50%]">
                          {cat.name} {limit && <span className="text-[#99907c] ml-1">(Limit: ₹{limit.toLocaleString()})</span>}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className={`${overBudget ? "text-red-400" : "text-[#D4AF37]"} font-mono`}>
                            ₹{cat.value.toLocaleString("en-IN")}
                          </span>
                          {overBudget && <span className="text-red-500 font-bold">!</span>}
                        </div>
                      </div>
                      <div className="mt-1 h-1.5 w-full rounded-full bg-[#232a34]">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${overBudget ? 'bg-red-500' : ''}`}
                          style={{ width: `${displayPct}%`, background: overBudget ? undefined : PIE_COLORS[i % PIE_COLORS.length] }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </StaggeredItem>
        </StaggeredList>
      </div>
    </section>
  );
}
