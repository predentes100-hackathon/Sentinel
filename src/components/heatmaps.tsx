import { formatCurrency, formatDate, getFinancialHeatColor, TODAY } from "../data";
import type { HeatmapCell } from "../types";

function chunkIntoWeeks(data: HeatmapCell[]) {
  const weeks: HeatmapCell[][] = [];
  for (let index = 0; index < data.length; index += 7) {
    weeks.push(data.slice(index, index + 7));
  }
  return weeks;
}

export function HeatmapGrid({
  data
}: {
  data: HeatmapCell[];
}) {
  const weeks = chunkIntoWeeks(data);
  const palette = ["#0f1729", "#13233f", "#164e63", "#0ea5e9", "#67e8f9"];

  return (
    <div className="grid grid-cols-[auto_repeat(14,minmax(0,1fr))] gap-2">
      <div className="grid grid-rows-7 gap-2 pt-8 text-[10px] uppercase tracking-[0.22em] text-slate-500">
        {["Mon", "", "Wed", "", "Fri", "", "Sun"].map((label, index) => (
          <div key={`${label}-${index}`} className="flex h-5 items-center">
            {label}
          </div>
        ))}
      </div>

      {weeks.map((week, weekIndex) => (
        <div key={`week-${weekIndex}`} className="grid grid-rows-7 gap-2">
          {week.map((cell) => (
            <div
              key={cell.date}
              title={`${formatDate(cell.date)} | ${cell.value} XP`}
              className="heat-cell h-5 w-5 rounded-md border border-white/5"
              style={{ backgroundColor: palette[Math.min(Math.floor(cell.value / 25), 4)] }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export function MonthlyHeatmap({
  data,
  variant
}: {
  data: HeatmapCell[];
  variant: "inflow" | "outflow";
}) {
  const monthLabel = new Date(TODAY.getFullYear(), TODAY.getMonth(), 1).toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric"
  });

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-medium text-white">{monthLabel}</p>
        <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
          {variant === "inflow" ? "Green intensity" : "Red intensity"}
        </p>
      </div>

      <div className="mb-3 grid grid-cols-7 gap-2 text-center text-[10px] uppercase tracking-[0.24em] text-slate-500">
        {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
          <span key={`${day}-${index}`}>{day}</span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {data.map((cell) => {
          const date = new Date(cell.date);
          const isEmpty = Number.isNaN(date.getTime()) || cell.date.startsWith("blank");
          return (
            <div
              key={cell.date}
              title={isEmpty ? "" : `${formatDate(cell.date)} | ${formatCurrency(cell.value)}`}
              className={`heat-cell flex aspect-square items-center justify-center rounded-xl border text-xs ${
                isEmpty ? "border-transparent bg-transparent" : "border-white/5 text-slate-100"
              }`}
              style={{
                backgroundColor: isEmpty ? "transparent" : getFinancialHeatColor(cell.value, variant)
              }}
            >
              {isEmpty ? "" : date.getDate()}
            </div>
          );
        })}
      </div>
    </div>
  );
}
