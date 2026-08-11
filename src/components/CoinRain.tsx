"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface Ember {
  id: number;
  left: number;
  scale: number;
  drift: number;
  life: number;
}

/**
 * COIN RAIN — logo $CRA jatuh ngikutin scroll gesture.
 * Pakai image (bukan teks), hardware-accelerated transform.
 */
export default function CoinRain() {
  const [embers, setEmbers] = useState<Ember[]>([]);
  const lastSpawn = useRef(0);

  const spawn = useCallback((clientY: number, clientX: number) => {
    const now = Date.now();
    if (now - lastSpawn.current < 180) return; // max ~5.5/sec, smooth
    lastSpawn.current = now;

    const left = Math.max(2, Math.min(95, (clientX / window.innerWidth) * 100 + (Math.random() * 30 - 15)));
    const id = now + Math.random();
    const ember: Ember = {
      id,
      left,
      scale: 0.5 + Math.random() * 0.8,
      drift: (Math.random() - 0.5) * 50,
      life: 0,
    };
    setEmbers((prev) => [...prev.slice(-30), ember]);
    setTimeout(() => {
      setEmbers((prev) => prev.filter((e) => e.id !== id));
    }, 2200);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const sy = window.scrollY;
      spawn(
        sy + window.innerHeight * 0.15 + Math.random() * 50,
        window.innerWidth * 0.5 + (Math.random() - 0.5) * 400
      );
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [spawn]);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-40 overflow-hidden"
      aria-hidden
    >
      {embers.map((e) => (
        <div
          key={e.id}
          className="absolute"
          style={{
            left: `${e.left}%`,
            top: "-32px",
            animation: `coinFallImg 2.4s ease-in forwards`,
            ["--drift" as string]: `${e.drift}px`,
            willChange: "transform, opacity",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/cra-logo.png"
            alt=""
            width={28}
            height={28}
            style={{
              width: `${18 * e.scale}px`,
              height: `${18 * e.scale}px`,
              opacity: 0.75,
              filter: "drop-shadow(0 0 8px rgba(190,157,102,0.5))",
            }}
          />
        </div>
      ))}
    </div>
  );
}
