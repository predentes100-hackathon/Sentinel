import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Crown, Zap } from "lucide-react";

export function LevelUpBanner({ level, onClose }: { level: number; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0d141d]/80 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: 40 }}
          animate={{ y: 0 }}
          className="flex flex-col items-center gap-6 text-center"
        >
          <motion.div
            animate={{ rotate: [0, -10, 10, -10, 10, 0], scale: [1, 1.2, 1] }}
            transition={{ duration: 0.8 }}
            className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-[#D4AF37]/40 bg-[#D4AF37]/15"
          >
            <Crown className="h-12 w-12 text-[#D4AF37]" />
          </motion.div>

          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-[#D4AF37]">Sentinel Protocol</p>
            <h2 className="serif mt-3 text-6xl font-bold text-[#dce3f0]">Level {level}</h2>
            <p className="mt-3 text-xl text-[#d0c5af]">You have ascended, Operator.</p>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/8 px-6 py-3">
            <Zap className="h-4 w-4 text-[#D4AF37]" />
            <span className="text-sm text-[#D4AF37]">New powers unlocked</span>
          </div>

          <p className="text-xs text-[#99907c]">Click anywhere to continue</p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
