"use client";

import { ReactNode, useEffect, useRef } from "react";

/**
 * RUNAWAY — bungkus elemen biar LARI dari kursor SAAT chaos mode aktif.
 * Pas kursor masuk radius deteksi (140px), elemen melompat menjauh dari
 * kursor ke posisi random lain. After dodge daripdetik reset biar bisa dideketin lagi.
 * Saat chaos OFF: elemen normal (gak lari).
 */
export default function Runaway({
  children,
  className = "",
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const chaosActive = useRef(false);

  useEffect(() => {
    const sync = () => {
      chaosActive.current = document.documentElement.classList.contains("chaos-mode");
    };
    sync();
    const obs = new MutationObserver(sync);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!chaosActive.current) return;
      const el = ref.current;
      if (!el || el.classList.contains("fled")) return;
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dist = Math.hypot(e.clientX - cx, e.clientY - cy);
      if (dist < 140) {
        el.classList.add("fled");
        // dorong MENJAUH dari kursor: delta sederhana ±(60..120)px dari posisi
        // skrng arah dominan menjauhi kursor. Gak pake clamp viewport biar
        // pindahnya halus & gak "lompat" jauh.
        const dirX = (e.clientX - cx) || 1;
        const dirY = (e.clientY - cy) || 1;
        const len = Math.hypot(dirX, dirY) || 1;
        const mag = 60 + Math.random() * 60; // 60..120px
        let dx = (dirX / len) * mag;
        let dy = (dirY / len) * mag;
        // kadang lempar ngawur biar makin susah dideketin
        if (Math.random() > 0.65) {
          dx = (Math.random() - 0.5) * mag * 2;
          dy = (Math.random() - 0.5) * mag * 1.7;
        }
        el.style.transition = "transform 0.3s cubic-bezier(0.2, 0.9, 0.3, 1.3)";
        el.style.transform = `translate(${dx}px, ${dy}px)`;
        setTimeout(() => {
          el.classList.remove("fled");
          el.style.transform = "";
        }, 470);
      }
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div ref={ref} className={className} style={{ display: "inline-block", willChange: "transform", ...style }}>
      {children}
    </div>
  );
}