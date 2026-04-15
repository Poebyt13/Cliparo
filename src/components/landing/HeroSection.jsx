"use client";

import Button from "@/components/Button";

// 5 parole reali + clone della prima per il loop CSS seamless
const TICKER_WORDS = [
  "TikTok clips",
  "Instagram Reels",
  "YouTube Shorts",
  "viral clips",
  "instant clips",
  "TikTok clips",
];

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-28 pb-24 sm:pt-32 sm:pb-32">
      {/* Grid a quadretti */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          maskImage: "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
        }}
      />
      {/* Glow blobs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-[-20%] left-[10%] w-150 h-150 rounded-full bg-purple-600/20 blur-[120px]" />
        <div className="absolute top-[10%] right-[5%] w-125 h-125 rounded-full bg-blue-600/15 blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[40%] w-100 h-100 rounded-full bg-violet-600/10 blur-[80px]" />
      </div>
      {/* Fade-out overlay — copre grid + luci verso il basso */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-48"
        style={{
          background: "linear-gradient(to bottom, transparent 0%, var(--color-base-100) 100%)",
        }}
      />

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <span className="hero-reveal inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary mb-8" style={{ animationDelay: "0.05s" }}>
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          Currently in private beta
        </span>

        {/*
          Pure CSS ticker: niente JS, niente setTimeout, niente React state.
          5 parole × 2.8s ciascuna (2.4s pausa + 0.4s slide) = 14s totali.
          Ogni slot = 1.1em (line-height del h1).
          Il clone della prima parola alla fine rende il loop invisibile.
        */}
        <style>{`
          @keyframes heroFadeUp {
            from { opacity: 0; transform: translateY(36px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          .hero-reveal {
            opacity: 0;
            animation: heroFadeUp 1.1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
          @keyframes heroTicker {
            0%     { transform: translateY(0); }
            10%    { transform: translateY(0);      animation-timing-function: cubic-bezier(0.34,1.45,0.64,1); }
            13.3%  { transform: translateY(-1.3em); }
            23.3%  { transform: translateY(-1.3em); animation-timing-function: cubic-bezier(0.34,1.45,0.64,1); }
            26.7%  { transform: translateY(-2.6em); }
            36.7%  { transform: translateY(-2.6em); animation-timing-function: cubic-bezier(0.34,1.45,0.64,1); }
            40%    { transform: translateY(-3.9em); }
            50%    { transform: translateY(-3.9em); animation-timing-function: cubic-bezier(0.34,1.45,0.64,1); }
            53.3%  { transform: translateY(-5.2em); }
            63.3%  { transform: translateY(-5.2em); animation-timing-function: cubic-bezier(0.34,1.45,0.64,1); }
            66.7%  { transform: translateY(-6.5em); }
            100%   { transform: translateY(-6.5em); }
          }
        `}</style>
        <h1
          className="hero-reveal text-4xl sm:text-5xl lg:text-6xl font-extrabold text-base-content tracking-tight"
          style={{ lineHeight: 1.1, animationDelay: "0.18s" }}
        >
          <span className="block">Turn any video into</span>
          {/* Container: mostra solo 1 slot alla volta */}
          <span className="block overflow-hidden" style={{ height: "1.3em" }}>
            {/* Track: scorre verso l'alto via CSS */}
            <span
              style={{
                display: "block",
                animation: "heroTicker 14s linear infinite",
                willChange: "transform",
              }}
            >
              {TICKER_WORDS.map((word, i) => (
                <span
                  key={i}
                  className="block bg-linear-to-r from-purple-400 via-violet-400 to-blue-400 bg-clip-text text-transparent"
                  style={{ height: "1.3em", lineHeight: 1.3 }}
                >
                  {word}
                </span>
              ))}
            </span>
          </span>
        </h1>

        <p className="hero-reveal mt-6 text-lg text-base-content/50 max-w-xl mx-auto leading-relaxed" style={{ animationDelay: "0.32s" }}>
          AI finds the most engaging moments, creates clips, adds captions, and formats them — in seconds.
        </p>

        {/* Perfect for */}
        <div className="hero-reveal mt-8 flex items-center justify-center gap-3 text-sm text-base-content/40" style={{ animationDelay: "0.44s" }}>
          <span>Perfect for</span>
          <div className="flex items-center gap-3">
            <svg className="w-6 h-6 text-base-content/50 hover:text-red-500 transition-colors" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814ZM9.545 15.568V8.432L15.818 12l-6.273 3.568Z"/>
            </svg>
            <svg className="w-6 h-6 text-base-content/50 hover:text-pink-500 transition-colors" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069ZM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0Zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881Z"/>
            </svg>
            <svg className="w-5 h-5 text-base-content/50 hover:text-base-content transition-colors" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.73a8.19 8.19 0 0 0 4.76 1.52v-3.4a4.85 4.85 0 0 1-1-.16Z"/>
            </svg>
          </div>
        </div>

        <div className="hero-reveal mt-10 flex flex-col sm:flex-row items-center gap-4 justify-center" style={{ animationDelay: "0.54s" }}>
          <a href="/auth/signin" className="btn btn-primary btn-lg gap-2">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path fillRule="evenodd" d="M14.615 1.595a.75.75 0 0 1 .359.852L12.982 9.75h7.268a.75.75 0 0 1 .548 1.262l-10.5 11.25a.75.75 0 0 1-1.272-.71l1.992-7.302H3.818a.75.75 0 0 1-.548-1.262l10.5-11.25a.75.75 0 0 1 .845-.143Z" clipRule="evenodd" />
            </svg>
            Create your first video
          </a>
        </div>

        <p className="hero-reveal mt-4 text-xs text-base-content/30" style={{ animationDelay: "0.6s" }}>
          Get your generated video in less than 5 minutes.
        </p>

        <div className="hero-reveal mt-14 flex gap-10 justify-center" style={{ animationDelay: "0.72s" }}>
          {[
            { value: "2,400+", label: "Beta waitlist" },
            { value: "50K+", label: "Clips generated" },
            { value: "12x", label: "Faster editing" },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-2xl font-bold text-base-content">{s.value}</p>
              <p className="text-xs text-base-content/40 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
