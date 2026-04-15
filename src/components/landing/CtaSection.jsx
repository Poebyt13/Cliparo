"use client";

import { useState, useCallback } from "react";
import confetti from "canvas-confetti";

function fireConfetti() {
  const end = Date.now() + 800;

  (function frame() {
    confetti({
      particleCount: 4,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.65 },
      colors: ["#a78bfa", "#818cf8", "#c084fc", "#60a5fa", "#f472b6"],
    });
    confetti({
      particleCount: 4,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.65 },
      colors: ["#a78bfa", "#818cf8", "#c084fc", "#60a5fa", "#f472b6"],
    });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}

export default function CtaSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error | duplicate

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setStatus("success");
        setEmail("");
        fireConfetti();
      } else if (res.status === 409) {
        setStatus("duplicate");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="waitlist" className="py-20 sm:py-28 relative">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] rounded-full bg-purple-600/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[10%] w-[400px] h-[400px] rounded-full bg-blue-600/18 blur-[100px]" />
        <div className="absolute top-[30%] right-[30%] w-64 h-64 rounded-full bg-violet-500/15 blur-[80px]" />
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

        <form
          onSubmit={handleSubmit}
          className="mt-10 flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            className="input w-full bg-base-200 border-base-300/50 focus:border-primary/50 focus:outline-none placeholder:text-base-content/30"
            required
            disabled={status === "loading" || status === "success"}
          />
          <button
            type="submit"
            className="btn btn-primary w-full sm:w-auto shrink-0 gap-2"
            disabled={status === "loading" || status === "success"}
          >
            {status === "loading" ? (
              <span className="loading loading-spinner loading-sm" />
            ) : status === "success" ? (
              "You're in! 🎉"
            ) : (
              <>
                Join waitlist
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </>
            )}
          </button>
        </form>

        <p className="mt-4 text-xs text-base-content/30">
          {status === "success"
            ? "Welcome aboard! Check your email for a confirmation from us."
            : status === "duplicate"
              ? "You're already on the list — we'll reach out soon!"
              : status === "error"
                ? "Something went wrong. Please try again."
                : "No spam, we promise. Unsubscribe anytime."}
        </p>
      </div>
    </section>
  );
}
