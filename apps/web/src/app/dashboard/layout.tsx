'use client';

import { ReactNode, useState, useEffect, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Sidebar } from '@/components/dashboard/sidebar';
import { DashboardHeader } from '@/components/dashboard/header';

interface DashboardLayoutProps {
  children: ReactNode;
}

const SIDEBAR_WIDTH = '17rem';

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) { router.push('/login'); return; }
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try { setUser(JSON.parse(storedUser)); } catch {}
    }
  }, [router]);

  useEffect(() => { setSidebarOpen(false); }, [pathname]);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    router.push('/login');
  }, [router]);

  const toggleSidebar = useCallback(() => setSidebarOpen(prev => !prev), []);

  return (
    <div className="flex h-screen overflow-hidden bg-sidebar">
      {/* Sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-20 bg-black/50 md:hidden" onClick={toggleSidebar} />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-30 flex flex-col bg-sidebar border-r border-sidebar-border transition-transform duration-200 md:static ${
        sidebarOpen ? 'w-[17rem] translate-x-0' : 'w-0 -translate-x-full md:w-[3rem] md:translate-x-0'
      }`}>
        <div className="flex h-12 shrink-0 items-center gap-2 border-b border-sidebar-border px-4">
          <div className="flex size-7 items-center justify-center rounded-lg bg-foreground text-primary-foreground">
            <span className="text-xs font-bold">Q</span>
          </div>
          <span className={`text-sm font-semibold text-foreground transition-opacity ${sidebarOpen ? 'opacity-100' : 'md:opacity-0 md:hidden'}`}>QHSSE</span>
        </div>
        <div className="flex-1 overflow-y-auto overflow-x-hidden sidebar-scroll">
          <Sidebar user={user} onLogout={handleLogout} isOpen={sidebarOpen} />
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden bg-background">
        <DashboardHeader onToggleSidebar={toggleSidebar} />
        <div className="flex-1 overflow-auto p-4 md:p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
