import { AlertTriangle, ShieldCheck } from "lucide-react";

export function DisclaimerView({ onAccept }: { onAccept: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0d141d]/90 p-4 backdrop-blur-md">
      <div className="w-full max-w-lg rounded-[8px] border border-[#D4AF37]/20 bg-[#192029] p-6 shadow-[0_0_60px_rgba(212,175,55,0.06),_0_24px_80px_rgba(0,0,0,0.6)] sm:p-8">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[4px] bg-[#D4AF37]/10 text-[#D4AF37]">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div>
            <h2 className="serif text-2xl font-semibold text-[#dce3f0]">XP Decay Warning</h2>
            <p className="mt-1 text-sm text-[#99907c]">Sentinel Operating Protocol</p>
          </div>
        </div>
        
        <div className="mt-6 space-y-4 text-sm text-[#d0c5af]">
          <p>
            You are entering the active Sentinel workspace. Momentum is not free; it is earned daily.
          </p>
          <div className="rounded-[4px] border border-[#D4AF37]/15 bg-[#232a34] p-4">
            <h4 className="font-semibold text-[#D4AF37]">The Decay Protocol:</h4>
            <ul className="mt-2 ml-5 list-disc space-y-2 text-[#99907c]">
              <li>If you fail to execute your daily habits, your active streak will be reset.</li>
              <li>Inactivity triggers <strong className="text-[#dce3f0]">XP Decay</strong>, draining your total XP pool over time.</li>
              <li>Consistency multipliers reward daily engagement and penalize extended absence.</li>
            </ul>
          </div>
          <p>
            Do not forge actions or set daily rituals that you are not prepared to execute. Stay disciplined.
          </p>
        </div>

        <button
          type="button"
          onClick={onAccept}
          className="mt-8 flex w-full items-center justify-center gap-2 rounded-[4px] bg-[#D4AF37] px-5 py-3 text-sm font-bold text-[#0d141d] transition hover:bg-[#f2ca50] focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          <ShieldCheck className="h-5 w-5" />
          I understand, let me in
        </button>
      </div>
    </div>
  );
}
