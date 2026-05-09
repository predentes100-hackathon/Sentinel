import { useEffect, useState } from "react";
import { Sparkles, X, Loader2 } from "lucide-react";

const GROQ_KEY = import.meta.env.VITE_GROQ_API_KEY;

function getTodayKey() {
  return `sentinel-daily-brief-${new Date().toISOString().slice(0, 10)}`;
}

async function fetchDailyBrief(profile: { age: string; profession: string; goals: string }): Promise<string> {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "morning" : hour < 17 ? "afternoon" : "evening";
  const day = new Date().toLocaleDateString("en-IN", { weekday: "long" });

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${GROQ_KEY}` },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [{
        role: "user",
        content: `Write a short, motivating ${greeting} brief (3-4 sentences max) for a ${profile.profession}, age ${profile.age}, focused on: ${profile.goals}. Today is ${day}. Be specific, personal, and energizing. No bullet points, just flowing prose.`
      }],
      temperature: 0.8,
      max_tokens: 200
    })
  });
  const data = await response.json();
  return (data as any)?.choices?.[0]?.message?.content ?? "Make today count, Operator.";
}

export function AIDailyBrief({ profile }: { profile: { age: string; profession: string; goals: string } }) {
  const [brief, setBrief] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!GROQ_KEY) return;
    const key = getTodayKey();
    const cached = localStorage.getItem(key);
    if (cached) { setBrief(cached); return; }

    setLoading(true);
    fetchDailyBrief(profile)
      .then((text) => { setBrief(text); localStorage.setItem(key, text); })
      .catch(() => setBrief("Stay focused and make disciplined progress today, Operator."))
      .finally(() => setLoading(false));
  }, []);

  if (dismissed || (!loading && !brief)) return null;

  return (
    <div className="relative mb-6 rounded-[8px] border border-[#D4AF37]/25 bg-gradient-to-r from-[#D4AF37]/8 via-[#192029] to-[#192029] p-5">
      <button
        onClick={() => setDismissed(true)}
        className="absolute right-3 top-3 text-[#99907c] hover:text-[#dce3f0]"
      >
        <X className="h-4 w-4" />
      </button>
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-[4px] bg-[#D4AF37]/15">
          {loading ? <Loader2 className="h-4 w-4 animate-spin text-[#D4AF37]" /> : <Sparkles className="h-4 w-4 text-[#D4AF37]" />}
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-[#D4AF37]">Sentinel AI · Daily Brief</p>
          <p className="mt-2 text-sm leading-6 text-[#d0c5af]">
            {loading ? "Generating your personalized brief..." : brief}
          </p>
        </div>
      </div>
    </div>
  );
}
