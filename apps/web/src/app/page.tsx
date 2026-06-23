import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight">
          QHSSE Platform
        </h1>
        <p className="mb-8 text-lg text-muted-foreground">
          Quality, Health, Safety, Security & Environment — Integrated Management System
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/login"
            className="rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Sign In
          </Link>
          <Link
            href="/api/docs"
            className="rounded-md border border-input bg-background px-6 py-2.5 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
          >
            API Docs
          </Link>
        </div>
      </div>
    </div>
  );
}
