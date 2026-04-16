"use client";

import { useState, useRef, useEffect } from "react";
import { DEMO_CLIPS } from "./data";
import { FEATURE_PILLS_ROW1, FEATURE_PILLS_ROW2 } from "./FeaturePills";

function VideoCard({ clip }) {
  const [muted, setMuted] = useState(true);
  const videoRef = useRef(null);
  const cardRef = useRef(null);

  // Lazy: carica e avvia il video solo quando la card è visibile
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        const video = videoRef.current;
        if (!video) return;
        if (entry.isIntersecting) {
          if (!video.src) video.src = clip.src;
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [clip.src]);

  const toggleMute = (e) => {
    e.stopPropagation();
    const newMuted = !muted;
    setMuted(newMuted);
    if (videoRef.current) {
      videoRef.current.muted = newMuted;
      videoRef.current.pause();
      videoRef.current.play().catch(() => {});
    }
  };

  return (
    <div ref={cardRef} className="w-44 sm:w-52 shrink-0 rounded-2xl overflow-hidden border border-base-300/50 group">
      <div className="aspect-9/16 bg-black relative">
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          muted
          loop
          playsInline
          preload="none"
        />
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 bg-black/50 backdrop-blur-sm rounded-full px-2.5 py-1">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
          <span className="text-[10px] text-white font-medium">AI Generated</span>
        </div>
        <button
          onClick={toggleMute}
          className="absolute top-2.5 right-2.5 w-7 h-7 flex items-center justify-center bg-black/50 backdrop-blur-sm rounded-full text-white hover:bg-black/70 transition-colors"
        >
          {muted ? (
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 0 0 1.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06ZM17.78 9.22a.75.75 0 1 0-1.06 1.06L18.44 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L19.5 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L20.56 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L19.5 10.94l-1.72-1.72Z" />
            </svg>
          ) : (
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 0 0 1.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06ZM18.584 5.106a.75.75 0 0 1 1.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 0 1-1.06-1.06 8.25 8.25 0 0 0 0-11.668.75.75 0 0 1 0-1.06Z" />
              <path d="M15.932 7.757a.75.75 0 0 1 1.061 0 6 6 0 0 1 0 8.486.75.75 0 0 1-1.06-1.061 4.5 4.5 0 0 0 0-6.364.75.75 0 0 1 0-1.06Z" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}

export default function ViralClipsSection() {
  return (
    <section id="features" className="py-20 sm:py-28 relative">
      <div className="pointer-events-none absolute inset-0 hidden sm:block">
        <div className="absolute top-[-10%] right-[5%] w-96 h-96 rounded-full bg-blue-600/12 blur-[130px]" />
      </div>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 mb-10">
        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold tracking-widest uppercase text-primary">
            Output
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-base-content leading-tight">
            Real clips. <span className="text-primary">Real results.</span>
          </h2>
          <p className="text-base-content/50 max-w-lg">
            Every clip below was automatically extracted by Cliparo — no editor, no timeline, no effort.
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
            <VideoCard key={i} clip={clip} />
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
