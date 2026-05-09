import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, X } from "lucide-react";

const STEPS = [
  {
    target: "body",
    title: "Welcome to Sentinel",
    body: "This is your personal Life Operating System. Let's take a 30-second tour to get you oriented.",
    position: "center" as const,
  },
  {
    target: "[aria-label='Toggle sidebar']",
    title: "Navigation Sidebar",
    body: "On mobile, tap the hamburger icon to open the sidebar. Navigate between Command Center, Wealth Ledger, and Analytics Hub.",
    position: "right" as const,
  },
  {
    target: "[aria-label='Open Action Forge']",
    title: "Action Forge",
    body: "Click the gold button at the bottom-right (or press C) to create tasks, log transactions, and get AI-generated suggestions.",
    position: "top" as const,
  },
  {
    target: ".habit-section",
    title: "Habit Tracker",
    body: "Tap habit cards to complete them and earn XP. Click 'Add Habit' to create your own custom daily routines.",
    position: "center" as const,
  },
  {
    target: "body",
    title: "You're all set!",
    body: "Complete tasks to earn XP and level up. Track your spending in Wealth Ledger. View trends in Analytics Hub. Let's go!",
    position: "center" as const,
  },
];

const STORAGE_KEY = "sentinel-onboarding-done";

export function OnboardingTutorial() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(() => localStorage.getItem(STORAGE_KEY) === "true");

  if (done) return null;

  function finish() {
    localStorage.setItem(STORAGE_KEY, "true");
    setDone(true);
  }

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  return (
    <AnimatePresence>
      <motion.div
        key="onboarding-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[90] flex items-center justify-center bg-[#0d141d]/75 backdrop-blur-sm p-4"
        onClick={finish}
      >
        <motion.div
          key={step}
          initial={{ scale: 0.92, opacity: 0, y: 16 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: -16 }}
          transition={{ duration: 0.25 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md rounded-[8px] border border-[#D4AF37]/25 bg-[#192029] p-6 shadow-[0_0_60px_rgba(212,175,55,0.1),_0_24px_80px_rgba(0,0,0,0.6)]"
        >
          {/* Progress dots */}
          <div className="mb-5 flex items-center gap-1.5">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === step ? "w-6 bg-[#D4AF37]" : i < step ? "w-3 bg-[#D4AF37]/50" : "w-3 bg-[#232a34]"
                }`}
              />
            ))}
            <button onClick={finish} className="ml-auto text-[#99907c] hover:text-[#dce3f0]">
              <X className="h-4 w-4" />
            </button>
          </div>

          <h3 className="serif text-xl font-semibold text-[#dce3f0]">{current.title}</h3>
          <p className="mt-3 text-sm leading-6 text-[#d0c5af]">{current.body}</p>

          <div className="mt-6 flex items-center justify-between">
            <span className="text-xs text-[#99907c]">
              {step + 1} of {STEPS.length}
            </span>
            <button
              onClick={() => (isLast ? finish() : setStep((s) => s + 1))}
              className="inline-flex items-center gap-2 rounded-[4px] bg-[#D4AF37] px-5 py-2.5 text-sm font-bold text-[#0d141d] transition hover:bg-[#f2ca50]"
            >
              {isLast ? "Let's go!" : "Next"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
