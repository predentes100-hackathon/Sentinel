import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const POMODORO_MINUTES = 25;
const BREAK_MINUTES = 5;

export function PomodoroTimer({ taskTitle }: { taskTitle?: string }) {
  const [secondsLeft, setSecondsLeft] = useState(POMODORO_MINUTES * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [sessions, setSessions] = useState(0);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = window.setInterval(() => {
        setSecondsLeft((s) => {
          if (s <= 1) {
            clearInterval(intervalRef.current!);
            setIsRunning(false);
            if (!isBreak) {
              setSessions((prev) => prev + 1);
              setIsBreak(true);
              return BREAK_MINUTES * 60;
            } else {
              setIsBreak(false);
              return POMODORO_MINUTES * 60;
            }
          }
          return s - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current!);
    }
    return () => clearInterval(intervalRef.current!);
  }, [isRunning, isBreak]);

  function reset() {
    setIsRunning(false);
    setIsBreak(false);
    setSecondsLeft(POMODORO_MINUTES * 60);
    clearInterval(intervalRef.current!);
  }

  const totalSeconds = isBreak ? BREAK_MINUTES * 60 : POMODORO_MINUTES * 60;
  const progress = ((totalSeconds - secondsLeft) / totalSeconds) * 100;
  const mins = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const secs = String(secondsLeft % 60).padStart(2, "0");
  const circumference = 2 * Math.PI * 42;

  return (
    <div className="rounded-[8px] border border-[#D4AF37]/15 bg-[#192029] p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-[#99907c]">
            {isBreak ? "Break Time" : "Focus Timer"}
          </p>
          {taskTitle && (
            <p className="mt-1 truncate text-sm font-medium text-[#dce3f0]">{taskTitle}</p>
          )}
        </div>
        <div className="flex items-center gap-1">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className={`h-2 w-2 rounded-full ${i < sessions % 4 ? "bg-[#D4AF37]" : "bg-[#232a34]"}`}
            />
          ))}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-center">
        <div className="relative h-28 w-28">
          <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="42" fill="none" stroke="#232a34" strokeWidth="6" />
            <circle
              cx="50" cy="50" r="42" fill="none"
              stroke={isBreak ? "#4ade80" : "#D4AF37"}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference - (progress / 100) * circumference}
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-mono text-2xl font-bold text-[#dce3f0]">{mins}:{secs}</span>
            <span className={`text-[10px] uppercase tracking-widest ${isBreak ? "text-green-400" : "text-[#D4AF37]"}`}>
              {isBreak ? "break" : "focus"}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-center gap-3">
        <button
          onClick={reset}
          className="rounded-[4px] border border-[#D4AF37]/15 bg-[#232a34] p-2 text-[#99907c] transition hover:text-[#dce3f0]"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
        <button
          onClick={() => setIsRunning((r) => !r)}
          className={`inline-flex items-center gap-2 rounded-[4px] px-5 py-2 text-sm font-bold transition ${
            isRunning
              ? "border border-[#D4AF37]/30 bg-[#D4AF37]/10 text-[#D4AF37]"
              : "bg-[#D4AF37] text-[#0d141d] hover:bg-[#f2ca50]"
          }`}
        >
          {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          {isRunning ? "Pause" : "Start"}
        </button>
        {sessions > 0 && (
          <div className="flex items-center gap-1 rounded-[4px] bg-[#D4AF37]/10 px-3 py-2 text-xs text-[#D4AF37]">
            <Check className="h-3 w-3" />
            {sessions} done
          </div>
        )}
      </div>
    </div>
  );
}
