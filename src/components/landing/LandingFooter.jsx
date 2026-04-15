import Logo from "@/components/Logo";

export default function LandingFooter() {
  return (
    <footer className="border-t border-base-300/50 bg-base-100">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 flex flex-col items-center gap-5 sm:flex-row sm:items-start sm:justify-between">
        {/* Logo + copyright */}
        <div className="flex flex-col items-center sm:items-start gap-1.5">
          <Logo size="md" />
          <span className="text-[11px] text-base-content/30 uppercase tracking-wide">
            © {new Date().getFullYear()} Cliparo. All rights reserved.
          </span>
        </div>

        {/* Links */}
        <div className="flex items-center gap-6 text-sm text-base-content/40">
          <a href="/legal/privacy" className="hover:text-base-content transition-colors">Privacy</a>
          <a href="/legal/terms" className="hover:text-base-content transition-colors">Terms</a>
        </div>
      </div>
    </footer>
  );
}
