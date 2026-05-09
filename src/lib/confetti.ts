import confetti from "canvas-confetti";

export function triggerGoldBurst() {
  const duration = 2000;
  const end = Date.now() + duration;

  const frame = () => {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ["#D4AF37", "#f9e596", "#99907c"]
    });
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ["#D4AF37", "#f9e596", "#99907c"]
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  };

  frame();
}
