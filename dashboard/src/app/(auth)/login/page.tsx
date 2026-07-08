'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, BarChart3 } from 'lucide-react';
import { authService } from '@/services/auth-service';
import { useAuthStore } from '@/store/auth-store';
import { Button } from '@/components/ui/button';
import { Field, Input } from '@/components/ui/input';
import { ApiError } from '@/lib/api-error';

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(8)
});

const authFormSchema = loginSchema.extend({
  name: z.string().optional(),
  storeName: z.string().optional()
});

type LoginValues = z.infer<typeof loginSchema>;
type AuthFormValues = z.infer<typeof authFormSchema>;

export default function LoginPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get('next') ?? '/';
  const { token, hasHydrated, setSession } = useAuthStore();

  const form = useForm<AuthFormValues>({
    resolver: zodResolver(authFormSchema),
    defaultValues: { email: '', password: '', name: '', storeName: '' }
  });

  useEffect(() => {
    if (hasHydrated && token) {
      router.replace(next);
    }
  }, [hasHydrated, next, router, token]);

  const mutation = useMutation({
    mutationFn: (values: AuthFormValues) => {
      if (mode === 'login') {
        return authService.login({ email: values.email, password: values.password } satisfies LoginValues);
      }
      if (!values.name || !values.storeName) {
        throw new Error('Name and store name are required.');
      }
      return authService.register({
        email: values.email,
        password: values.password,
        name: values.name,
        storeName: values.storeName
      });
    },
    onSuccess: (data) => {
      setSession(data.accessToken, data.user);
      router.replace(next);
    }
  });

  const error = mutation.error instanceof ApiError ? mutation.error.message : null;

  return (
    <main className="grid min-h-screen bg-canvas lg:grid-cols-[1.05fr_0.95fr]">
      <section className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="mb-10 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-600 text-sm font-semibold text-white shadow-card">
              RA
            </div>
            <div>
              <p className="text-sm font-semibold text-ink">Retail Analytics</p>
              <p className="text-xs text-muted">Customer dashboard</p>
            </div>
          </div>

          <div className="rounded-[1.75rem] bg-white p-8 shadow-soft ring-1 ring-slate-200/70">
            <div className="mb-8">
              <h1 className="text-2xl font-semibold tracking-tight text-ink">
                {mode === 'login' ? 'Welcome back' : 'Create your workspace'}
              </h1>
              <p className="mt-2 text-sm leading-6 text-muted">
                {mode === 'login'
                  ? 'Sign in to monitor visitor traffic, camera health, and synchronized analytics.'
                  : 'Create an account and store workspace for your first retail location.'}
              </p>
            </div>

            <form
              className="space-y-5"
              onSubmit={form.handleSubmit((values) => {
                if (mode === 'register' && !values.name) {
                  form.setError('name', { message: 'Name is required.' });
                  return;
                }
                if (mode === 'register' && !values.storeName) {
                  form.setError('storeName', { message: 'Store name is required.' });
                  return;
                }
                mutation.mutate(values);
              })}
            >
              {mode === 'register' ? (
                <>
                  <Field label="Your name" error={form.formState.errors.name?.message}>
                    <Input autoComplete="name" {...form.register('name')} />
                  </Field>
                  <Field label="Store name" error={form.formState.errors.storeName?.message}>
                    <Input autoComplete="organization" {...form.register('storeName')} />
                  </Field>
                </>
              ) : null}
              <Field label="Email" error={form.formState.errors.email?.message}>
                <Input autoComplete="email" type="email" {...form.register('email')} />
              </Field>
              <Field label="Password" error={form.formState.errors.password?.message}>
                <Input autoComplete={mode === 'login' ? 'current-password' : 'new-password'} type="password" {...form.register('password')} />
              </Field>
              {error ? <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p> : null}
              <Button className="w-full" disabled={mutation.isPending}>
                {mutation.isPending ? 'Please wait' : mode === 'login' ? 'Sign in' : 'Create account'}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>

            <button
              className="mt-6 w-full text-center text-sm font-medium text-primary-700"
              onClick={() => {
                setMode(mode === 'login' ? 'register' : 'login');
                form.clearErrors();
              }}
            >
              {mode === 'login' ? 'Create a new account' : 'Use an existing account'}
            </button>
          </div>
        </div>
      </section>

      <section className="hidden items-center justify-center bg-white px-10 lg:flex">
        <div className="w-full max-w-xl rounded-[2rem] bg-slate-950 p-8 text-white shadow-soft">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Live overview</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight">Traffic intelligence for one entrance</h2>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
              <BarChart3 className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-10 grid grid-cols-3 gap-3">
            {[
              ['Today', '1,284'],
              ['Peak', '17:00'],
              ['Sync', 'Online']
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl bg-white/10 p-4">
                <p className="text-xs text-slate-400">{label}</p>
                <p className="mt-2 text-xl font-semibold">{value}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 h-48 rounded-2xl bg-gradient-to-b from-primary-500/30 to-white/5 p-5">
            <div className="flex h-full items-end gap-2">
              {[34, 46, 38, 64, 58, 82, 71, 96, 74, 88, 62, 54].map((height, index) => (
                <div key={index} className="flex-1 rounded-t-lg bg-white/80" style={{ height: `${height}%` }} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
