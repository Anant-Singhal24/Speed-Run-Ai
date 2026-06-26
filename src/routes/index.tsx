import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nexus — AI Data Automation Platform" },
      {
        name: "description",
        content:
          "Nexus automates data pipelines, transforms, and decisions with AI-native primitives. Ship faster, scale safer.",
      },
      { property: "og:title", content: "Nexus — AI Data Automation Platform" },
      {
        property: "og:description",
        content: "AI-native data automation built for speed, scale, and reliability.",
      },
    ],
  }),
  component: LandingPage,
});

/* =========================================================
   PRICING MATRIX — multi-dimensional config, no React re-renders.
   All updates are isolated to text nodes via refs.
   ========================================================= */

type Currency = "USD" | "INR" | "EUR";
type Cycle = "monthly" | "annual";

const CURRENCY = {
  USD: { symbol: "$", tariff: 1.0, locale: "en-US" },
  INR: { symbol: "₹", tariff: 83.2, locale: "en-IN" },
  EUR: { symbol: "€", tariff: 0.92, locale: "de-DE" },
} as const;

const ANNUAL_DISCOUNT = 0.2; // flat 20%

const TIERS = [
  {
    id: "starter",
    name: "Starter",
    tagline: "For solo builders & prototypes",
    base: 19,
    features: [
      "5 AI pipelines",
      "10k events / month",
      "Community connectors",
      "Email support",
    ],
    cta: "Start free",
    highlight: false,
  },
  {
    id: "scale",
    name: "Scale",
    tagline: "For growing data teams",
    base: 79,
    features: [
      "Unlimited pipelines",
      "1M events / month",
      "All connectors + SDK",
      "Priority routing",
      "SOC2 logs",
    ],
    cta: "Start trial",
    highlight: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    tagline: "Custom guardrails & SLAs",
    base: 249,
    features: [
      "Dedicated cluster",
      "Unlimited events",
      "SSO + SCIM",
      "99.99% SLA",
      "Solutions engineer",
    ],
    cta: "Talk to sales",
    highlight: false,
  },
] as const;

function computePrice(base: number, currency: Currency, cycle: Cycle) {
  const cfg = CURRENCY[currency];
  const monthly = base * cfg.tariff;
  const effective = cycle === "annual" ? monthly * (1 - ANNUAL_DISCOUNT) : monthly;
  const rounded = Math.round(effective);
  return `${cfg.symbol}${rounded.toLocaleString(cfg.locale)}`;
}

