'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  BarChart3,
  Camera,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  UserCircle,
  X
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/cn';
import { useAuthStore } from '@/store/auth-store';
import { Button } from '@/components/ui/button';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/cameras', label: 'Camera', icon: Camera },
  { href: '/settings', label: 'Settings', icon: Settings },
  { href: '/profile', label: 'Profile', icon: UserCircle }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  return (
    <div className="min-h-screen bg-canvas">
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-72 transform bg-white/90 px-4 py-5 shadow-soft backdrop-blur-xl transition lg:translate-x-0 lg:shadow-none lg:ring-1 lg:ring-slate-200/70',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex items-center justify-between px-2">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-600 text-sm font-semibold text-white">
              RA
            </div>
            <div>
              <p className="text-sm font-semibold text-ink">Retail Analytics</p>
              <p className="text-xs text-muted">Platform</p>
            </div>
          </Link>
          <button className="rounded-xl p-2 text-slate-500 lg:hidden" onClick={() => setOpen(false)}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="mt-8 space-y-1">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition',
                  active
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-ink'
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute inset-x-4 bottom-5 rounded-2xl bg-slate-50 p-4">
          <p className="truncate text-sm font-medium text-ink">{user?.name ?? 'Store owner'}</p>
          <p className="mt-1 truncate text-xs text-muted">{user?.email}</p>
          <Button variant="ghost" className="mt-3 w-full justify-start px-3" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </aside>

      {open ? <div className="fixed inset-0 z-30 bg-slate-950/20 lg:hidden" onClick={() => setOpen(false)} /> : null}

      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-canvas/80 px-5 py-4 backdrop-blur-xl lg:px-8">
          <div className="flex items-center justify-between">
            <button className="rounded-xl bg-white p-2 text-slate-600 shadow-sm ring-1 ring-slate-200 lg:hidden" onClick={() => setOpen(true)}>
              <Menu className="h-5 w-5" />
            </button>
            <div className="hidden text-sm text-muted lg:block">
              Analytics update automatically from synchronized visitor events.
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden rounded-full bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm ring-1 ring-slate-200 sm:block">
                Secure cloud workspace
              </div>
            </div>
          </div>
        </header>
        <main className="px-5 py-8 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
