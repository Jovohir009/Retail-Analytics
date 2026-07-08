import { ApiError } from '@/lib/api-error';
import { useAuthStore } from '@/store/auth-store';
import type { ApiEnvelope } from '@/types/api';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '') ?? 'http://localhost:3000/api/v1';

interface RequestOptions extends RequestInit {
  authenticated?: boolean;
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const token = useAuthStore.getState().token;
  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');
  if (options.authenticated !== false && token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers
  });
  const payload = (await response.json().catch(() => null)) as ApiEnvelope<T> | null;

  if (!response.ok || !payload?.success) {
    const message = payload?.message ?? 'The request could not be completed.';
    const errors = payload && 'errors' in payload ? payload.errors : [];
    if (response.status === 401) {
      useAuthStore.getState().logout();
    }
    throw new ApiError(message, response.status, errors);
  }

  return payload.data;
}
