import { useState } from "react";
import { Brain, ArrowRight, IndianRupee } from "lucide-react";

export function AIProfileForm({ onComplete }: { onComplete: (profile: { age: string; profession: string; goals: string; initialBalance: string }) => void }) {
  const [age, setAge] = useState("");
  const [profession, setProfession] = useState("");
  const [goals, setGoals] = useState("");
  const [initialBalance, setInitialBalance] = useState("");

  const inputClass = "w-full rounded-[4px] border border-[#D4AF37]/15 bg-[#232a34] px-4 py-4 text-[#dce3f0] outline-none transition placeholder:text-[#99907c] focus:border-[#D4AF37]/50 focus:ring-0";

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!age || !profession || !goals) return;
    onComplete({ age, profession, goals, initialBalance: initialBalance || "0" });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0d141d]/90 p-4 backdrop-blur-md">
      <div className="w-full max-w-lg rounded-[8px] border border-[#D4AF37]/20 bg-[#192029] p-6 shadow-[0_0_60px_rgba(212,175,55,0.06),_0_24px_80px_rgba(0,0,0,0.6)] sm:p-8">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[4px] bg-[#D4AF37]/10 text-[#D4AF37]">
            <Brain className="h-6 w-6" />
          </div>
          <div>
            <h2 className="serif text-2xl font-semibold text-[#dce3f0]">Initialize AI Core</h2>
            <p className="mt-1 text-sm text-[#99907c]">Calibrate your copilot</p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-[0.2em] text-[#d0c5af]">Age</label>
            <input 
              type="number" 
              value={age} 
              onChange={(e) => setAge(e.target.value)} 
              placeholder="e.g. 25" 
              className={inputClass}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs uppercase tracking-[0.2em] text-[#d0c5af]">Profession</label>
            <input 
              type="text" 
              value={profession} 
              onChange={(e) => setProfession(e.target.value)} 
              placeholder="e.g. Software Engineer, Student" 
              className={inputClass}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs uppercase tracking-[0.2em] text-[#d0c5af]">Primary Focus Areas</label>
            <textarea 
              rows={3}
              value={goals} 
              onChange={(e) => setGoals(e.target.value)} 
              placeholder="e.g. Save money for travel, learn cloud architecture, improve fitness" 
              className={inputClass}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs uppercase tracking-[0.2em] text-[#d0c5af]">Initial Balance (₹)</label>
            <div className="relative">
              <IndianRupee className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#D4AF37]" />
              <input 
                type="number" 
                min="0"
                value={initialBalance} 
                onChange={(e) => setInitialBalance(e.target.value)} 
                placeholder="e.g. 25000" 
                className="w-full rounded-[4px] border border-[#D4AF37]/15 bg-[#232a34] py-4 pl-10 pr-4 text-[#dce3f0] outline-none transition placeholder:text-[#99907c] focus:border-[#D4AF37]/50 focus:ring-0"
              />
            </div>
            <p className="text-xs text-[#99907c]">Your current savings or account balance. Leave blank to start at ₹0.</p>
          </div>

          <button
            type="submit"
            disabled={!age || !profession || !goals}
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-[4px] bg-[#D4AF37] px-5 py-3 text-sm font-bold text-[#0d141d] transition hover:bg-[#f2ca50] disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            Engage AI Copilot
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
