'use client';

import { PanelLeft, Search, Settings2, Sun } from 'lucide-react';

interface DashboardHeaderProps {
  onToggleSidebar: () => void;
}

export function DashboardHeader({ onToggleSidebar }: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-12 shrink-0 items-center gap-2 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="flex w-full items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleSidebar}
            className="flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            title="Toggle Sidebar"
          >
            <PanelLeft className="size-4" />
          </button>
          <div className="hidden h-4 w-px bg-border sm:block" />
          <button className="hidden items-center gap-2 rounded-md bg-muted px-3 py-1.5 text-sm text-muted-foreground sm:flex hover:bg-accent hover:text-foreground transition-colors">
            <Search className="size-3.5" />
            <span>Search</span>
            <kbd className="pointer-events-none hidden h-5 select-none items-center gap-0.5 rounded border border-border bg-background px-1.5 font-mono text-[10px] font-medium opacity-60 sm:flex">
              ⌘J
            </kbd>
          </button>
        </div>
        <div className="flex items-center gap-1">
          <button className="flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground transition-colors" title="Settings">
            <Settings2 className="size-4" />
          </button>
          <button className="hidden size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground transition-colors sm:flex" title="Theme">
            <Sun className="size-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
