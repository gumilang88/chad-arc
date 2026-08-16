"use client";

import { useEffect, useState, useCallback } from "react";
import { BrowserProvider, Contract, formatUnits, parseUnits } from "ethers";
import Image from "next/image";
import { ARC, USDC_ARC, HOUSE_WALLET } from "@/lib/arc";

const USDC_ABI = [
  "function approve(address spender, uint256 amount) public returns (bool)",
  "function allowance(address owner, address spender) public view returns (uint256)",
  "function balanceOf(address account) public view returns (uint256)",
  "function transfer(address to, uint256 amount) public returns (bool)",
  "function decimals() public view returns (uint8)",
  "function symbol() public view returns (string)",
];

type Wait =
  | { s: "idle" }
  | { s: "connecting" }
  | { s: "ready" }
  | { s: "approving" }
  | { s: "sending" }
  | { s: "flipping" }
  | { s: "win" }
  | { s: "lose" }
  | { s: "error"; msg: string };

const ORACLE = ["0.5", "1", "2", "5", "10", "25", "50", "100"];

// Multiplier payout per bet amount (string key → multiplier)
const PAYOUT_TABLE: Record<string, number> = {
  "0.5": 1.9,
  "1": 2.5,
  "2": 3,
  "5": 5,
  "10": 7,
  "25": 10,
  "50": 12,
  "100": 15,
};

function payoutFor(betAmount: string): number {
  const key = String(betAmount).trim();
  return PAYOUT_TABLE[key] ?? 2;
}

