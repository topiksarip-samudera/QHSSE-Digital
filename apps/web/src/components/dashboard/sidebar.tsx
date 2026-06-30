'use client';

import { ReactNode, useState, useCallback, memo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Command, LogOut, User, CreditCard, Bell } from 'lucide-react';
import { navigation, NavItem } from '@/lib/navigation';
import type { LucideIcon } from 'lucide-react';

interface SidebarProps {
  user: any;
  onLogout: () => void;
  isOpen: boolean;
}

function computeOpenGroups(pathname: string): Record<string, boolean> {
  const groups: Record<string, boolean> = {};
  for (const group of navigation) {
    for (const item of group.items) {
      if (item.children) {
        groups[item.name] = item.children.some((c) => pathname.startsWith(c.href));
      }
    }
  }
  return groups;
}

function NavGroupLabel({ label }: { label: string }) {
  return (
    <div className="flex h-8 items-center px-3 text-[11px] font-medium uppercase tracking-wider text-sidebar-foreground/60 mt-4 first:mt-0">
      {label}
    </div>
  );
}

const SidebarNavItem = memo(function SidebarNavItem({
  item,
  pathname,
  openGroups,
  onToggle,
}: {
  item: NavItem;
  pathname: string;
  openGroups: Record<string, boolean>;
  onToggle: (name: string) => void;
}) {
  if (!item.children) {
    const isActive = pathname === item.href ||
      (item.href !== '/dashboard' && pathname.startsWith(item.href));
    const Icon = item.icon;
    return (
      <Link
        href={item.href}
        className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors ${
          isActive
            ? 'bg-sidebar-accent text-sidebar-accent-foreground'
            : 'text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
        }`}
      >
        {Icon && <Icon className="size-4 shrink-0" />}
        <span className="truncate">{item.name}</span>
      </Link>
    );
  }

  const Icon = item.icon;
  const isGroupActive = item.children.some((c) => pathname.startsWith(c.href));
  const isOpen = openGroups[item.name];

  return (
    <div>
      <button
        onClick={() => onToggle(item.name)}
        className={`group/btn flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors ${
          isGroupActive
            ? 'bg-sidebar-accent text-sidebar-accent-foreground'
            : 'text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
        }`}
      >
        {Icon && <Icon className="size-4 shrink-0" />}
        <span className="truncate flex-1 text-left">{item.name}</span>
        <ChevronRight className={`size-3.5 shrink-0 text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`} />
      </button>
      {isOpen && (
        <div className="ml-4 mt-0.5 space-y-0.5 border-l border-sidebar-border pl-2.5">
          {item.children.map((child) => {
            const childActive = pathname.startsWith(child.href);
            return (
              <Link
                key={child.href}
                href={child.href}
                className={`flex items-center gap-2 rounded-md px-2.5 py-1.5 text-[13px] transition-colors ${
                  childActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                    : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground'
                }`}
              >
                {child.name}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
});

const SidebarNav = memo(function SidebarNav({
  pathname,
  openGroups,
  onToggle,
}: {
  pathname: string;
  openGroups: Record<string, boolean>;
  onToggle: (name: string) => void;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      {navigation.map((group) => (
        <div key={group.label}>
          <NavGroupLabel label={group.label} />
          <div className="space-y-0.5">
            {group.items.map((item) => (
              <SidebarNavItem
                key={item.name}
                item={item}
                pathname={pathname}
                openGroups={openGroups}
                onToggle={onToggle}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
});

function UserMenu({ user, onLogout }: { user: any; onLogout: () => void }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-2.5 rounded-lg p-2 text-left text-sm transition-colors hover:bg-sidebar-accent"
      >
        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-foreground text-primary-foreground text-xs font-semibold">
          {user?.firstName?.[0] || 'U'}
        </div>
        <div className="grid flex-1 text-left text-sm leading-tight min-w-0">
          <span className="truncate font-medium text-sidebar-foreground">
            {user ? `${user.firstName} ${user.lastName}` : 'User'}
          </span>
          <span className="truncate text-muted-foreground text-xs">
            {user?.email || ''}
          </span>
        </div>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute bottom-full left-0 mb-2 w-56 rounded-xl border border-border bg-popover p-1 shadow-lg z-50">
            <div className="flex items-center gap-2 px-2 py-1.5">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-foreground text-primary-foreground text-xs font-semibold">
                {user?.firstName?.[0] || 'U'}
              </div>
              <div className="grid flex-1 min-w-0">
                <span className="truncate text-sm font-medium text-popover-foreground">
                  {user ? `${user.firstName} ${user.lastName}` : 'User'}
                </span>
                <span className="truncate text-xs text-muted-foreground">{user?.email || ''}</span>
              </div>
            </div>
            <div className="my-1 h-px bg-border" />
            <button className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-sm text-popover-foreground hover:bg-accent transition-colors">
              <User className="size-4" /> Account
            </button>
            <button className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-sm text-popover-foreground hover:bg-accent transition-colors">
              <CreditCard className="size-4" /> Billing
            </button>
            <button className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-sm text-popover-foreground hover:bg-accent transition-colors">
              <Bell className="size-4" /> Notifications
            </button>
            <div className="my-1 h-px bg-border" />
            <button onClick={onLogout} className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors">
              <LogOut className="size-4" /> Sign out
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export function Sidebar({ user, onLogout, isOpen }: SidebarProps) {
  const pathname = usePathname();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => computeOpenGroups(pathname));

  const toggleGroup = useCallback((name: string) => {
    setOpenGroups((prev) => ({ ...prev, [name]: !prev[name] }));
  }, []);

  if (!isOpen) {
    return (
      <div className="flex flex-col items-center py-3 gap-3">
        <div className="flex size-7 items-center justify-center rounded-lg bg-foreground text-primary-foreground">
          <Command className="size-3.5" />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="sidebar-scroll flex-1 overflow-y-auto overflow-x-hidden px-2 pb-2">
        <SidebarNav pathname={pathname} openGroups={openGroups} onToggle={toggleGroup} />
      </div>

      <div className="shrink-0 border-t border-sidebar-border p-2">
        <UserMenu user={user} onLogout={onLogout} />
      </div>
    </>
  );
}
