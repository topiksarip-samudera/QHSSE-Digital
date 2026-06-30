import { Suspense } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Shield, CheckCircle, FileCheck, AlertTriangle, Users, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui';

// Lazy load heavy components
const FeatureGrid = dynamic(() => import('@/components/home/feature-grid'), {
  loading: () => <div className="h-96 bg-muted/30 animate-pulse rounded-xl" />,
});

const StatsSection = dynamic(() => import('@/components/home/stats-section'), {
  loading: () => <div className="h-48 bg-muted/30 animate-pulse rounded-xl" />,
});

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section - Critical Path */}
      <section className="relative flex flex-1 items-center justify-center px-4 py-20 sm:px-6 lg:px-8">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground shadow-sm">
            <Shield className="size-4 text-primary" />
            <span>Integrated Management System</span>
          </div>

          <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            QHSSE Platform
          </h1>
          
          <p className="mb-4 text-xl font-medium text-foreground/90 sm:text-2xl">
            Quality, Health, Safety, Security & Environment
          </p>
          
          <p className="mx-auto mb-10 max-w-2xl text-base text-muted-foreground sm:text-lg">
            Comprehensive management system designed to streamline your QHSSE operations, 
            enhance compliance, and drive continuous improvement across your organization.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/login">
              <Button size="lg" className="min-w-[160px]">
                Sign In
              </Button>
            </Link>
            <Link href="/api/docs">
              <Button size="lg" variant="outline" className="min-w-[160px]">
                API Documentation
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features - Lazy Loaded */}
      <Suspense fallback={<div className="h-96 bg-muted/30 animate-pulse" />}>
        <FeatureGrid />
      </Suspense>

      {/* Stats - Lazy Loaded */}
      <Suspense fallback={<div className="h-48 bg-muted/30 animate-pulse" />}>
        <StatsSection />
      </Suspense>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/20 px-4 py-8">
        <div className="mx-auto max-w-6xl text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} QHSSE Platform. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
