"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const NAV = [
  { label: "BUY", href: "#buy" },
  { label: "ABOUT", href: "#about" },
  { label: "TOKENOMICS", href: "#tokenomics" },
  { label: "ROADMAP", href: "#roadmap" },
];

const PHASES = [
  {
    title: "PHASE 1",
    items: [
      "Website and social",
      "Build community",
      "Launch $CHAD token",
      "Be a Chad, get bags swole",
    ],
  },
  {
    title: "PHASE 2",
    items: [
      "Expansion ARC",
      "Contract audit",
      "Partnerships and contests",
      "Over 1000 holders",
    ],
  },
  {
    title: "PHASE 3",
    items: [
      "CEX listings",
      "Over 50,000 holders",
      "Chad merch and tools",
      "More Chad gains",
    ],
  },
];

export default function Home() {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    // Reveal on scroll
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -30px 0px" }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-[#121212] text-white font-[family-name:var(--font-vt323)]">
      {/* ===== NAV ===== */}
      <nav className="fixed top-0 w-full z-50 bg-[#121212] pixel-border-sm border-t-0 border-l-0 border-r-0">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2">
            <Image
              src="/images/chad-logo-nav.png"
              alt="CHAD"
              width={40}
              height={40}
              className="w-10 h-10 rounded-none"
              unoptimized
            />
            <span className="font-[family-name:var(--font-press-start)] text-xs text-[#1973c8]">
              CHAD
            </span>
          </a>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {NAV.map((n) => (
              <a
                key={n.label}
                href={n.href}
                className="font-[family-name:var(--font-press-start)] text-[10px] text-white hover:text-[#1973c8] transition-colors"
              >
                {n.label}
              </a>
            ))}
            <a
              href="/flip"
              className="font-[family-name:var(--font-press-start)] text-[10px] text-white hover:text-[#1973c8] transition-colors"
            >
              FLIP
            </a>
            <span className="font-[family-name:var(--font-press-start)] text-[10px] text-white/40">
              BINARY <span className="text-[8px]">(COMING SOON)</span>
            </span>
            <button className="pixel-btn px-4 py-1.5 font-[family-name:var(--font-press-start)] text-[10px] text-white bg-[#1973c8] text-black">
              CONNECT
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden font-[family-name:var(--font-press-start)] text-xl text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? "X" : "="}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden bg-[#121212] border-t-2 border-white px-4 py-4 flex flex-col gap-3">
            {NAV.map((n) => (
              <a
                key={n.label}
                href={n.href}
                className="font-[family-name:var(--font-press-start)] text-[10px] text-white"
                onClick={() => setMobileOpen(false)}
              >
                {n.label}
              </a>
            ))}
            <a
              href="/flip"
              className="font-[family-name:var(--font-press-start)] text-[10px] text-white w-fit"
            >
              FLIP
            </a>
            <button className="pixel-btn px-4 py-2 font-[family-name:var(--font-press-start)] text-[10px] bg-[#1973c8] text-black w-fit">
              CONNECT
            </button>
          </div>
        )}
      </nav>

      {/* ===== HERO ===== */}
      <section
        id="buy"
        className="relative min-h-screen flex flex-col items-center justify-center pt-20 px-4 text-center"
      >
        {/* BG glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#1973c8] rounded-full blur-[120px] opacity-10" />
        </div>

        <h1 className="font-[family-name:var(--font-press-start)] text-4xl md:text-7xl text-[#1973c8] text-glow pixel-float mb-6">
          YES CHAD
        </h1>

        <p className="text-xl md:text-2xl text-white/80 max-w-xl mb-10">
          Professional CHAD on ARC
        </p>

        {/* Chad image */}
        <div className="mb-10">
          <Image
            src="/images/chad-logo-new.png"
            alt="Chad"
            width={280}
            height={300}
            className="pixel-float"
            unoptimized
          />
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-12">
          <button className="pixel-btn px-8 py-3 font-[family-name:var(--font-press-start)] text-[11px] bg-[#1973c8] text-white flex items-center gap-2">
            <Image
              src="/images/chad-logo-new.png"
              alt=""
              width={24}
              height={24}
              className="w-6 h-6"
              unoptimized
            />
            ADD $CHAD TO WALLET
          </button>
          <button
            type="button"
            className="pixel-btn px-8 py-3 font-[family-name:var(--font-press-start)] text-[11px] bg-white text-black text-center cursor-not-allowed"
          >
            BUY CHAD TOKEN
          </button>
        </div>

        {/* Yes balloon */}
        <Image
          src="/images/px/yeschatballoon.png"
          alt="Yes."
          width={200}
          height={100}
          className="opacity-80"
          unoptimized
        />
      </section>

      {/* ===== ABOUT ===== */}
      <section id="about" className="py-24 px-4">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="reveal">
            <Image
              src="/images/chad-logo-new.png"
              alt="Chad"
              width={300}
              height={320}
              className="mx-auto"
              unoptimized
            />
          </div>
          <div className="reveal">
            <h2 className="font-[family-name:var(--font-press-start)] text-2xl md:text-3xl text-[#1973c8] mb-6">
              ABOUT CHAD
            </h2>
            <p className="text-xl leading-relaxed text-white/80">
              Scientists spent years trying to understand CHAD.
              They studied the beard.
              They studied the hair.
              They studied the chart.
              Eventually, they discovered something terrifying:
              CHAD does not understand the chart either.
              He simply stares at it until it goes up.
            </p>
            <p className="text-lg text-[#1973c8] mt-4 font-[family-name:var(--font-press-start)]">
              The first scientifically unverified financial organism on ARC.
            </p>
          </div>
        </div>
      </section>

      {/* ===== TOKENOMICS ===== */}
      <section id="tokenomics" className="py-24 px-4 bg-[#0d0d1a]">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="reveal">
            <h2 className="font-[family-name:var(--font-press-start)] text-2xl md:text-3xl text-[#1973c8] mb-6">
              TOKENOMICS
            </h2>
            <div className="space-y-3 text-xl leading-relaxed text-white/80">
              <p><span className="text-[#1973c8] font-[family-name:var(--font-press-start)] text-sm">80%</span> — Liquidity<br /><span className="text-white/60 text-lg">Because CHAD needs somewhere to exist.</span></p>
              <p><span className="text-[#1973c8] font-[family-name:var(--font-press-start)] text-sm">10%</span> — Beard<br /><span className="text-white/60 text-lg">Scientifically classified as a critical infrastructure.</span></p>
              <p><span className="text-[#1973c8] font-[family-name:var(--font-press-start)] text-sm">5%</span> — Science<br /><span className="text-white/60 text-lg">Scientists are still trying to understand CHAD.</span></p>
              <p><span className="text-[#1973c8] font-[family-name:var(--font-press-start)] text-sm">3%</span> — Noise<br /><span className="text-white/60 text-lg">GM. WAGMI. CHAD. Repeat.</span></p>
              <p><span className="text-[#1973c8] font-[family-name:var(--font-press-start)] text-sm">2%</span> — ???<br /><span className="text-white/60 text-lg">Nobody knows. Not even CHAD.</span></p>
            </div>
            <p className="mt-4 text-[#1973c8] font-[family-name:var(--font-press-start)] text-xs">
              80% + 10% + 5% + 3% + 2% = 100% CHAD
            </p>
            <p className="text-white/40 text-sm italic mt-2">
              Scientifically unverified. Mathematically questionable. Extremely Chad.
            </p>
          </div>
          <div className="reveal flex justify-center">
            <div className="pixel-border w-64 h-64 flex items-center justify-center bg-[#1a1a2e]">
              <Image
                src="/images/chad-logo-new.png"
                alt="CHAD"
                width={180}
                height={180}
                unoptimized
              />
            </div>
          </div>
        </div>
      </section>

      {/* ===== ROADMAP ===== */}
      <section id="roadmap" className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-[family-name:var(--font-press-start)] text-2xl md:text-3xl text-[#1973c8] text-center mb-16 reveal">
            ROADMAP
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {PHASES.map((phase) => (
              <div key={phase.title} className="pixel-card p-6 reveal">
                <h3 className="font-[family-name:var(--font-press-start)] text-sm text-[#1973c8] mb-5">
                  {phase.title}
                </h3>
                <ul className="space-y-3">
                  {phase.items.map((item, j) => (
                    <li key={j} className="text-lg flex gap-2">
                      <span className="text-[#1973c8]">{">"}</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="py-16 px-4 bg-[#0d0d1a] border-t-4 border-white">
        <div className="max-w-5xl mx-auto text-center">
          {/* Social buttons */}
          <div className="flex justify-center gap-4 mb-8">
            <a
              href="https://x.com/thiss_chad"
              target="_blank"
              rel="noopener noreferrer"
              className="pixel-btn inline-block px-6 py-2 font-[family-name:var(--font-press-start)] text-[10px] bg-[#1973c8] text-white"
            >
              X (TWITTER)
            </a>
          </div>

          <p className="text-white/50 text-sm mb-4 max-w-lg mx-auto leading-relaxed">
            $CHAD is a meme coin with no intrinsic value or expectation of
            financial return. There is no formal team or roadmap. The coin is
            completely useless and for entertainment purposes only.
          </p>

          <p className="font-[family-name:var(--font-press-start)] text-[10px] text-white/40">
            POWERED BY ARC
          </p>
        </div>
      </footer>
    </div>
  );
}
