import { useState } from "react";
import { Plus, X, Flame } from "lucide-react";

const EMOJI_OPTIONS = ["🏃","📚","💧","🧘","🎯","💪","🌿","✍️","🎨","🎸","🍎","🛌","💻","🧠","🌅"];

export function AddHabitForm({ onAdd, onClose }: {
  onAdd: (title: string, emoji: string) => void;
  onClose: () => void;
}) {
  const [title, setTitle] = useState("");
  const [emoji, setEmoji] = useState("🎯");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd(title.trim(), emoji);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0d141d]/80 p-4 backdrop-blur-md">
      <div className="w-full max-w-md rounded-[8px] border border-[#D4AF37]/20 bg-[#192029] p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <h3 className="serif text-xl font-semibold text-[#dce3f0]">Create New Habit</h3>
          <button onClick={onClose} className="text-[#99907c] hover:text-[#dce3f0]">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-[#d0c5af]">Habit Name</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Morning Run, Journal, Cold Shower"
              className="mt-2 w-full rounded-[4px] border border-[#D4AF37]/15 bg-[#232a34] px-4 py-3 text-[#dce3f0] outline-none placeholder:text-[#99907c] focus:border-[#D4AF37]/50"
              autoFocus
              required
            />
          </div>

          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-[#d0c5af]">Choose Icon</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {EMOJI_OPTIONS.map((e) => (
                <button
                  key={e} type="button"
                  onClick={() => setEmoji(e)}
                  className={`rounded-[4px] border p-2 text-xl transition ${
                    emoji === e
                      ? "border-[#D4AF37]/50 bg-[#D4AF37]/15"
                      : "border-[#D4AF37]/10 bg-[#232a34] hover:border-[#D4AF37]/30"
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={!title.trim()}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-[4px] bg-[#D4AF37] px-4 py-3 font-bold text-[#0d141d] transition hover:bg-[#f2ca50] disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />
            Add Habit
          </button>
        </form>
      </div>
    </div>
  );
}
