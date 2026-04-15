export default function LandingFooter() {
  return (
    <footer className="border-t border-base-300/50 bg-base-100">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-col gap-0.5">
          <span className="font-bold text-base-content">Cliparo</span>
          <span className="text-[11px] text-base-content/30 uppercase tracking-wide">© 2026 Cliparo. Tutti i diritti riservati.</span>
        </div>
        <div className="flex items-center gap-6 text-sm text-base-content/40">
          <a href="/legal/privacy" className="hover:text-base-content transition-colors">Privacy</a>
          <a href="/legal/terms" className="hover:text-base-content transition-colors">Terms</a>
          <span>© {new Date().getFullYear()} Cliparo</span>
        </div>
      </div>
    </footer>
  );
}
