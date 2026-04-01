import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#1F2020] text-white flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 sm:px-10 md:px-16 border-b border-white/10">
        <h1 className="text-2xl font-semibold tracking-tight">AI Assistant</h1>
        <Link href="/login">
          <button className="rounded-full bg-white text-black px-6 py-2 text-sm font-semibold hover:bg-white/90 transition-colors">
            Log in
          </button>
        </Link>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center sm:px-10">
        <div className="max-w-2xl space-y-6">
          <h2 className="text-5xl sm:text-6xl font-bold leading-tight tracking-tight">
            Welcome to Your AI Assistant
          </h2>
          
          <p className="text-lg text-white/70 leading-relaxed">
            A minimal, clean interface built for simplicity. Sign in to get started and unlock the power of AI.
          </p>

          <div className="pt-4">
            <Link href="/login">
              <button className="rounded-full bg-white text-black px-8 py-4 text-base font-semibold hover:bg-white/90 transition-all hover:shadow-lg">
                Get Started
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 px-6 py-4 text-center text-sm text-white/50 sm:px-10">
        <p>Designed for simplicity. Built to scale.</p>
      </footer>
    </main>
  );
}
