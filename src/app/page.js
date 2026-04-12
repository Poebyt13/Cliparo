"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Button from "@/components/Button";

// ── Navigazione ──
const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Results", href: "#results" },
];

// ── Clip demo per il carosello ──
const DEMO_CLIPS = [
  { title: "This entrepreneur from Saudi...", views: "2.3M views", duration: "0:42", gradient: "from-violet-600 to-blue-600" },
  { title: "Day 31, we've sold $4,000...", views: "890K views", duration: "0:38", gradient: "from-pink-600 to-purple-600" },
  { title: "I asked ChatGPT how to...", views: "4.1M views", duration: "0:55", gradient: "from-blue-600 to-cyan-500" },
  { title: "Dropshipping ain't dead, in...", views: "1.7M views", duration: "0:31", gradient: "from-purple-600 to-pink-600" },
  { title: "How to generate viral clips...", views: "3.2M views", duration: "0:48", gradient: "from-indigo-600 to-violet-600" },
  { title: "Stop wasting time editing...", views: "5.6M views", duration: "0:29", gradient: "from-fuchsia-600 to-purple-600" },
  { title: "This strategy changed every...", views: "2.8M views", duration: "0:44", gradient: "from-violet-500 to-indigo-600" },
];

// ── Step "How it works" ──
const STEPS = [
  {
    num: "01",
    title: "Upload your video",
    description: "Drop any long-form video — YouTube, podcast, interview.",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
      </svg>
    ),
    content: (
      <div className="mt-4 rounded-xl bg-base-100/50 border border-base-300/50 p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-base-300/50 flex items-center justify-center">
            <svg className="w-5 h-5 text-base-content/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
            </svg>
          </div>
          <div>
            <p className="text-sm text-base-content/70">podcast_ep13.mp4</p>
            <p className="text-xs text-base-content/40">1:24:32 · 2.1 GB</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    num: "02",
    title: "AI detects viral moments",
    description: "Our AI analyzes engagement patterns and extracts peaks.",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456Z" />
      </svg>
    ),
    content: (
      <div className="mt-4 space-y-2.5">
        {["Analyzing audio peaks", "Extracting hooks", "Finding emotional moments", "Scoring virality"].map((item) => (
          <div key={item} className="flex items-center gap-2.5">
            <svg className="w-4 h-4 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
            <span className="text-sm text-base-content/60">{item}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    num: "03",
    title: "Download your clips",
    description: "Get perfectly formatted, captioned TikTok-ready clips.",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
      </svg>
    ),
    content: (
      <div className="mt-4 flex gap-2">
        {["from-pink-500 to-purple-600", "from-green-400 to-cyan-500", "from-orange-400 to-red-500"].map((g, i) => (
          <div key={i} className={`flex-1 aspect-9/16 rounded-xl bg-linear-to-br ${g} opacity-80`} />
        ))}
      </div>
    ),
  },
];

// ── Features ──
const FEATURES = [
  {
    title: "AI viral moment detection",
    description: "Identifies hooks, emotional peaks, and high-engagement markers to automatically select the best clips.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
      </svg>
    ),
  },
  {
    title: "Auto-generated captions",
    description: "Accurate, stylized captions that boost watch time and accessibility across all platforms.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 0 1 1.037-.443 48.282 48.282 0 0 0 5.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
      </svg>
    ),
  },
  {
    title: "TikTok optimized formatting",
    description: "9:16 aspect ratio, perfect cropping, and platform-ready export for TikTok, Reels, and Shorts.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
      </svg>
    ),
  },
];

