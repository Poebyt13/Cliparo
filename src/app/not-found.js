import Link from "next/link";
import Logo from "@/components/Logo";

export const metadata = {
  title: "Pagina non trovata",
};

/**
 * Pagina 404 personalizzata.
 * Next.js la mostra automaticamente quando un URL non corrisponde a nessuna route.
 */
export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-base-100 px-4 text-center">
      <Logo />
      <h1 className="mt-6 text-6xl font-bold text-base-content">404</h1>
      <p className="mt-3 text-lg text-base-content/60">
        La pagina che stai cercando non esiste o è stata spostata.
      </p>
      <div className="mt-8 flex gap-3">
        <Link href="/" className="btn btn-primary">
          Torna alla home
        </Link>
        <Link href="/dashboard" className="btn btn-ghost">
          Vai alla dashboard
        </Link>
      </div>
    </div>
  );
}
