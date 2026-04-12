"use client";

import { useState } from "react";

export default function CtaSection() {
  const [email, setEmail] = useState("");

  return (
    <section className="py-20 sm:py-28 relative">
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
  );
}
