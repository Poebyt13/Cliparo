import { FEATURES } from "./data";

export default function FeaturesSection() {
  return (
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
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={f.iconPath} />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-base-content mb-2">{f.title}</h3>
              <p className="text-sm text-base-content/50 leading-relaxed max-w-xs">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
