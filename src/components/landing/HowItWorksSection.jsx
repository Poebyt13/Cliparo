"use client";

import { useState, useEffect, useRef, useCallback } from "react";

// ── Step data (contains JSX content, must stay in this file) ──
const STEPS = [
  {
    num: "01",
    title: "Drop your video",
    description: "Paste a YouTube link or upload a file. Podcasts, interviews, tutorials, talking-head content — anything works.",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
      </svg>
    ),
    content: (
      <div className="mt-4 flex flex-col gap-3 flex-1">
        <div className="rounded-lg overflow-hidden border border-base-300/30">
          <img src="/steps/add_video.png" alt="Podcast video" className="w-full h-auto object-cover" />
        </div>
        <div className="flex items-center justify-between mt-auto">
          <p className="text-sm text-base-content/70">podcast_ep13.mp4</p>
          <span className="text-xs text-base-content/40 bg-base-300/30 px-2 py-0.5 rounded">1.2 GB</span>
        </div>
        <div className="w-full h-1 rounded-full bg-base-300/50 overflow-hidden">
          <div className="h-full w-2/5 bg-primary rounded-full" />
        </div>
      </div>
    ),
  },
  {
    num: "02",
    title: "AI picks the viral moments",
    description: "Cliparo scans every second of your video and flags the hooks, emotional peaks, and high-retention moments — the ones people actually share.",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456Z" />
      </svg>
    ),
    content: (
      <div className="mt-3 flex flex-col gap-2 flex-1">
        {/* Waveform SVG */}
        <svg viewBox="0 0 320 48" className="w-full h-12" preserveAspectRatio="none">
          <defs>
            <linearGradient id="waveStroke" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.9" />
              <stop offset="60%" stopColor="#7c3aed" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#f97316" stopOpacity="0.9" />
            </linearGradient>
            <linearGradient id="waveFill" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.18" />
              <stop offset="60%" stopColor="#7c3aed" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#f97316" stopOpacity="0.18" />
            </linearGradient>
          </defs>
          <path d="M0,46 C8,42 15,36 25,30 C35,24 40,26 50,20 C60,14 65,18 75,14 C85,10 90,14 100,12 C110,10 115,16 125,14 C135,12 140,18 150,16 C160,14 165,10 175,12 C185,14 190,20 200,18 C210,16 215,12 225,14 C235,16 240,22 250,20 C260,18 268,22 278,26 C288,30 295,34 310,36 C315,37 318,38 320,39 L320,48 L0,48 Z"
            fill="url(#waveFill)" />
          <path d="M0,46 C8,42 15,36 25,30 C35,24 40,26 50,20 C60,14 65,18 75,14 C85,10 90,14 100,12 C110,10 115,16 125,14 C135,12 140,18 150,16 C160,14 165,10 175,12 C185,14 190,20 200,18 C210,16 215,12 225,14 C235,16 240,22 250,20 C260,18 268,22 278,26 C288,30 295,34 310,36 C315,37 318,38 320,39"
            fill="none" stroke="url(#waveStroke)" strokeWidth="1.8" strokeLinecap="round" />
        </svg>

        {/* Timeline ruler */}
        <div className="flex justify-between text-[9px] text-base-content/35 px-0.5 -mt-1">
          {["0","100","200","300","400","500","700"].map((t) => <span key={t}>{t}</span>)}
        </div>

        {/* Filmstrip + colored highlight boxes */}
        <div className="relative">
          <div className="flex h-21 rounded-md overflow-hidden border border-white/5">
            <div className="w-5 h-full flex flex-col justify-center items-center gap-0.5 shrink-0 bg-black/30">
              {[30,50,25,60,40,35,55,30].map((h, i) => (
                <div key={i} className="w-0.5 rounded-full bg-base-content/20" style={{ height: `${h}%` }} />
              ))}
            </div>
            <div className="flex flex-1 divide-x divide-white/5">
              {["/steps/download_01.png", "/steps/download_02.png", "/steps/download_03.png"].map((src, i) => (
                <div key={i} className="flex-1 overflow-hidden">
                  <img src={src} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <div className="w-5 h-full flex flex-col justify-center items-center gap-0.5 shrink-0 bg-black/30">
              {[25,55,35,45,60,30,50,25].map((h, i) => (
                <div key={i} className="w-0.5 rounded-full bg-base-content/20" style={{ height: `${h}%` }} />
              ))}
            </div>
          </div>

          <div className="absolute left-5 top-0 bottom-0 w-px bg-white/60" />

          {/* 3 colonne flex per allineare i box con i label sotto */}
          <div className="absolute inset-x-5 top-1 bottom-1.5 flex">
            {[
              { color: "#c026d3", borderCls: "border-fuchsia-500" },
              { color: "#10b981", borderCls: "border-emerald-400" },
              { color: "#f97316", borderCls: "border-orange-400" },
            ].map((c, i) => (
              <div key={i} className="flex-1 flex items-stretch px-[8%]">
                <div
                  className={`w-full border-2 rounded-xl ${c.borderCls} relative`}
                  style={{
                    background: `${c.color}55`,
                    boxShadow: `0 0 14px ${c.color}77`,
                  }}
                >
                  <div
                    className="absolute -bottom-2.25 left-1/2 -translate-x-1/2"
                    style={{
                      width: 0, height: 0,
                      borderLeft: "6px solid transparent",
                      borderRight: "6px solid transparent",
                      borderTop: `9px solid ${c.color}`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Labels row */}
        <div className="flex pt-3 pb-1 px-[5%]">
          {[
            {
              label: "hook",
              hexBg: "#6d28d920", hexBorder: "#c026d3", hexText: "#e879f9",
              icon: (
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3v13.5" />
                  <path d="M12 16.5c0 2.5-2 4.5-4 4.5s-4-1.5-4-3.5 2-3.5 4-3.5h1" />
                </svg>
              ),
            },
            {
              label: "retention",
              hexBg: "#06503420", hexBorder: "#10b981", hexText: "#34d399",
              icon: (
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                </svg>
              ),
            },
            {
              label: "viral",
              hexBg: "#7c1d0620", hexBorder: "#f97316", hexText: "#fb923c",
              icon: (
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path fillRule="evenodd" d="M14.615 1.595a.75.75 0 0 1 .359.852L12.982 9.75h7.268a.75.75 0 0 1 .548 1.262l-10.5 11.25a.75.75 0 0 1-1.272-.71l1.992-7.302H3.818a.75.75 0 0 1-.548-1.262l10.5-11.25a.75.75 0 0 1 .845-.143Z" clipRule="evenodd" />
                </svg>
              ),
            },
          ].map((item) => (
            <div key={item.label} className="flex-1 flex flex-col items-center gap-1.5">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center border"
                style={{ background: item.hexBg, borderColor: item.hexBorder, color: item.hexText }}
              >
                {item.icon}
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[11px] font-medium" style={{ color: item.hexText }}>{item.label}</span>
                <svg viewBox="0 0 28 10" className="w-6 h-2.5" fill="none">
                  <path d="M0,5 C4,2 7,8 11,5 C15,2 18,8 22,5 C24,3 26,4 28,5"
                    stroke={item.hexBorder} strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    num: "03",
    title: "Post in minutes, not hours",
    description: "Your clips come out captioned, cropped to 9:16, and ready to post. No editing, no exports, no wasted time.",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
      </svg>
    ),
    content: (
      <div className="mt-4 flex flex-col gap-3 flex-1">
        <div className="flex gap-2">
          {[
            { img: "/steps/download_01.png", label: "Clip 1: Hook", score: "9.2", border: "border-purple-500", bg: "bg-purple-500/10", text: "text-purple-400" },
            { img: "/steps/download_02.png", label: "Clip 2: Retention", score: "8.8", border: "border-emerald-400", bg: "bg-emerald-400/10", text: "text-emerald-400" },
            { img: "/steps/download_03.png", label: "Clip 3: Viral", score: "9.5", border: "border-orange-400", bg: "bg-orange-400/10", text: "text-orange-400" },
          ].map((clip) => (
            <div key={clip.label} className="flex-1 flex flex-col gap-1.5">
              <div className={`text-[10px] leading-tight ${clip.bg} ${clip.text} ${clip.border} border rounded-md px-1.5 py-1 text-center font-medium`}>
                {clip.label}<br />Score <span className="font-bold">{clip.score}</span>
              </div>
              <div className={`rounded-lg overflow-hidden border-2 ${clip.border}`}>
                <img src={clip.img} alt={clip.label} className="w-full aspect-9/16 object-cover" />
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-1.5 mt-auto">
          {[1, 2, 3].map((n) => (
            <div key={n} className="flex-1 flex flex-col items-center justify-center gap-0.5 text-[10px] text-base-content/50 bg-base-300/30 rounded-md py-1.5 px-1">
              <div className="flex items-center gap-1">
                <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                <span>Download</span>
              </div>
              <span className="text-base-content/30">MP4 (9:16) ›</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
];

// ── StepCard with mouse-follow glow ──
function StepCard({ step, isActive }) {
  const cardRef = useRef(null);
  const [glowPos, setGlowPos] = useState({ x: 0, y: 0, opacity: 0 });

  const handleMouseMove = useCallback((e) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    setGlowPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      opacity: 1,
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setGlowPos((prev) => ({ ...prev, opacity: 0 }));
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden rounded-2xl bg-base-200 border p-6 flex flex-col transition-all duration-700 ${
        isActive
          ? "border-primary/40 shadow-lg shadow-primary/5"
          : "border-base-300/50 hover:border-base-300"
      }`}
    >
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: glowPos.opacity * 0.07,
          background: `radial-gradient(600px circle at ${glowPos.x}px ${glowPos.y}px, oklch(62% 0.28 275), transparent 40%)`,
        }}
      />
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors duration-500 ${
            isActive ? "bg-primary/20 text-primary" : "bg-primary/10 text-primary"
          }`}>
            {step.icon}
          </div>
          <span className="text-xs font-mono text-base-content/30">Step {step.num}</span>
        </div>
        <h3 className="text-lg font-bold text-base-content mb-1">{step.title}</h3>
        <p className="text-sm text-base-content/50 leading-relaxed">{step.description}</p>
        {step.content}
      </div>
    </div>
  );
}

// ── Main section with auto-advance carousel ──
export default function HowItWorksSection() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % STEPS.length);
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="how-it-works" className="py-20 sm:py-28 relative">
      <div className="pointer-events-none absolute inset-0 hidden sm:block">
        <div className="absolute bottom-[5%] left-[5%] w-[500px] h-[500px] rounded-full bg-purple-600/12 blur-[140px]" />
      </div>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-sm font-semibold tracking-widest uppercase text-primary mb-3">
            How it works
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-base-content leading-tight">
            From raw video to{" "}
            <span className="bg-linear-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              ready-to-post clips
            </span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {STEPS.map((step, i) => (
            <StepCard key={step.num} step={step} isActive={i === activeStep} />
          ))}
        </div>

        <div className="flex justify-center gap-1.5 mt-10">
          {STEPS.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveStep(i)}
              className={`h-1 rounded-full transition-all duration-500 ${
                i === activeStep ? "w-8 bg-primary" : "w-8 bg-base-300 hover:bg-base-content/20"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
