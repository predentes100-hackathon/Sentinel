import type { AIProfileState, Priority } from "../types";

// Groq API — completely free tier, 14,400 requests/day, ultra fast (Llama 3.3)
const groqKey = import.meta.env.VITE_GROQ_API_KEY;

export type AISuggestion = {
  title: string;
  description: string;
  priority: Priority;
};

export async function generateActionSuggestions(profile: AIProfileState): Promise<AISuggestion[]> {
  if (!groqKey) {
    throw new Error("Groq API key not configured.");
  }

  const systemPrompt = `You are Sentinel AI, an elite personal operating system assistant. 
You generate highly specific, actionable task suggestions tailored to the user's life situation.
You ALWAYS respond with a valid JSON array only — no markdown, no explanation, just raw JSON.`;

  const userPrompt = `Generate exactly 3 personalized task suggestions for this person:
- Age: ${profile.age}
- Profession: ${profile.profession}  
- Goals: ${profile.goals}

Respond with ONLY a JSON array of 3 objects. Each object must have:
- "title": string (max 8 words, action-oriented)
- "description": string (1-2 sentences on why to do this today)
- "priority": exactly one of "Low", "Medium", "High", "Deep Work"

Example:
[
  {"title":"Block 2h for deep coding session","description":"Uninterrupted focus blocks are proven to 3x output for engineers.","priority":"Deep Work"},
  {"title":"Review monthly budget breakdown","description":"Weekly finance reviews prevent overspending before it compounds.","priority":"Medium"},
  {"title":"Do 20-minute evening walk","description":"Daily movement reduces stress and improves sleep quality.","priority":"Low"}
]`;

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${groqKey}`
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 1024,
      response_format: { type: "json_object" }
    })
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    const msg = (err as any)?.error?.message || `Groq API error ${response.status}`;
    throw new Error(msg);
  }

  const data = await response.json();
  const rawText: string = (data as any)?.choices?.[0]?.message?.content ?? "";

  // Extract the JSON array robustly
  const arrayMatch = rawText.match(/\[[\s\S]*\]/);
  const objectMatch = rawText.match(/\{[\s\S]*\}/);

  const jsonText = arrayMatch?.[0] ?? (objectMatch ? `[${objectMatch[0]}]` : "[]");

  try {
    const parsed = JSON.parse(jsonText);
    // Handle both array response and {suggestions: [...]} wrapper
    const suggestions: AISuggestion[] = Array.isArray(parsed)
      ? parsed
      : parsed.suggestions ?? parsed.tasks ?? Object.values(parsed)[0];

    if (!Array.isArray(suggestions) || suggestions.length === 0) {
      throw new Error("No suggestions found in response");
    }

    return suggestions.slice(0, 3);
  } catch {
    throw new Error("AI returned an unexpected format. Please try again.");
  }
}

export type ParsedTask = {
  title: string;
  description: string;
  priority: Priority;
  amount?: string;
  transactionType?: "Spend" | "Earn";
  dueLabel?: string;
};

export async function parseNaturalLanguageTask(input: string): Promise<ParsedTask> {
  if (!groqKey) throw new Error("Groq API key not configured.");

  const today = new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${groqKey}` },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `You parse natural language into structured task data. Today is ${today}. Respond ONLY with a single JSON object.`
        },
        {
          role: "user",
          content: `Parse this into a task: "${input}"

Return a JSON object with:
- "title": concise task title
- "description": brief expansion of what the task involves
- "priority": one of "Low", "Medium", "High", "Deep Work"
- "dueLabel": due date label if mentioned (e.g. "Tomorrow", "Friday", "May 15") or ""
- "amount": numeric string if money mentioned (e.g. "500") or ""
- "transactionType": "Spend" or "Earn" if money involved, else ""

Example for "Buy groceries ₹800 tomorrow":
{"title":"Buy groceries","description":"Pick up weekly grocery supplies.","priority":"Medium","dueLabel":"Tomorrow","amount":"800","transactionType":"Spend"}`
        }
      ],
      temperature: 0.3,
      max_tokens: 512,
      response_format: { type: "json_object" }
    })
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error((err as any)?.error?.message || `Groq API error ${response.status}`);
  }

  const data = await response.json();
  const rawText: string = (data as any)?.choices?.[0]?.message?.content ?? "";
  return JSON.parse(rawText) as ParsedTask;
}
