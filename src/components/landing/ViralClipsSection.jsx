"use client";

import { DEMO_CLIPS } from "./data";
import { FEATURE_PILLS_ROW1, FEATURE_PILLS_ROW2 } from "./FeaturePills";

export default function ViralClipsSection() {
  return (
    <section className="py-20 sm:py-28 bg-base-100">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 mb-10">
        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold tracking-widest uppercase text-primary">
            Viral Clips
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-base-content leading-tight">
            AI-generated <span className="text-primary">viral clips</span>
          </h2>
          <p className="text-base-content/50 max-w-lg">
            Every clip below was extracted and formatted by clipFast AI from long-form content.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-reverse {
          0%   { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .marquee-track {
          animation: marquee 30s linear infinite;
          will-change: transform;
        }
        .marquee-track-reverse {
          animation: marquee-reverse 35s linear infinite;
          will-change: transform;
        }
      `}</style>

      {/* Carousel */}
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 sm:w-40 z-10 bg-linear-to-r from-base-100 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 sm:w-40 z-10 bg-linear-to-l from-base-100 to-transparent" />
        <div className="marquee-track flex gap-4 pb-4 pl-4" style={{ width: "max-content" }}>
          {[...DEMO_CLIPS, ...DEMO_CLIPS].map((clip, i) => (
            <div
              key={i}
              className="w-44 sm:w-52 shrink-0 rounded-2xl overflow-hidden bg-base-200 border border-base-300/50 group cursor-pointer hover:border-primary/30 transition-colors"
            >
              <div className={`aspect-9/14 bg-linear-to-br ${clip.gradient} relative`}>
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 bg-black/50 backdrop-blur-sm rounded-full px-2.5 py-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                  <span className="text-[10px] text-white font-medium">AI Generated</span>
                </div>
                <div className="absolute top-2.5 right-2.5 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1">
                  <span className="text-[10px] text-white/80">{clip.duration}</span>
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                    <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                  </div>
                </div>
              </div>
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

      {/* Feature pills */}
      <div className="mt-12 space-y-3">
        {[
          { pills: FEATURE_PILLS_ROW1, cls: "marquee-track" },
          { pills: FEATURE_PILLS_ROW2, cls: "marquee-track-reverse" },
        ].map(({ pills, cls }, idx) => (
          <div key={idx} className="relative overflow-hidden">
            <div className="pointer-events-none absolute inset-y-0 left-0 w-24 sm:w-40 z-10 bg-linear-to-r from-base-100 to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-24 sm:w-40 z-10 bg-linear-to-l from-base-100 to-transparent" />
            <div className={`${cls} flex gap-3`} style={{ width: "max-content" }}>
              {[...pills, ...pills, ...pills, ...pills].map((f, i) => (
                <div key={i} className="flex items-center gap-2.5 rounded-full border border-base-300/50 bg-base-200/80 px-5 py-2.5 shrink-0">
                  <span className="text-base-content/50">{f.icon}</span>
                  <span className="text-sm font-medium text-base-content/70 whitespace-nowrap">{f.label}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
