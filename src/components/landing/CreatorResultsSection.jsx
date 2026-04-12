import { CREATORS } from "./data";

export default function CreatorResultsSection() {
  return (
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

              <p className="text-sm text-base-content/60 leading-relaxed mb-4">
                &ldquo;{c.quote}&rdquo;
              </p>

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
  );
}