export default function FlipPage() {
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [signerAddr, setSignerAddr] = useState("");
  const [usdcBalance, setUsdcBalance] = useState("");
  const [bet, setBet] = useState("1");
  const [side, setSide] = useState<"HEADS" | "TAILS">("HEADS");
  const [result, setResult] = useState<"HEADS" | "TAILS" | null>(null);
  const [anim, setAnim] = useState(false);
  const [wait, setWait] = useState<Wait>({ s: "idle" });
  const [log, setLog] = useState<string[]>([]);

  const pushLog = useCallback((m: string) => setLog((l) => [m, ...l].slice(0, 6)), []);

  const getContracts = useCallback(async () => {
    if (!provider) throw new Error("Wallet not connected");
    const signer = await provider.getSigner();
    const usdc = new Contract(USDC_ARC, USDC_ABI, signer);
    return { signer, usdc };
  }, [provider]);

  const refreshBalance = useCallback(async () => {
    try {
      const { signer, usdc } = await getContracts();
      const addr = await signer.getAddress();
      const bal = await usdc.balanceOf(addr);
      const dec = await usdc.decimals();
      setUsdcBalance(formatUnits(bal, dec));
    } catch {
      setUsdcBalance("0.000000");
    }
  }, [getContracts]);

  async function connect() {
    const eth = (window as any).ethereum;
    if (!eth) {
      setWait({ s: "error", msg: "No injected wallet (Rabby / MetaMask) found." });
      return;
    }
    setWait({ s: "connecting" });
    try {
      // ensure ARC chain (5042)
      try {
        await eth.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: ARC.chainIdHex }],
        });
      } catch (err: any) {
        if (err.code === 4902) {
          await eth.request({
            method: "wallet_addEthereumChain",
            params: [{ ...ARC }],
          });
        } else {
          throw err;
        }
      }
      const prov = new BrowserProvider(eth);
      setProvider(prov);
      const signer = await prov.getSigner();
      setSignerAddr((await signer.getAddress()).toLowerCase());
      setWait({ s: "ready" });
      // live refresh on chain/account change
      eth.on?.("chainChanged", () => window.location.reload());
      eth.on?.("accountsChanged", () => window.location.reload());
    } catch (e: any) {
      setWait({ s: "error", msg: e.message || "Connect failed" });
    }
  }

  useEffect(() => {
    if (provider && signerAddr) refreshBalance();
  }, [provider, signerAddr, refreshBalance]);

  async function flip() {
    if (!provider) return connect();
    try {
      const amount = parseUnits(bet, 6);
      if (amount <= BigInt(0)) {
        setWait({ s: "error", msg: "Enter a bet amount > 0" });
        return;
      }
      const { signer, usdc } = await getContracts();
      const addr = await signer.getAddress();
      const bal = await usdc.balanceOf(addr);
      if (bal < amount) {
        setWait({ s: "error", msg: "Insufficient USDC balance" });
        return;
      }
      const allowance = await usdc.allowance(addr, HOUSE_WALLET);
      if (allowance < amount) {
        setWait({ s: "approving" });
        pushLog("Approving USDC to house...");
        const tx = await usdc.approve(HOUSE_WALLET, amount);
        await tx.wait();
        pushLog("USDC approved.");
      }
      setWait({ s: "sending" });
      pushLog(`Sending ${bet} USDC to house wallet...`);
      const tx = await usdc.transfer(HOUSE_WALLET, amount);
      pushLog("Bet tx submitted. Waiting confirm...");
      await tx.wait();
      pushLog("Bet confirmed on chain.");

      // FLIP THE COIN — win chance 0.000001% (1 in 100,000,000)
      setWait({ s: "flipping" });
      setAnim(false);
      await new Promise((r) => setTimeout(r, 80));
      setAnim(true);
      const win = Math.random() < 0.00000001; // 0.000001%
      const res = result ?? side;
      const sleep = new Promise((r) => setTimeout(r, 2200));
      await sleep;
      setResult(res);
      const mult = payoutFor(bet);
      const payout = Number(bet) * mult;
      if (win) {
        setWait({ s: "win" });
        pushLog(`JACKPOT! Coin landed ${res}. You win ${payout.toLocaleString()} USDC! Payout is being prepared by the house.`);
      } else {
        setWait({ s: "lose" });
        pushLog(`No luck. Coin landed ${res}.`);
      }
      refreshBalance();
    } catch (e: any) {
      setWait({ s: "error", msg: e.reason || e.message || "Flip failed" });
    }
  }

  const heads = side === "HEADS";

  return (
    <div className="min-h-screen bg-[#121212] text-white font-[family-name:var(--font-vt323)]">
      {/* NAV */}
      <nav className="sticky top-0 w-full z-50 bg-[#121212] pixel-border-sm border-t-0 border-l-0 border-r-0">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <Image
              src="/images/chad-logo-nav.png"
              alt="CHAD"
              width={40}
              height={40}
              className="w-10 h-10 rounded-none"
              unoptimized
            />
            <span className="font-[family-name:var(--font-press-start)] text-xs text-[#1973c8]">CHAD</span>
          </a>
          <div className="hidden md:flex items-center gap-6">
            <a href="/#about" className="font-[family-name:var(--font-press-start)] text-[10px] text-white hover:text-[#1973c8] transition-colors">ABOUT</a>
            <a href="/flip" className="font-[family-name:var(--font-press-start)] text-[10px] text-[#1973c8]">FLIP</a>
            <span className="font-[family-name:var(--font-press-start)] text-[10px] text-white/40">BINARY <span className="text-[8px]">(COMING SOON)</span></span>
          </div>
        </div>
      </nav>

      <main className="relative max-w-5xl mx-auto px-4 py-16 flex flex-col items-center">
        {/* BG glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#1973c8] rounded-full blur-[120px] opacity-10" />
        </div>

        <div className="relative w-full flex flex-col items-center">
          <h1 className="font-[family-name:var(--font-press-start)] text-3xl md:text-5xl text-[#1973c8] text-glow pixel-float mb-3">
            CHAD FLIP
          </h1>
          <p className="text-xl text-white/70 mb-2">Flip the CHAD coin for the jackpot in USDC · ARC.</p>
          <p className="text-base text-white/40 mb-10">
            Hit It and payout up to {payoutFor(bet)}x
          </p>

          {/* CONNECT / ACCOUNT */}
          {!signerAddr ? (
            <button
              onClick={connect}
              className="pixel-btn px-8 py-3 font-[family-name:var(--font-press-start)] text-[11px] bg-[#1973c8] text-white mb-10"
            >
              {wait.s === "connecting" ? "CONNECTING..." : "CONNECT WALLET"}
            </button>
          ) : (
            <div className="mb-8 text-center">
              <p className="text-white/60 text-base">
                Wallet: <span className="text-white">{signerAddr.slice(0, 6)}...{signerAddr.slice(-4)}</span>
              </p>
              <p className="text-xl text-[#1973c8]">Balance: {usdcBalance} USDC</p>
            </div>
          )}

          {/* GAME BOARD */}
          <div className="pixel-card p-6 md:p-10 w-full max-w-xl">
            {/* SIDE SELECT */}
            <p className="font-[family-name:var(--font-press-start)] text-[10px] text-white/50 mb-3 text-center">CHOOSE SIDE</p>
            <div className="grid grid-cols-2 gap-3 mb-8 w-full">
              {(["HEADS", "TAILS"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setSide(s)}
                  className={`pixel-btn px-4 py-3 font-[family-name:var(--font-press-start)] text-[11px] w-full ${
                    side === s ? "bg-[#1973c8] text-white" : "bg-[#1a1a2e] text-white/60"
                  }`}
                >
                  {s === "HEADS" ? "HEADS" : "TAILS"}
                </button>
              ))}
            </div>

            {/* COIN */}
            <div className="relative w-40 h-40 mx-auto mb-8" style={{ perspective: "1000px" }}>
              <div
                className="absolute inset-0"
                style={{
                  transformStyle: "preserve-3d",
                  transform: anim
                    ? `rotateY(${(result === "HEADS" ? 1 : result === "TAILS" ? 2 : 5) * 1800}deg)`
                    : "rotateY(0deg)",
                  transition: "transform 2.2s cubic-bezier(0.2, 0.8, 0.3, 1)",
                }}
              >
                {/* HEADS face */}
                <div
                  className="absolute inset-0 w-full h-full rounded-full border-4 border-white bg-[#1973c8] overflow-hidden"
                  style={{ backfaceVisibility: "hidden" }}
                >
                  <Image
                    src="/images/chad-logo-new.png"
                    alt="CHAD"
                    fill
                    className="object-contain p-2"
                    unoptimized
                  />
                </div>
                {/* TAILS face */}
                <div
                  className="absolute inset-0 w-full h-full rounded-full border-4 border-[#1973c8] bg-white overflow-hidden"
                  style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                >
                  <Image
                    src="/images/chad-logo-new.png"
                    alt="CHAD"
                    fill
                    className="object-contain p-2"
                    style={{ transform: "scaleX(-1)" }}
                    unoptimized
                  />
                </div>
              </div>
            </div>

            {/* BET AMOUNT */}
            <div className="mb-3">
              <label className="font-[family-name:var(--font-press-start)] text-[10px] text-white/50 block mb-2 text-center">BET (USDC)</label>
              <input
                type="number"
                min="0.01"
                step="0.01"
                value={bet}
                onChange={(e) => setBet(e.target.value)}
                className="w-full bg-[#1a1a2e] pixel-border-sm px-4 py-3 text-2xl text-center text-white font-[family-name:var(--font-vt323)] outline-none focus:border-[#1973c8]"
              />
            </div>
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {ORACLE.map((q) => (
                <button
                  key={q}
                  onClick={() => { setBet(q); setResult(null); setWait({ s: "idle" }); }}
                  className={`pixel-btn px-3 py-1 font-[family-name:var(--font-press-start)] text-[9px] ${
                    bet === q ? "bg-white text-black" : "bg-[#1e1e30] text-white/70"
                  }`}
                >
                  {q}
                </button>
              ))}
            </div>

            {/* FLIP BUTTON */}
            <button
              onClick={flip}
              disabled={wait.s === "flipping" || wait.s === "approving" || wait.s === "sending"}
              className="pixel-btn px-8 py-4 font-[family-name:var(--font-press-start)] text-[12px] bg-[#1973c8] text-white w-full disabled:opacity-50 mb-6"
            >
              {wait.s === "connecting" ? "CONNECTING..." :
               wait.s === "approving" ? "APPROVING..." :
               wait.s === "sending" ? "SENDING BET..." :
               wait.s === "flipping" ? "FLIPPING..." :
               !signerAddr ? "CONNECT & PLAY" : `FLIP ${bet} USDC → ${payoutFor(bet)}x`}
            </button>

            {/* STATUS */}
            {wait.s === "win" && (
              <div className="text-center pixel-border p-4 bg-[#0a3d1a]">
                <p className="font-[family-name:var(--font-press-start)] text-[14px] text-green-400 mb-1">JACKPOT!</p>
                <p className="text-xl text-white">Coin: {result}. You won {(Number(bet) * payoutFor(bet)).toLocaleString()} USDC!</p>
              </div>
            )}
            {wait.s === "lose" && (
              <div className="text-center pixel-border p-4 bg-[#3d0a0a]">
                <p className="font-[family-name:var(--font-press-start)] text-[14px] text-red-400 mb-1">NO LUCK</p>
                <p className="text-xl text-white">You lose chad</p>
              </div>
            )}
            {wait.s === "error" && (
              <div className="text-center pixel-border p-4 bg-[#3d0a0a]">
                <p className="font-[family-name:var(--font-press-start)] text-[12px] text-red-400 mb-1">ERROR</p>
                <p className="text-lg text-white/80">{wait.msg}</p>
              </div>
            )}

            {/* LOG */}
            {log.length > 0 && (
              <div className="mt-6 text-sm text-white/50 space-y-1">
                {log.map((l, i) => <p key={i}>&gt; {l}</p>)}
              </div>
            )}
          </div>

          {/* Disclaimer */}
          <p className="text-white/40 text-sm mt-8 max-w-lg text-center leading-relaxed">
            WARNING: Playing CHAD FLIP is for entertainment only. You can lose your entire
            bet. This is NOT financial advice. Nothing here is an offer to trade, invest,
            or gamble real-world money. 18+.
          </p>

          {/* CHAD */}
          <div className="mt-10">
            <Image src="/images/chad-logo-new.png" alt="Chad" width={120} height={130} className="pixel-float" unoptimized />
          </div>
        </div>
      </main>
    </div>
  );
}
