"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Reveal from "@/components/Reveal";
import Runaway from "@/components/Runaway";

interface ChaosCoin {
  id: number;
  left: number;
  scale: number;
  drift: number;
}

/**
 * CHAOS MODE v3 — Gahar.
 * ON: hujan logo CRA DERAS otomatis (ga perlu scroll)
 *   + layout acak (shake, tilt, glitch semua card)
 * OFF: CALM, balik normal.
 */
export default function ChaosControls() {
  const [on, setOn] = useState(false);
  const [coins, setCoins] = useState<ChaosCoin[]>([]);
  const spawnTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const chaosInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  // Toggle chaos CSS class + layout madness
  useEffect(() => {
    document.documentElement.classList.toggle("chaos-mode", on);
  }, [on]);

  // Chaos layout: card goyang tidak berurutan + logo About muter kenceng
  useEffect(() => {
    if (on) {
      const cardSelectors = [
        ".card-lift", ".chaos-wander", ".buy-card",
        "[class*='rounded-2xl']", "[class*='rounded-xl']",
        "section[id] > div > div",
        ".buy-card > div", ".buy-card a",
      ];
      const cards = () => cardSelectors.flatMap(s => Array.from(document.querySelectorAll<HTMLElement>(s)));

      // Goyang acak tiap card dengan timing berbeda
      chaosInterval.current = setInterval(() => {
        const els = cards();
        els.forEach((el, i) => {
          const rx = (Math.random() - 0.5) * 24;
          const ry = (Math.random() - 0.5) * 24;
          const rz = (Math.random() - 0.5) * 15;
          const delay = Math.random() * 300; // tiap card start acak
          el.style.transition = `transform 0.35s cubic-bezier(0.18, 0.89, 0.32, 1.28) ${delay}ms`;
          el.style.transform = `translate(${rx}px, ${ry}px) rotate(${rz}deg)`;
        });
      }, 400);

      // Logo About muter kenceng
      const aboutLogo = document.querySelector<HTMLElement>(".about-logo-rotate");
      if (aboutLogo) {
        aboutLogo.style.animation = "aboutSpinFast 0.6s linear infinite";
      }
    } else {
      if (chaosInterval.current) {
        clearInterval(chaosInterval.current);
        chaosInterval.current = null;
      }
      // Reset all cards
      document.querySelectorAll<HTMLElement>(
        ".card-lift, .chaos-wander, .buy-card, [class*='rounded-2xl'], [class*='rounded-xl'], section[id] > div > div, .buy-card > div, .buy-card a"
      ).forEach((el) => {
        el.style.transition = "";
        el.style.transform = "";
      });
      // Reset logo spin
      const aboutLogo = document.querySelector<HTMLElement>(".about-logo-rotate");
      if (aboutLogo) {
        aboutLogo.style.animation = "";
      }
    }
    return () => {
      if (chaosInterval.current) clearInterval(chaosInterval.current);
    };
  }, [on]);

  // Hujan logo CRA — auto deras, ga perlu scroll
  useEffect(() => {
    if (on) {
      spawnTimer.current = setInterval(() => {
        const left = Math.random() * 96 + 2;
        const id = Date.now() + Math.random();
        const coin: ChaosCoin = {
          id,
          left,
          scale: 0.4 + Math.random() * 1.1,
          drift: (Math.random() - 0.5) * 100,
        };
        setCoins((prev) => [...prev.slice(-60), coin]);
        setTimeout(() => {
          setCoins((prev) => prev.filter((c) => c.id !== id));
        }, 2800);
      }, 80); // ~12.5 coin/detik — BANJIR
    } else {
      if (spawnTimer.current) {
        clearInterval(spawnTimer.current);
        spawnTimer.current = null;
      }
      setCoins([]);
    }
    return () => {
      if (spawnTimer.current) clearInterval(spawnTimer.current);
    };
  }, [on]);

  const level = on ? 99 : 8;
  const label = on ? "FULL CHAOS" : "CALM";
  const color = on ? "#ff5255" : "#34d399";

  return (
    <>
      <section className="mx-auto mt-[140px] flex w-full max-w-[900px] justify-center px-6">
        <Reveal className="flex w-full justify-center">
          <div className="flex items-center justify-center gap-5 rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-5">
            <div className="flex items-center gap-3">
              <span
                className="font-serif text-lg font-semibold"
                style={{ color: on ? "#ff7a7e" : "#34d399" }}
              >
                {label}
              </span>
              <div className="h-1.5 w-20 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${level}%`,
                    background: `linear-gradient(90deg, ${on ? "#ff7a5f" : "#1d8f5a"}, ${color})`,
                    boxShadow: `0 0 10px ${color}`,
                  }}
                />
              </div>
            </div>

            <Runaway>
              <button
                type="button"
                onClick={() => setOn((v) => !v)}
                aria-pressed={on}
                aria-label="Toggle chaos mode"
                className={`group relative h-[30px] w-[56px] shrink-0 cursor-pointer rounded-full border transition-all duration-300 ${
                  on
                    ? "chaos-btn-on border-[#ff5255]/60 bg-[#ff5255]/25"
                    : "border-white/15 bg-white/5"
                }`}
              >
                <span
                  className={`absolute top-1/2 h-[22px] w-[22px] -translate-y-1/2 rounded-full shadow-md transition-all duration-300 ${
                    on ? "right-[3px] bg-[#ff5255]" : "left-[3px] bg-[#9aa3b2]"
                  }`}
                />
              </button>
            </Runaway>
          </div>
        </Reveal>
      </section>

      {/* HUJAN LOGO CRA — DERAS, auto, no scroll needed */}
      {on && (
        <div
          className="pointer-events-none fixed inset-0 z-50 overflow-hidden"
          aria-hidden
        >
          {coins.map((c) => (
            <div
              key={c.id}
              className="absolute"
              style={{
                left: `${c.left}%`,
                top: "-40px",
                animation: "chaosCoinDrop 2.8s ease-in forwards",
                ["--drift" as string]: `${c.drift}px`,
                willChange: "transform, opacity",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/cra-logo.png"
                alt=""
                style={{
                  width: `${20 * c.scale}px`,
                  height: `${20 * c.scale}px`,
                  opacity: 0.8,
                  filter: "drop-shadow(0 0 12px rgba(255,82,85,0.7))",
                }}
              />
            </div>
          ))}
        </div>
      )}
    </>
  );
}
