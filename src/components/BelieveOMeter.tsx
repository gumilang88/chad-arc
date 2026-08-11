"use client";

import { useState } from "react";

const ROASTS: Record<string, string[]> = {
  "0-10": [
    "7%? Honest. I respect that.",
    "3%... you've been hurt before, haven't you?",
    "5% — that's more belief than the dev has in himself.",
    "1%? Even the rug pullers believe harder.",
  ],
  "11-30": [
    "22% — cautiously optimistic. We'll take it.",
    "15% — you've seen too many charts. It's okay.",
    "28% — exactly how much sleep the dev gets.",
  ],
  "31-60": [
    "44% — you're starting to believe. Don't fight it.",
    "51% — perfectly balanced. Like a portfolio that's 51% down.",
    "38% — higher than our market cap recovery rate.",
  ],
  "61-90": [
    "73% — okay, now you're just gambling.",
    "88% — someone's been reading the bullish copypastas.",
    "69% — nice.",
  ],
  "91-100": [
    "97% — you're either the dev or delusional. Either way, welcome.",
    "100% — FULL SEND. Your family is concerned.",
    "102%? That's too much. You're lying.",
  ],
};

function getRoast(value: number): string {
  if (value <= 10) {
    const arr = ROASTS["0-10"];
    return arr[value % arr.length];
  } else if (value <= 30) {
    const arr = ROASTS["11-30"];
    return arr[value % arr.length];
  } else if (value <= 60) {
    const arr = ROASTS["31-60"];
    return arr[value % arr.length];
  } else if (value <= 90) {
    const arr = ROASTS["61-90"];
    return arr[Math.floor(value / 3) % arr.length];
  } else {
    const arr = ROASTS["91-100"];
    return arr[value % arr.length];
  }
}

export default function BelieveOMeter() {
  const [value, setValue] = useState(7);
  const [roast, setRoast] = useState(getRoast(7));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseInt(e.target.value, 10);
    setValue(v);
    setRoast(getRoast(v));
  };

  const getBarColor = () => {
    if (value <= 20) return "#ff6274";
    if (value <= 50) return "#f0b352";
    if (value <= 80) return "#3fd693";
    return "#4d7cff";
  };

  return (
    <div className="mx-auto mt-[100px] w-full max-w-[600px] px-6">
      <div className="reveal">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-7 backdrop-blur-sm">
          <h3 className="mb-1 text-center font-serif text-[32px] leading-tight text-white">
            Believe-O-Meter
          </h3>
          <p className="mb-6 text-center font-mono text-[11px] uppercase tracking-wider text-white/30">
            How much do YOU believe in CRA?
          </p>

          {/* Bar visual */}
          <div className="mb-2 h-4 w-full overflow-hidden rounded-full bg-white/5">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${value}%`,
                backgroundColor: getBarColor(),
                boxShadow: `0 0 14px ${getBarColor()}44`,
              }}
            />
          </div>

          {/* Slider */}
          <div className="mb-5">
            <input
              type="range"
              min={0}
              max={100}
              value={value}
              onChange={handleChange}
              className="w-full cursor-pointer accent-[#be9d66]"
              style={{ height: "6px" }}
            />
            <div className="mt-1 flex justify-between font-mono text-[10px] text-white/20">
              <span>0%</span>
              <span className="font-serif text-2xl font-bold text-white">{value}%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Roast text */}
          <div className="rounded-xl border border-white/5 bg-black/25 px-4 py-3 text-center">
            <p className="font-serif text-base italic leading-relaxed text-white/60">
              &ldquo;{roast}&rdquo;
            </p>
            <p className="mt-1 font-mono text-[9px] uppercase tracking-widest text-white/15">
              — Believe-O-Meter AI
            </p>
          </div>

          {/* Absolute chaos */}
          {value === 100 && (
            <div className="mt-4 animate-bounce text-center font-mono text-xs text-[#be9d66]">
              🚨 ACHIEVEMENT UNLOCKED: DEGEN SUPREME 🚨
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