function PricingMatrix() {
  const rootRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<{ currency: Currency; cycle: Cycle }>({
    currency: "USD",
    cycle: "monthly",
  });

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const priceNodes = root.querySelectorAll<HTMLElement>("[data-price-base]");
    const suffixNodes = root.querySelectorAll<HTMLElement>("[data-price-suffix]");
    const saveNodes = root.querySelectorAll<HTMLElement>("[data-annual-save]");

    const applyPrices = () => {
      const { currency, cycle } = stateRef.current;
      priceNodes.forEach((el) => {
        const base = Number(el.dataset.priceBase || "0");
        el.textContent = computePrice(base, currency, cycle);
      });
      suffixNodes.forEach((el) => {
        el.textContent = cycle === "annual" ? "/mo · billed yearly" : "/month";
      });
      saveNodes.forEach((el) => {
        el.textContent = cycle === "annual" ? "Saving 20%" : "Save 20% annually";
      });
    };

    const cycleBtns = root.querySelectorAll<HTMLButtonElement>("[data-cycle]");
    const onCycle = (e: Event) => {
      const btn = e.currentTarget as HTMLButtonElement;
      const next = btn.dataset.cycle as Cycle;
      if (next === stateRef.current.cycle) return;
      stateRef.current.cycle = next;
      cycleBtns.forEach((b) =>
        b.setAttribute("aria-pressed", String(b.dataset.cycle === next)),
      );
      applyPrices();
    };
    cycleBtns.forEach((b) => b.addEventListener("click", onCycle));

    const currencyBtns = root.querySelectorAll<HTMLButtonElement>("[data-currency]");
    const onCurrency = (e: Event) => {
      const btn = e.currentTarget as HTMLButtonElement;
      const next = btn.dataset.currency as Currency;
      if (next === stateRef.current.currency) return;
      stateRef.current.currency = next;
      currencyBtns.forEach((b) =>
        b.setAttribute("aria-pressed", String(b.dataset.currency === next)),
      );
      const label = root.querySelector<HTMLElement>("[data-currency-label]");
      if (label) label.textContent = next;
      applyPrices();
    };
    currencyBtns.forEach((b) => b.addEventListener("click", onCurrency));

    // Currency dropdown open/close (no React state)
    const trigger = root.querySelector<HTMLButtonElement>("[data-currency-trigger]");
    const menu = root.querySelector<HTMLElement>("[data-currency-menu]");
    const closeMenu = () => menu?.setAttribute("data-open", "false");
    const onTrigger = (e: Event) => {
      e.stopPropagation();
      const open = menu?.getAttribute("data-open") === "true";
      menu?.setAttribute("data-open", String(!open));
    };
    trigger?.addEventListener("click", onTrigger);
    document.addEventListener("click", closeMenu);

    applyPrices();
    return () => {
      cycleBtns.forEach((b) => b.removeEventListener("click", onCycle));
      currencyBtns.forEach((b) => b.removeEventListener("click", onCurrency));
      trigger?.removeEventListener("click", onTrigger);
      document.removeEventListener("click", closeMenu);
    };
  }, []);

  return (
    <div ref={rootRef} className="w-full">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
        {/* Cycle toggle */}
        <div
          role="group"
          aria-label="Billing cycle"
          className="relative inline-flex p-1 rounded-full glass"
        >
          {(["monthly", "annual"] as Cycle[]).map((c) => (
            <button
              key={c}
              type="button"
              data-cycle={c}
              aria-pressed={c === "monthly"}
              className="tx-micro relative z-10 px-4 py-1.5 text-xs font-mono uppercase tracking-wider rounded-full text-fg-muted aria-pressed:bg-accent aria-pressed:text-bg aria-pressed:font-semibold"
              style={{
                background: undefined,
              }}
            >
              {c}
              {c === "annual" && (
                <span
                  data-annual-save
                  className="ml-2 text-[10px] opacity-80"
                >
                  Save 20% annually
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Currency dropdown */}
        <div className="relative">
          <button
            type="button"
            data-currency-trigger
            className="tx-micro inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-xs font-mono uppercase tracking-wider"
            aria-haspopup="listbox"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-accent" aria-hidden />
            <span data-currency-label>USD</span>
            <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden>
              <path d="M2 4l3 3 3-3" stroke="currentColor" strokeWidth="1.4" fill="none" />
            </svg>
          </button>
          <div
            data-currency-menu
            data-open="false"
            role="listbox"
            className="absolute left-1/2 -translate-x-1/2 mt-2 min-w-[140px] rounded-xl glass p-1 z-30 origin-top tx-layout opacity-0 scale-95 pointer-events-none data-[open=true]:opacity-100 data-[open=true]:scale-100 data-[open=true]:pointer-events-auto"
          >
            {(Object.keys(CURRENCY) as Currency[]).map((c) => (
              <button
                key={c}
                type="button"
                role="option"
                data-currency={c}
                aria-pressed={c === "USD"}
                className="tx-micro w-full text-left px-3 py-1.5 text-xs font-mono rounded-lg hover:bg-surface-2 aria-pressed:text-accent flex items-center justify-between"
              >
                <span>{c}</span>
                <span className="opacity-50">{CURRENCY[c].symbol}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tier cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {TIERS.map((t) => (
          <div
            key={t.id}
            className={`relative rounded-2xl p-6 tx-layout ${
              t.highlight
                ? "bg-surface-2 border border-accent/40 shadow-[0_30px_80px_-40px_var(--accent-glow)]"
                : "glass"
            }`}
          >
            {t.highlight && (
              <div className="absolute -top-3 left-6 chip" style={{ background: "var(--accent)", color: "var(--bg)" }}>
                <span className="font-mono font-semibold text-[10px]">MOST POPULAR</span>
              </div>
            )}
            <div className="flex items-baseline justify-between">
              <h3 className="text-lg font-display">{t.name}</h3>
              <span className="font-mono text-[10px] uppercase tracking-wider text-fg-dim">
                tier_{t.id}
              </span>
            </div>
            <p className="text-sm text-fg-muted mt-1">{t.tagline}</p>

            <div className="mt-6 flex items-end gap-2">
              <span
                data-price-base={t.base}
                className="price-num text-4xl text-fg"
              >
                {computePrice(t.base, "USD", "monthly")}
              </span>
              <span
                data-price-suffix
                className="text-xs font-mono text-fg-dim pb-1.5"
              >
                /month
              </span>
            </div>

            <button
              type="button"
              className={`btn w-full justify-center mt-6 ${t.highlight ? "btn-primary" : "btn-ghost"}`}
            >
              {t.cta}
              <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden>
                <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.6" fill="none" />
              </svg>
            </button>

            <ul className="mt-6 space-y-2.5">
              {t.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-fg-muted">
                  <svg width="14" height="14" viewBox="0 0 14 14" className="mt-0.5 text-accent shrink-0" aria-hidden>
                    <path d="M2 7l3 3 7-7" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

/* =========================================================
   BENTO ↔ ACCORDION with state persistence on resize
   ========================================================= */

const FEATURES = [
  {
    title: "Stream Engine",
    blurb: "Event-driven pipelines with sub-100ms routing across 90+ connectors.",
    code: "nexus.stream('events').map(ai.enrich).sink('warehouse')",
  },
  {
    title: "AI Transforms",
    blurb: "LLM and embedding ops as first-class transforms — typed, cached, observable.",
    code: "ai.classify(input, schema)",
  },
  {
    title: "Lineage Graph",
    blurb: "Every row, every model, every decision — traced end to end.",
    code: "nexus.lineage('row_id').trace()",
  },
  {
    title: "Guardrails",
    blurb: "Policy-as-code with PII masking, rate limits, and zero-trust egress.",
    code: "policy.allow('region=eu').mask('pii')",
  },
  {
    title: "Observability",
    blurb: "OpenTelemetry-native traces, metrics, and replays out of the box.",
    code: "otel.export('grafana')",
  },
  {
    title: "Deploy Anywhere",
    blurb: "Run on our cloud, bring your own VPC, or fully air-gapped.",
    code: "nexus deploy --region eu-west-1",
  },
] as const;

function FeaturesSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  // Context lock: holds the most recently hovered/interacted index even after layout switch
  const lastInteractedRef = useRef<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const sync = () => {
      const m = mq.matches;
      setIsMobile(m);
      // Transfer context on layout transition
      if (lastInteractedRef.current != null) {
        setActiveIndex(lastInteractedRef.current);
      }
    };
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const handleEnter = (i: number) => {
    lastInteractedRef.current = i;
    setActiveIndex(i);
  };
  const handleLeave = () => {
    // keep lastInteractedRef so resize still transfers context
    setActiveIndex(null);
  };

  const toggleAccordion = (i: number) => {
    lastInteractedRef.current = i;
    setActiveIndex((cur) => (cur === i ? null : i));
  };

  if (isMobile) {
    return (
      <div className="mt-12">
        {FEATURES.map((f, i) => (
          <div key={f.title} className="acc-item" data-open={activeIndex === i}>
            <button
              type="button"
              className="acc-trigger"
              aria-expanded={activeIndex === i}
              onClick={() => toggleAccordion(i)}
            >
              <span className="flex items-center gap-3">
                <span className="font-mono text-xs text-fg-dim">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {f.title}
              </span>
              <span className="acc-icon text-fg-dim text-xl leading-none" aria-hidden>
                +
              </span>
            </button>
            <div className="acc-panel">
              <p className="text-sm text-fg-muted">{f.blurb}</p>
              <pre className="mt-3 text-[11px] font-mono bg-bg-2 border border-border rounded-lg p-3 overflow-x-auto text-accent">
                <code>{f.code}</code>
              </pre>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Desktop bento grid (asymmetric)
  const spans = [
    "md:col-span-2 md:row-span-2",
    "md:col-span-1 md:row-span-1",
    "md:col-span-1 md:row-span-1",
    "md:col-span-1 md:row-span-1",
    "md:col-span-1 md:row-span-1",
    "md:col-span-2 md:row-span-1",
  ];

  return (
    <div className="mt-12 grid grid-cols-1 md:grid-cols-4 md:grid-rows-3 gap-4 auto-rows-[160px]">
      {FEATURES.map((f, i) => (
        <article
          key={f.title}
          className={`bento-card ${spans[i]}`}
          data-active={activeIndex === i}
          onMouseEnter={() => handleEnter(i)}
          onMouseLeave={handleLeave}
          onFocus={() => handleEnter(i)}
          tabIndex={0}
        >
          <div className="flex items-start justify-between">
            <span className="font-mono text-[10px] uppercase tracking-wider text-fg-dim">
              {String(i + 1).padStart(2, "0")} / feature
            </span>
            <span className="w-2 h-2 rounded-full bg-accent" aria-hidden />
          </div>
          <h3 className="font-display text-lg mt-3">{f.title}</h3>
          <p className="text-sm text-fg-muted mt-1.5 leading-relaxed">{f.blurb}</p>
          <pre className="absolute left-5 right-5 bottom-4 text-[10.5px] font-mono text-accent/80 truncate">
            <code>{f.code}</code>
          </pre>
        </article>
      ))}
    </div>
  );
}

/* =========================================================
   PAGE
   ========================================================= */

function LandingPage() {
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:p-2 focus:bg-accent focus:text-bg focus:rounded">
        Skip to content
      </a>

      <header className="sticky top-0 z-40 backdrop-blur-md border-b border-border bg-bg/70">
        <nav aria-label="Primary" className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <Logo />
            <span className="font-display text-sm tracking-tight">Nexus</span>
            <span className="chip ml-2 hidden sm:inline-flex">v2.6 — beta</span>
          </a>
          <ul className="hidden md:flex items-center gap-7 text-sm text-fg-muted font-mono">
            <li><a href="#features" className="tx-micro hover:text-fg">Features</a></li>
            <li><a href="#pricing" className="tx-micro hover:text-fg">Pricing</a></li>
            <li><a href="#proof" className="tx-micro hover:text-fg">Customers</a></li>
            <li><a href="#docs" className="tx-micro hover:text-fg">Docs</a></li>
          </ul>
          <div className="flex items-center gap-2">
            <a href="#" className="btn btn-ghost hidden sm:inline-flex">Sign in</a>
            <a href="#pricing" className="btn btn-primary">Get started</a>
          </div>
        </nav>
      </header>

      <main id="main">
        {/* HERO */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 grid-bg pointer-events-none" aria-hidden />
          <div className="relative max-w-6xl mx-auto px-6 pt-20 pb-24 md:pt-28 md:pb-32 text-center">
            <div className="anim-fade inline-flex chip mb-6">
              <span className="chip-dot" /> Now shipping — Nexus 2.6
            </div>
            <h1 className="anim-rise text-4xl sm:text-6xl md:text-7xl font-display leading-[1.05] max-w-4xl mx-auto">
              The <span className="shimmer-text">AI data layer</span><br />
              for teams that ship fast.
            </h1>
            <p className="anim-rise delay-100 mt-6 max-w-2xl mx-auto text-base sm:text-lg text-fg-muted">
              Stream events, run LLM transforms, and deploy pipelines in minutes —
              with lineage, guardrails, and observability built in.
            </p>
            <div className="anim-rise delay-200 mt-9 flex items-center justify-center gap-3 flex-wrap">
              <a href="#pricing" className="btn btn-primary">
                Start free
                <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden>
                  <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.6" fill="none" />
                </svg>
              </a>
              <a href="#features" className="btn btn-ghost">
                <PlayIcon /> Watch demo
              </a>
            </div>

            {/* Hero panel */}
            <div className="anim-rise delay-300 mt-14 mx-auto max-w-4xl rounded-2xl glass p-2 shadow-[0_40px_120px_-40px_oklch(0_0_0/0.7)]">
              <div className="rounded-xl bg-bg-2 border border-border overflow-hidden">
                <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-border">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
                  <span className="ml-3 font-mono text-[11px] text-fg-dim">~/nexus/pipeline.ts</span>
                </div>
                <pre className="text-left text-[12px] sm:text-[13px] font-mono p-5 overflow-x-auto leading-relaxed">
<code>{`import { nexus, ai } from "@nexus/sdk";

`}<span className="text-fg-dim">{`// stream → enrich → route`}</span>{`
nexus
  .stream(`}<span style={{ color: "var(--accent)" }}>{`"orders.created"`}</span>{`)
  .map(ai.classify({ schema: OrderIntent }))
  .filter((e) => e.confidence > `}<span style={{ color: "var(--accent-2)" }}>{`0.85`}</span>{`)
  .sink(`}<span style={{ color: "var(--accent)" }}>{`"warehouse.orders"`}</span>{`);
`}</code>
                </pre>
              </div>
            </div>

            {/* stats */}
            <dl className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-px bg-border rounded-xl overflow-hidden text-left">
              {[
                ["10B+", "events / day"],
                ["99.99%", "uptime SLA"],
                ["<100ms", "median p50"],
                ["90+", "connectors"],
              ].map(([v, l]) => (
                <div key={l} className="bg-bg p-5">
                  <dt className="font-display text-2xl text-fg">{v}</dt>
                  <dd className="font-mono text-[11px] uppercase tracking-wider text-fg-dim mt-1">{l}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* LOGO MARQUEE */}
        <section aria-label="Trusted by" className="border-y border-border bg-bg/60">
          <div className="max-w-6xl mx-auto px-6 py-6 overflow-hidden">
            <p className="font-mono text-[11px] uppercase tracking-wider text-fg-dim text-center mb-4">
              Trusted by engineering teams at
            </p>
            <div className="relative overflow-hidden">
              <div className="scroll-x-marquee whitespace-nowrap">
                {[...Array(2)].flatMap((_, k) =>
                  ["Vercel", "Linear", "Stripe", "Notion", "Supabase", "Datadog", "Cloudflare", "Anthropic"].map((n) => (
                    <span key={`${k}-${n}`} className="font-display text-xl text-fg-dim opacity-80 hover:opacity-100 tx-micro">
                      {n}
                    </span>
                  )),
                )}
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section id="features" className="max-w-6xl mx-auto px-6 py-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="chip"><span className="chip-dot" /> 02 / features</span>
              <h2 className="font-display text-3xl sm:text-5xl mt-4 max-w-2xl">
                Primitives that compose, scale, and stay observable.
              </h2>
            </div>
            <p className="max-w-md text-fg-muted">
              Every Nexus primitive is type-safe, testable, and instrumented by default.
              Build the entire data plane without leaving your IDE.
            </p>
          </div>
          <FeaturesSection />
        </section>

        {/* PRICING */}
        <section id="pricing" className="max-w-6xl mx-auto px-6 py-24">
          <div className="text-center mb-10">
            <span className="chip"><span className="chip-dot" /> 03 / pricing</span>
            <h2 className="font-display text-3xl sm:text-5xl mt-4">
              Pricing that scales with throughput.
            </h2>
            <p className="text-fg-muted mt-3 max-w-xl mx-auto">
              Transparent, usage-aware tiers. Switch currency or cycle — only the prices update, nothing else re-renders.
            </p>
          </div>
          <PricingMatrix />
        </section>

        {/* TESTIMONIALS */}
        <section id="proof" className="max-w-6xl mx-auto px-6 py-24">
          <div className="text-center mb-10">
            <span className="chip"><span className="chip-dot" /> 04 / proof</span>
            <h2 className="font-display text-3xl sm:text-5xl mt-4">
              Loved by data & platform teams.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                q: "Nexus collapsed our 7-stage Airflow + Lambda stack into one declarative pipeline. We ship 4x faster.",
                a: "Priya Shah",
                r: "Staff Eng, Lumen",
              },
              {
                q: "The lineage graph alone paid for the entire contract — every audit takes minutes, not weeks.",
                a: "Marcus Holt",
                r: "VP Data, Northwind",
              },
              {
                q: "The AI transforms are the cleanest LLM abstraction I've used. Just types and traces.",
                a: "Yuki Tanaka",
                r: "Founder, Relay",
              },
            ].map((t) => (
              <figure key={t.a} className="rounded-2xl glass p-6 tx-micro hover:border-accent/40">
                <svg width="22" height="22" viewBox="0 0 22 22" className="text-accent mb-3" aria-hidden>
                  <path d="M3 14c0-5 3-8 7-9l1 2c-3 1-5 3-5 6h3v6H3v-5zm10 0c0-5 3-8 7-9l1 2c-3 1-5 3-5 6h3v6h-6v-5z" fill="currentColor" />
                </svg>
                <blockquote className="text-fg leading-relaxed">{t.q}</blockquote>
                <figcaption className="mt-5 flex items-center gap-3">
                  <span className="w-9 h-9 rounded-full bg-surface-2 border border-border grid place-items-center font-display text-sm">
                    {t.a.split(" ").map((s) => s[0]).join("")}
                  </span>
                  <span>
                    <span className="block text-sm">{t.a}</span>
                    <span className="block text-xs text-fg-dim font-mono">{t.r}</span>
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-6xl mx-auto px-6 pb-24">
          <div className="relative overflow-hidden rounded-3xl border border-border bg-surface p-10 md:p-16 text-center">
            <div className="absolute inset-0 grid-bg opacity-50 pointer-events-none" aria-hidden />
            <div className="relative">
              <h2 className="font-display text-3xl sm:text-5xl">
                Ship your <span className="shimmer-text">data plane</span> this week.
              </h2>
              <p className="text-fg-muted mt-4 max-w-lg mx-auto">
                Start free. Bring your own cloud. Cancel anytime. No credit card to begin.
              </p>
              <div className="mt-8 flex items-center justify-center gap-3 flex-wrap">
                <a href="#" className="btn btn-primary">Create account</a>
                <a href="#" className="btn btn-ghost">Read the docs</a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Logo />
            <span className="font-display text-sm">Nexus</span>
            <span className="font-mono text-[11px] text-fg-dim ml-2">© 2026</span>
          </div>
          <ul className="flex items-center gap-6 font-mono text-xs text-fg-dim">
            <li><a href="#" className="hover:text-fg tx-micro">Privacy</a></li>
            <li><a href="#" className="hover:text-fg tx-micro">Terms</a></li>
            <li><a href="#" className="hover:text-fg tx-micro">Status</a></li>
            <li><a href="#" className="hover:text-fg tx-micro">GitHub</a></li>
          </ul>
        </div>
      </footer>
    </>
  );
}

function Logo() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden>
      <defs>
        <linearGradient id="lg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="oklch(0.78 0.18 145)" />
          <stop offset="100%" stopColor="oklch(0.7 0.18 220)" />
        </linearGradient>
      </defs>
      <path
        d="M4 18V6l8 9V6l8 12"
        stroke="url(#lg)"
        strokeWidth="2.2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden>
      <path d="M3 2l7 4-7 4V2z" fill="currentColor" />
    </svg>
  );
}