// ── Testimonials ──
const CREATORS = [
  {
    name: "Sarah Chen",
    handle: "@sarahcreates",
    verified: true,
    quote: "clipFast turned my 2-hour podcast into 17 viral clips. Insane.",
    stats: { views: "14.2M", clips: "47", reach: "2,400 views" },
    color: "from-violet-500 to-blue-500",
  },
  {
    name: "Jake Morrison",
    handle: "@jakebuilds",
    verified: true,
    quote: "I went from 6K to 150K followers in 3 weeks using clipFast clips.",
    stats: { views: "31.7M", clips: "89", reach: "6,100 views" },
    color: "from-orange-500 to-pink-500",
  },
  {
    name: "Luna Park",
    handle: "@lunafilms",
    verified: true,
    quote: "The AI captures moments I&apos;d always overlook. My engagement doubled.",
    stats: { views: "8.9M", clips: "24", reach: "1,800 views" },
    color: "from-emerald-500 to-teal-500",
  },
  {
    name: "Marcus Reed",
    handle: "@marcustalks",
    verified: true,
    quote: "Real time in my creative work. Nothing else comes close.",
    stats: { views: "22.4M", clips: "63", reach: "7,300 views" },
    color: "from-rose-500 to-purple-500",
  },
];

export default function Home() {
  const { data: session, status } = useSession();
  const [email, setEmail] = useState("");

  const navCta = status === "unauthenticated" ? { label: "Join beta", href: "/auth/signin" } : null;
  const navUserMenu = status === "authenticated"
    ? {
        label: session.user.email,
        image: session.user.image || null,
        links: [{ label: "Dashboard", href: "/dashboard" }],
        onLogout: () => signOut(),
      }
    : null;

  return (
    <div className="min-h-screen bg-base-100 flex flex-col">
      {/* ── Navbar ── */}
      <Navbar links={NAV_LINKS} cta={navCta} userMenu={navUserMenu} loading={status === "loading"} />

      {/* ══════════════════════════════════════════════════════════
          HERO SECTION
      ══════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden pt-20 pb-24 sm:pt-28 sm:pb-32">
        {/* Gradient blobs di sfondo */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-[-20%] left-[10%] w-150 h-150 rounded-full bg-purple-600/20 blur-[120px]" />
          <div className="absolute top-[10%] right-[5%] w-125 h-125 rounded-full bg-blue-600/15 blur-[100px]" />
          <div className="absolute bottom-[-10%] left-[40%] w-100 h-100 rounded-full bg-violet-600/10 blur-[80px]" />
        </div>

        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Currently in private beta
          </span>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-base-content leading-[1.1] tracking-tight">
            Turn any video into{" "}
            <span className="bg-linear-to-r from-purple-400 via-violet-400 to-blue-400 bg-clip-text text-transparent">
              viral TikTok clips
            </span>
          </h1>

          <p className="mt-6 text-lg text-base-content/50 max-w-xl mx-auto leading-relaxed">
            AI finds the most engaging moments, creates clips, adds captions, and formats them — in seconds.
          </p>

          {/* Perfect for */}
          <div className="mt-8 flex items-center justify-center gap-3 text-sm text-base-content/40">
            <span>Perfect for</span>
            <div className="flex items-center gap-3">
              {/* YouTube */}
              <svg className="w-6 h-6 text-base-content/50 hover:text-red-500 transition-colors" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814ZM9.545 15.568V8.432L15.818 12l-6.273 3.568Z"/>
              </svg>
              {/* Instagram */}
              <svg className="w-6 h-6 text-base-content/50 hover:text-pink-500 transition-colors" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069ZM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0Zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881Z"/>
              </svg>
              {/* TikTok */}
              <svg className="w-5 h-5 text-base-content/50 hover:text-base-content transition-colors" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.73a8.19 8.19 0 0 0 4.76 1.52v-3.4a4.85 4.85 0 0 1-1-.16Z"/>
              </svg>
            </div>
          </div>

          <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 justify-center">
            <Button label="⚡ Create your first video" href="/auth/signin" variant="primary" className="btn-lg" />
          </div>

          <p className="mt-4 text-xs text-base-content/30">
            Get your generated video in less than 5 minutes.
          </p>

          {/* Stats */}
          <div className="mt-14 flex gap-10 justify-center">
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

      {/* ══════════════════════════════════════════════════════════
          VIRAL CLIPS CAROUSEL
      ══════════════════════════════════════════════════════════ */}
      <section className="py-20 sm:py-28 bg-base-100">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
            <div>
              <p className="text-sm font-semibold tracking-widest uppercase text-primary mb-3">
                Viral Clips
              </p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-base-content leading-tight">
                AI-generated <span className="text-primary">viral clips</span>
              </h2>
              <p className="mt-3 text-base-content/50 max-w-lg">
                Every clip below was extracted and formatted by clipFast AI from long-form content.
              </p>
            </div>
            {/* Frecce navigazione */}
            <div className="flex gap-2">
              <button className="btn btn-circle btn-sm btn-ghost border border-base-300" aria-label="Previous">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                </svg>
              </button>
              <button className="btn btn-circle btn-sm btn-ghost border border-base-300" aria-label="Next">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Carosello orizzontale full-bleed */}
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-4 px-4 sm:px-8 pb-4" style={{ width: "max-content" }}>
            {DEMO_CLIPS.map((clip, i) => (
              <div
                key={i}
                className="w-44 sm:w-52 shrink-0 rounded-2xl overflow-hidden bg-base-200 border border-base-300/50 group cursor-pointer hover:border-primary/30 transition-colors"
              >
                {/* Thumb video con overlay */}
                <div className={`aspect-9/14 bg-linear-to-br ${clip.gradient} relative`}>
                  {/* Badge AI Generated */}
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 bg-black/50 backdrop-blur-sm rounded-full px-2.5 py-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                    <span className="text-[10px] text-white font-medium">AI Generated</span>
                  </div>
                  {/* Durata */}
                  <div className="absolute top-2.5 right-2.5 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1">
                    <span className="text-[10px] text-white/80">{clip.duration}</span>
                  </div>
                  {/* Play icon center */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                      <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                    </div>
                  </div>
                </div>
                {/* Info */}
                <div className="p-3">
                  <p className="text-xs text-base-content/70 line-clamp-2 leading-relaxed">{clip.title}</p>
                  <p className="text-[10px] text-base-content/30 mt-1.5">
                    <svg className="w-3 h-3 inline mr-1 -mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                    {clip.views}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════════════════════════════ */}
      <section id="how-it-works" className="py-20 sm:py-28 bg-base-200/50">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold tracking-widest uppercase text-primary mb-3">
              How it works
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-base-content leading-tight">
              Three steps to{" "}
              <span className="bg-linear-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                viral content
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {STEPS.map((step) => (
              <div
                key={step.num}
                className="rounded-2xl bg-base-200 border border-base-300/50 p-6 flex flex-col hover:border-primary/20 transition-colors"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    {step.icon}
                  </div>
                  <span className="text-xs font-mono text-base-content/30">Step {step.num}</span>
                </div>
                <h3 className="text-lg font-bold text-base-content mb-1">{step.title}</h3>
                <p className="text-sm text-base-content/50 leading-relaxed">{step.description}</p>
                {step.content}
              </div>
            ))}
          </div>

          {/* Indicatore progresso */}
          <div className="flex justify-center gap-1.5 mt-10">
            <div className="w-8 h-1 rounded-full bg-primary" />
            <div className="w-8 h-1 rounded-full bg-base-300" />
            <div className="w-8 h-1 rounded-full bg-base-300" />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          FEATURES
      ══════════════════════════════════════════════════════════ */}
      <section id="features" className="py-20 sm:py-28 bg-base-100">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold tracking-widest uppercase text-primary mb-3">
              Features
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-base-content leading-tight">
              Everything you need to{" "}
              <span className="text-primary">go viral</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {FEATURES.map((f) => (
              <div key={f.title} className="text-center flex flex-col items-center">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-5">
                  {f.icon}
                </div>
                <h3 className="text-lg font-bold text-base-content mb-2">{f.title}</h3>
                <p className="text-sm text-base-content/50 leading-relaxed max-w-xs">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          CREATOR RESULTS / TESTIMONIALS
      ══════════════════════════════════════════════════════════ */}
      <section id="results" className="py-20 sm:py-28 bg-base-200/50">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold tracking-widest uppercase text-primary mb-3">
              Creator Results
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-base-content leading-tight">
              Real creators.{" "}
              <span className="bg-linear-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
                Real results.
              </span>
            </h2>
            <p className="mt-4 text-base-content/50 max-w-lg mx-auto">
              Beta users are already seeing massive engagement from AI-generated clips.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-5 max-w-3xl mx-auto">
            {CREATORS.map((c) => (
              <div
                key={c.handle}
                className="rounded-2xl bg-base-200 border border-base-300/50 p-5 hover:border-primary/20 transition-colors"
              >
                {/* Header: avatar, nome, handle, badge */}
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-full bg-linear-to-br ${c.color} shrink-0 flex items-center justify-center text-white font-bold text-sm`}>
                    {c.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-sm text-base-content">{c.name}</span>
                      {c.verified && (
                        <svg className="w-3.5 h-3.5 text-primary shrink-0" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307Zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" />
                        </svg>
                      )}
                    </div>
                    <p className="text-xs text-base-content/40">{c.handle}</p>
                  </div>
                  <span className="badge badge-sm bg-primary/10 text-primary border-primary/20 text-[10px]">
                    ✓ Verified
                  </span>
                </div>

                {/* Citazione */}
                <p className="text-sm text-base-content/60 leading-relaxed mb-4">
                  &ldquo;{c.quote}&rdquo;
                </p>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 pt-3 border-t border-base-300/50">
                  <div className="text-center">
                    <p className="text-base font-bold text-base-content">{c.stats.views}</p>
                    <p className="text-[10px] text-base-content/30 mt-0.5">Total views</p>
                  </div>
                  <div className="text-center">
                    <p className="text-base font-bold text-base-content">{c.stats.clips}</p>
                    <p className="text-[10px] text-base-content/30 mt-0.5">Clips made</p>
                  </div>
                  <div className="text-center">
                    <p className="text-base font-bold text-base-content">{c.stats.reach}</p>
                    <p className="text-[10px] text-base-content/30 mt-0.5">Avg. views</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          CTA / WAITLIST
      ══════════════════════════════════════════════════════════ */}
      <section className="py-20 sm:py-28 bg-base-100 relative overflow-hidden">
        {/* Gradient blob di sfondo */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-[20%] left-[30%] w-100 h-100 rounded-full bg-purple-600/10 blur-[100px]" />
          <div className="absolute bottom-[10%] right-[20%] w-75 h-75 rounded-full bg-blue-600/10 blur-[80px]" />
        </div>

        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Limited beta spots
          </span>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-base-content leading-tight">
            Ready to go{" "}
            <span className="bg-linear-to-r from-purple-400 via-violet-400 to-blue-400 bg-clip-text text-transparent">
              viral
            </span>
            ?
          </h2>

          <p className="mt-5 text-base-content/50 text-lg max-w-md mx-auto">
            Join 2,400+ creators already on the waitlist. Get early access and start generating viral clips.
          </p>

          {/* Form email */}
          <form
            onSubmit={(e) => { e.preventDefault(); }}
            className="mt-10 flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              className="input w-full bg-base-200 border-base-300/50 focus:border-primary/50 placeholder:text-base-content/30"
              required
            />
            <button type="submit" className="btn btn-primary shrink-0 gap-2">
              Join waitlist
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </button>
          </form>

          <p className="mt-4 text-xs text-base-content/30">
            No spam, we promise. Unsubscribe anytime.
          </p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-base-300/50 bg-base-100">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-base-content">clipFast</span>
            <span className="text-xs text-base-content/30">AI-powered viral clips</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-base-content/40">
            <a href="/legal/privacy" className="hover:text-base-content transition-colors">Privacy</a>
            <a href="/legal/terms" className="hover:text-base-content transition-colors">Terms</a>
            <span>© {new Date().getFullYear()} clipFast</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
