import { ArrowDownRight, ArrowUpRight, Sparkles, Wallet } from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { HeatmapGrid, MonthlyHeatmap } from "../components/heatmaps";
import type { HeatmapCell } from "../types";

export function AnalyticsHub({
  xpHeatmap,
  inflowHeatmap,
  outflowHeatmap,
  trendSeries,
  comparisonSeries
}: {
  xpHeatmap: HeatmapCell[];
  inflowHeatmap: HeatmapCell[];
  outflowHeatmap: HeatmapCell[];
  trendSeries: { label: string; xp: number }[];
  comparisonSeries: { label: string; earned: number; spent: number }[];
}) {
  return (
    <section className="glass-panel min-h-[calc(100vh-2rem)] rounded-[32px] p-4 sm:p-6">
      <div className="space-y-6">
        <div>
          <p className="text-xs uppercase tracking-[0.32em] text-slate-400">Analytics Hub</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white">Heatmaps and momentum curves</h2>
          <p className="mt-3 max-w-3xl text-sm text-slate-400">
            Darker cells mark heavier focus or finance activity, while the charts surface XP velocity and spend versus earn rhythm.
          </p>
        </div>

        <div className="grid gap-6 2xl:grid-cols-[1.15fr_0.95fr]">
          <div className="glass-panel rounded-[28px] p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.32em] text-slate-400">XP Matrix</p>
                <h3 className="mt-2 text-xl font-semibold text-white">GitHub-style contribution calendar</h3>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs uppercase tracking-[0.28em] text-cyan-100">
                Productivity intensity
              </div>
            </div>
            <div className="mt-6 overflow-x-auto hide-scrollbar">
              <HeatmapGrid data={xpHeatmap} />
            </div>
          </div>

          <div className="glass-panel rounded-[28px] p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.32em] text-slate-400">XP Trend</p>
                <h3 className="mt-2 text-xl font-semibold text-white">Weekly execution curve</h3>
              </div>
              <Sparkles className="h-5 w-5 text-cyan-200" />
            </div>
            <div className="mt-6 h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendSeries}>
                  <defs>
                    <linearGradient id="xpFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#67e8f9" stopOpacity={0.8} />
                      <stop offset="100%" stopColor="#67e8f9" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgba(148, 163, 184, 0.12)" vertical={false} />
                  <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 16,
                      border: "1px solid rgba(255,255,255,0.08)",
                      background: "rgba(2,6,23,0.92)"
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="xp"
                    stroke="#67e8f9"
                    strokeWidth={3}
                    fill="url(#xpFill)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="grid gap-6 2xl:grid-cols-[1.15fr_1.15fr_0.9fr]">
          <div className="glass-panel rounded-[28px] p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.32em] text-slate-400">Financial Heatmap</p>
                <h3 className="mt-2 text-xl font-semibold text-white">Inflow</h3>
              </div>
              <ArrowUpRight className="h-5 w-5 text-emerald-200" />
            </div>
            <div className="mt-6">
              <MonthlyHeatmap data={inflowHeatmap} variant="inflow" />
            </div>
          </div>

          <div className="glass-panel rounded-[28px] p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.32em] text-slate-400">Financial Heatmap</p>
                <h3 className="mt-2 text-xl font-semibold text-white">Outflow</h3>
              </div>
              <ArrowDownRight className="h-5 w-5 text-rose-200" />
            </div>
            <div className="mt-6">
              <MonthlyHeatmap data={outflowHeatmap} variant="outflow" />
            </div>
          </div>

          <div className="glass-panel rounded-[28px] p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.32em] text-slate-400">Cash Flow</p>
                <h3 className="mt-2 text-xl font-semibold text-white">Earn vs Spend</h3>
              </div>
              <Wallet className="h-5 w-5 text-cyan-200" />
            </div>
            <div className="mt-6 h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonSeries}>
                  <CartesianGrid stroke="rgba(148, 163, 184, 0.12)" vertical={false} />
                  <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 16,
                      border: "1px solid rgba(255,255,255,0.08)",
                      background: "rgba(2,6,23,0.92)"
                    }}
                  />
                  <Bar dataKey="earned" fill="#22c55e" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="spent" fill="#ef4444" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
