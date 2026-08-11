"use client";

import { useEffect, useRef, useState } from "react";

/**
 * GAUGE / SPEEDOMETER — jarum nunjuk porsi alokasi (maksimal 100%).
 * Jarum animate rotate dari kiri -> posisi target pas masuk viewport.
 * Dibikin "kasar" (gak sempurna): ngurang anti-glue, warna solid — biar
 * gak keliatan template AI.
 */
export default function Gauge({ pct }: { pct: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [angle, setAngle] = useState(-110); // mulai di kiri (0%)
  const targetPct = parseFloat(pct);
  const targetAngle = -110 + (targetPct / 100) * 220;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const dur = 1200;
            const start = performance.now();
            const tick = (now: number) => {
              const t = Math.min((now - start) / dur, 1);
              const eased = 1 - Math.pow(1 - t, 3); // ease-out
              setAngle(-110 + eased * (targetAngle + 110));
              if (t < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
            obs.unobserve(el);
          }
        });
      },
      { threshold: 0.5, rootMargin: "0px 0px -40px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [targetAngle]);

  // angka live berdasarkan sudut jarum
  const shown = Math.round(((angle + 110) / 220) * 100);

  return (
    <div ref={ref} className="relative h-[84px] w-[96px] shrink-0">
      {/* arc busur bawah (track + progress) */}
      <svg viewBox="0 0 100 62" className="h-full w-full">
        {/* track abu */}
        <path
          d="M 13 58 A 40 40 0 0 1 87 58"
          fill="none"
          stroke="rgba(255,255,255,0.09)"
          strokeWidth="7"
          strokeLinecap="round"
        />
        {/* busur progress emas */}
        <path
          d="M 13 58 A 40 40 0 0 1 87 58"
          fill="none"
          stroke="#be9d66"
          strokeWidth="7"
          strokeLinecap="round"
          style={{
            strokeDasharray: `${((angle + 110) / 220) * 100} 10000`,
            opacity: 0.9,
          }}
        />
        {/* tick kasar di sudut kiri & kanan bawah */}
        <circle cx="13" cy="58" r="1.6" fill="#e0c88a" opacity="0.5" />
        <circle cx="87" cy="58" r="1.6" fill="#e0c88a" opacity="0.5" />
      </svg>

      {/* jarum — diputar pakai transformOrigin di ujung bawah */}
      <div
        className="absolute bottom-[1px] left-0 right-0 mx-auto h-[30px] w-[30px]"
        style={{ transformOrigin: "50% 100%" }}
      >
        <svg
          viewBox="0 0 30 30"
          className="h-full w-full"
          style={{ transform: `rotate(${angle}deg)`, transformOrigin: "50% 100%" }}
        >
          <circle cx="15" cy="30" r="2.6" fill="#e0c88a" />
          <polygon points="15,30 13.6,5 16.4,5" fill="#fff" />
        </svg>
      </div>

      {/* angka di tengah gauge */}
      <div className="pointer-events-none absolute inset-0 flex items-end justify-center pb-2">
        <span className="font-serif text-sm font-semibold leading-none text-[#e0c88a]">
          {shown}
          <span className="text-[9px] text-white/40">%</span>
        </span>
      </div>
    </div>
  );
}
