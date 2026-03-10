// Contenitore generico per centralizzare il layout delle pagine
export default function PageContainer({ children }) {
  return (
    <main className="min-h-screen bg-base-100">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        {children}
      </div>
    </main>
  );
}
