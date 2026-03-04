import { Title, Meta } from "@solidjs/meta";
import { createSignal, onMount, For } from "solid-js";

const TABLE_DATA = [
  { rank: 1, name: "Blue-Eyes White Dragon", set: "LOB-001", lastSale: 33600, pop: 106, marketCap: 3561600 },
  { rank: 2, name: "Red-Eyes B. Dragon", set: "LOB-070", lastSale: 7511, pop: 96, marketCap: 721056 },
  { rank: 3, name: "Dark Magician", set: "LOB-005", lastSale: 7499, pop: 87, marketCap: 652413 },
  { rank: 4, name: "Exodia the Forbidden One", set: "LOB-124", lastSale: 5500, pop: 111, marketCap: 610500 },
  { rank: 5, name: "Gaia the Fierce Knight", set: "LOB-006", lastSale: 1451, pop: 79, marketCap: 114629 },
  { rank: 6, name: "Monster Reborn", set: "LOB-118", lastSale: 1200, pop: 68, marketCap: 81600 },
];

const MAX_MCAP = TABLE_DATA[0].marketCap;
const TOTAL_MCAP = TABLE_DATA.reduce((s, c) => s + c.marketCap, 0);

const PRICE_POINTS = [28200, 27800, 29100, 28500, 30200, 29800, 31500, 30900, 32100, 31200, 33800, 32500, 34200, 33600];
const PRICE_LABELS = ["Dec", "", "", "", "Jan", "", "", "", "Feb", "", "", "", "Mar", ""];

function fmt(n: number): string {
  return n.toLocaleString("en-US");
}

function PriceChart() {
  const w = 400, h = 140, px = 40, py = 12;
  const min = Math.min(...PRICE_POINTS) - 1000;
  const max = Math.max(...PRICE_POINTS) + 1000;
  const pts = PRICE_POINTS.map((p, i) => ({
    x: px + (i / (PRICE_POINTS.length - 1)) * (w - px - 8),
    y: py + (1 - (p - min) / (max - min)) * (h - py * 2 - 16),
  }));
  const linePath = `M ${pts.map((p) => `${p.x},${p.y}`).join(" L ")}`;
  const areaPath = `${linePath} L ${pts[pts.length - 1].x},${h - py} L ${pts[0].x},${h - py} Z`;

  const gridValues = [20000, 25000, 30000, 35000];
  const gridLines = gridValues.map((v) => ({
    y: py + (1 - (v - min) / (max - min)) * (h - py * 2 - 16),
    label: `$${v / 1000}k`,
  }));

  return (
    <svg viewBox={`0 0 ${w} ${h}`} class="w-full" style={{ height: "auto", "max-height": "160px" }}>
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#10b981" stop-opacity="0.15" />
          <stop offset="100%" stop-color="#10b981" stop-opacity="0" />
        </linearGradient>
      </defs>
      {/* Grid */}
      {gridLines.map((g) => (
        <>
          <line x1={px} y1={g.y} x2={w - 8} y2={g.y} stroke="rgba(255,255,255,0.04)" stroke-width="1" />
          <text x={px - 6} y={g.y + 3} text-anchor="end" fill="#334155" font-size="9" font-family="'Geist Mono', monospace">{g.label}</text>
        </>
      ))}
      {/* X labels */}
      {PRICE_LABELS.map((label, i) => label ? (
        <text x={pts[i].x} y={h - 2} text-anchor="middle" fill="#334155" font-size="9" font-family="'Geist Mono', monospace">{label}</text>
      ) : null)}
      {/* Area + Line */}
      <path d={areaPath} fill="url(#areaGrad)" />
      <path d={linePath} fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      {/* End dot */}
      <circle cx={pts[pts.length - 1].x} cy={pts[pts.length - 1].y} r="3.5" fill="#10b981" />
      <circle cx={pts[pts.length - 1].x} cy={pts[pts.length - 1].y} r="6" fill="none" stroke="#10b981" stroke-width="1" opacity="0.3" />
    </svg>
  );
}

