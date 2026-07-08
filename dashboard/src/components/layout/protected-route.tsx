'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { FullPageLoader } from '@/components/state/full-page-loader';
import { useAuthStore } from '@/store/auth-store';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { token, hasHydrated } = useAuthStore();

  useEffect(() => {
    if (hasHydrated && !token) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [hasHydrated, pathname, router, token]);

  if (!hasHydrated || !token) {
    return <FullPageLoader label="Checking session" />;
  }

  return children;
}