export default function Home() {
  const [email, setEmail] = createSignal("");
  const [submitted, setSubmitted] = createSignal(false);
  const [mounted, setMounted] = createSignal(false);

  onMount(() => {
    setMounted(true);
    document.documentElement.classList.add("dark");
  });

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    if (!email().trim()) return;
    try {
      await fetch("/api/v1/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email() }),
      });
    } catch {
      // no-op
    }
    setSubmitted(true);
    setEmail("");
  };

  return (
    <>
      <Title>CardCap — Market Cap Tracking for Trading Cards</Title>
      <Meta name="description" content="Track market caps for Yu-Gi-Oh!, Pokémon, and MTG cards based on real sold prices and graded population data. CoinMarketCap for trading cards." />
      <Meta property="og:title" content="CardCap — Market Cap Tracking for Trading Cards" />
      <Meta property="og:description" content="Track market caps for Yu-Gi-Oh!, Pokémon, and MTG cards based on real sold prices and graded population data." />

      <div
        class="relative w-full overflow-x-hidden"
        style={{
          background: "linear-gradient(180deg, #060a11 0%, #0c1220 40%, #0a0f1a 100%)",
          color: "#e2e8f0",
        }}
      >
        {/* Grid overlay */}
        <div
          class="fixed inset-0 pointer-events-none z-0"
          style={{
            "background-image": "linear-gradient(rgba(56, 189, 248, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(56, 189, 248, 0.03) 1px, transparent 1px)",
            "background-size": "60px 60px",
          }}
        />

        {/* Glow accents */}
        <div class="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div style={{ position: "absolute", top: "5%", left: "10%", width: "600px", height: "600px", background: "radial-gradient(circle, rgba(16, 185, 129, 0.07) 0%, transparent 70%)", filter: "blur(100px)" }} />
          <div style={{ position: "absolute", bottom: "15%", right: "5%", width: "500px", height: "500px", background: "radial-gradient(circle, rgba(56, 189, 248, 0.05) 0%, transparent 70%)", filter: "blur(100px)" }} />
        </div>

        {/* ================================================================ */}
        {/* SECTION 1 — HERO                                                */}
        {/* ================================================================ */}
        <section
          class="relative z-10 min-h-screen flex flex-col"
          style={{
            opacity: mounted() ? "1" : "0",
            transform: mounted() ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.7s ease, transform 0.7s ease",
          }}
        >
          {/* Header */}
          <div class="text-center pt-12 md:pt-16">
            <h1
              class="font-display"
              style={{
                "font-size": "clamp(2.2rem, 6vw, 3.4rem)",
                "line-height": "1.05",
                color: "#f1f5f9",
                "font-weight": "800",
                "letter-spacing": "-0.04em",
              }}
            >
              cardcap<span style={{ color: "#10b981" }}>.gg</span>
            </h1>
            <p
              class="mt-2 font-sans"
              style={{ "font-size": "clamp(0.95rem, 2vw, 1.15rem)", color: "#64748b" }}
            >
              Market cap tracking for trading cards.
            </p>
          </div>

          {/* Hero two-column */}
          <div class="flex-1 flex items-center justify-center px-6 py-8 md:py-4">
            <div class="flex flex-col md:flex-row items-center gap-10 md:gap-14 w-full" style={{ "max-width": "940px" }}>

              {/* Card image */}
              <div class="flex-shrink-0" style={{ perspective: "1200px" }}>
                <img
                  src="/images/hero-bewd.webp"
                  alt="LOB-001 Blue-Eyes White Dragon 1st Edition PSA 10 graded slab"
                  style={{
                    height: "clamp(360px, 60vh, 520px)",
                    width: "auto",
                    "border-radius": "10px",
                    transform: "rotateY(-4deg)",
                    "box-shadow": "0 40px 80px rgba(0,0,0,0.55), 0 16px 32px rgba(0,0,0,0.35), 0 0 120px rgba(16,185,129,0.06)",
                    animation: "cardFloat 4s ease-in-out infinite",
                  }}
                />
              </div>

              {/* Data stack */}
              <div class="flex flex-col items-center md:items-start text-center md:text-left flex-1 min-w-0">
                <h2
                  class="font-display"
                  style={{
                    "font-weight": "700",
                    "font-size": "clamp(1.5rem, 3vw, 1.9rem)",
                    color: "#f1f5f9",
                    "letter-spacing": "-0.02em",
                    "line-height": "1.15",
                  }}
                >
                  Blue-Eyes White Dragon
                </h2>
                <p
                  class="mt-2 font-mono"
                  style={{ "font-size": "0.85rem", color: "#475569", "letter-spacing": "0.02em" }}
                >
                  LOB-001 · 1st Edition · PSA 10
                </p>

                {/* Market cap */}
                <div class="mt-6">
                  <p
                    class="font-mono"
                    style={{ "font-size": "0.65rem", color: "#475569", "text-transform": "uppercase", "letter-spacing": "0.1em" }}
                  >
                    PSA 10 market cap
                  </p>
                  <p
                    class="font-mono"
                    style={{
                      "font-weight": "800",
                      "font-size": "clamp(2.4rem, 5.5vw, 3.8rem)",
                      color: "#10b981",
                      "line-height": "1.05",
                      "letter-spacing": "-0.03em",
                    }}
                  >
                    $3,561,600
                  </p>
                </div>

                {/* Stats row */}
                <div
                  class="mt-3 flex flex-wrap items-center justify-center md:justify-start gap-x-5 gap-y-1 font-mono"
                  style={{ "font-size": "0.8rem", color: "#64748b" }}
                >
                  <span>$33,600 last sale</span>
                  <span style={{ color: "#1e293b" }}>·</span>
                  <span>106 pop</span>
                </div>

                {/* Chart */}
                <div
                  class="mt-6 w-full rounded-xl overflow-hidden"
                  style={{
                    background: "rgba(255,255,255,0.015)",
                    border: "1px solid rgba(255,255,255,0.05)",
                    padding: "16px 12px 8px 4px",
                    "max-width": "440px",
                  }}
                >
                  <div class="flex items-center gap-2 mb-2 pl-3">
                    <div style={{ width: "6px", height: "6px", "border-radius": "50%", background: "#10b981" }} />
                    <span class="font-mono" style={{ "font-size": "0.6rem", color: "#475569", "text-transform": "uppercase", "letter-spacing": "0.06em" }}>
                      PSA 10 · 90 Day Price
                    </span>
                  </div>
                  <PriceChart />
                </div>

                <p class="mt-2 font-mono" style={{ "font-size": "0.55rem", color: "#334155", opacity: "0.5" }}>
                  PSA 10 pop × last sale · illustrative data
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* SECTION 2 — LOB LEADERBOARD                                     */}
        {/* ================================================================ */}
        <section class="relative z-10 px-6 pt-4 pb-20">
          <div style={{ "max-width": "940px" }} class="mx-auto">
            {/* Header */}
            <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-8">
              <div>
                <h3 class="font-display" style={{ "font-weight": "700", "font-size": "1.3rem", color: "#e2e8f0" }}>
                  Legend of Blue Eyes White Dragon
                </h3>
                <p class="font-mono mt-1" style={{ "font-size": "0.8rem", color: "#475569" }}>
                  PSA 10 · Top Cards by Market Cap
                </p>
              </div>
              <div class="sm:text-right">
                <p class="font-mono" style={{ "font-size": "0.6rem", color: "#475569", "text-transform": "uppercase", "letter-spacing": "0.08em" }}>
                  Set PSA 10 Market Cap
                </p>
                <p class="font-mono" style={{ "font-size": "1.6rem", "font-weight": "700", color: "#10b981", "line-height": "1.2", "letter-spacing": "-0.02em" }}>
                  ${fmt(TOTAL_MCAP)}
                </p>
              </div>
            </div>

            {/* Desktop table */}
            <div
              class="hidden md:block rounded-xl overflow-hidden"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <table class="w-full" style={{ "border-collapse": "collapse" }}>
                <thead>
                  <tr class="font-mono" style={{ "font-size": "0.7rem", color: "#475569", "text-transform": "uppercase", "letter-spacing": "0.06em", "border-bottom": "1px solid rgba(255,255,255,0.06)" }}>
                    <th class="text-left py-4 pl-6 pr-3 font-medium" style={{ width: "48px" }}>#</th>
                    <th class="text-left py-4 px-3 font-medium">Card</th>
                    <th class="text-left py-4 px-3 font-medium">Set</th>
                    <th class="text-right py-4 px-3 font-medium">Last Sale</th>
                    <th class="text-right py-4 px-3 font-medium">Pop</th>
                    <th class="text-right py-4 pl-3 pr-6 font-medium" style={{ width: "220px" }}>Market Cap</th>
                  </tr>
                </thead>
                <tbody>
                  <For each={TABLE_DATA}>
                    {(card, i) => {
                      const barW = () => `${(card.marketCap / MAX_MCAP) * 100}%`;
                      const first = () => i() === 0;
                      return (
                        <tr
                          class="transition-colors duration-150"
                          style={{
                            "font-size": "0.9rem",
                            color: "#94a3b8",
                            "border-bottom": i() < TABLE_DATA.length - 1 ? "1px solid rgba(255,255,255,0.03)" : "none",
                            background: first() ? "rgba(16,185,129,0.04)" : "transparent",
                            animation: `fadeInUp 0.5s ease both`,
                            "animation-delay": `${i() * 80}ms`,
                          }}
                          onMouseOver={(e) => { if (!first()) e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}
                          onMouseOut={(e) => { if (!first()) e.currentTarget.style.background = "transparent"; }}
                        >
                          <td class="py-4 pl-6 pr-3 font-mono" style={{ color: first() ? "#10b981" : "#334155", "font-weight": first() ? "700" : "400" }}>
                            {card.rank}
                          </td>
                          <td class="py-4 px-3 font-mono" style={{ color: "#e2e8f0", "font-weight": "600" }}>
                            {card.name}
                          </td>
                          <td class="py-4 px-3 font-mono" style={{ color: "#475569" }}>{card.set}</td>
                          <td class="py-4 px-3 text-right font-mono">${fmt(card.lastSale)}</td>
                          <td class="py-4 px-3 text-right font-mono">{fmt(card.pop)}</td>
                          <td class="py-4 pl-3 pr-6 text-right font-mono" style={{ position: "relative" }}>
                            <div style={{ position: "absolute", right: "0", top: "0", bottom: "0", width: barW(), background: "rgba(16,185,129,0.08)", transition: "width 0.6s ease" }} />
                            <span style={{ position: "relative", "z-index": "1", color: "#10b981", "font-weight": "700" }}>
                              ${fmt(card.marketCap)}
                            </span>
                          </td>
                        </tr>
                      );
                    }}
                  </For>
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div class="md:hidden flex flex-col gap-3">
              <For each={TABLE_DATA}>
                {(card, i) => {
                  const barW = () => `${(card.marketCap / MAX_MCAP) * 100}%`;
                  const first = () => i() === 0;
                  return (
                    <div
                      class="rounded-xl px-4 py-4 relative overflow-hidden"
                      style={{
                        background: first() ? "rgba(16,185,129,0.04)" : "rgba(255,255,255,0.02)",
                        border: `1px solid ${first() ? "rgba(16,185,129,0.12)" : "rgba(255,255,255,0.06)"}`,
                        animation: `fadeInUp 0.5s ease both`,
                        "animation-delay": `${i() * 80}ms`,
                      }}
                    >
                      <div style={{ position: "absolute", left: "0", top: "0", bottom: "0", width: barW(), background: "rgba(16,185,129,0.05)" }} />
                      <div style={{ position: "relative", "z-index": "1" }}>
                        <div class="flex items-baseline justify-between gap-2">
                          <span class="font-mono" style={{ color: "#e2e8f0", "font-size": "0.95rem", "font-weight": "600" }}>{card.name}</span>
                          <span class="font-mono flex-shrink-0" style={{ color: "#475569", "font-size": "0.75rem" }}>{card.set} · #{card.rank}</span>
                        </div>
                        <div class="flex gap-5 mt-2 font-mono" style={{ "font-size": "0.75rem", color: "#64748b" }}>
                          <span>${fmt(card.lastSale)}</span>
                          <span>{card.pop} pop</span>
                        </div>
                        <p class="mt-2 font-mono" style={{ color: "#10b981", "font-size": "1.1rem", "font-weight": "700" }}>
                          ${fmt(card.marketCap)}
                        </p>
                      </div>
                    </div>
                  );
                }}
              </For>
            </div>

            {/* Disclaimer */}
            <p class="mt-5 text-center md:text-left font-mono" style={{ "font-size": "0.7rem", color: "#475569" }}>
              market cap = PSA 10 pop × last sale
            </p>
          </div>
        </section>

        {/* ================================================================ */}
        {/* SECTION 3 — CTA                                                 */}
        {/* ================================================================ */}
        <section class="relative z-10 px-6 pt-4 pb-12">
          <div class="flex flex-col items-center" style={{ "max-width": "460px", margin: "0 auto" }}>
            <p class="font-sans text-center mb-6" style={{ "font-size": "1rem", color: "#64748b", "line-height": "1.6", "max-width": "380px" }}>
              Track every PSA-graded card's market cap.<br />Starting with Yu-Gi-Oh!
            </p>

            {/* Coming soon */}
            <div class="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full" style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.15)" }}>
              <div class="w-2 h-2 rounded-full" style={{ background: "#10b981", "box-shadow": "0 0 8px rgba(16,185,129,0.6)" }} />
              <span class="font-mono" style={{ "font-size": "0.75rem", color: "#10b981", "font-weight": "600", "letter-spacing": "0.06em" }}>
                COMING SOON
              </span>
            </div>

            {/* Email */}
            <div class="mt-8 w-full">
              {submitted() ? (
                <div
                  class="flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl font-sans"
                  style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.12)", color: "#10b981", "font-size": "0.9rem" }}
                >
                  <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                    <path d="M13.5 4.5L6.5 11.5L2.5 7.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  You're on the list.
                </div>
              ) : (
                <form onSubmit={handleSubmit} class="flex gap-2.5">
                  <input
                    type="email"
                    placeholder="you@email.com"
                    value={email()}
                    onInput={(e) => setEmail(e.currentTarget.value)}
                    required
                    class="flex-1 px-4 py-3.5 rounded-xl text-sm outline-none placeholder:text-gray-600 font-sans"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#e2e8f0" }}
                  />
                  <button
                    type="submit"
                    class="px-6 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 font-sans"
                    style={{ background: "#10b981", color: "#022c22" }}
                    onMouseOver={(e) => (e.currentTarget.style.background = "#059669")}
                    onMouseOut={(e) => (e.currentTarget.style.background = "#10b981")}
                  >
                    Notify me
                  </button>
                </form>
              )}
              <p class="mt-3 text-center font-sans" style={{ "font-size": "0.7rem", color: "#475569" }}>
                Get notified when we launch. No spam.
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <div class="relative z-10 flex items-center justify-center py-8 font-mono" style={{ "font-size": "0.7rem", color: "#334155", "letter-spacing": "0.03em" }}>
          &copy; {new Date().getFullYear()} cardcap.gg
        </div>

        <style>{`
          @keyframes cardFloat {
            0%, 100% { transform: rotateY(-4deg) translateY(0); }
            50% { transform: rotateY(-4deg) translateY(-10px); }
          }
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(16px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    </>
  );
}
