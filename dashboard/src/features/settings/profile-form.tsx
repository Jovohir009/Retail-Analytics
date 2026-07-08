'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Field, Input } from '@/components/ui/input';
import { authService } from '@/services/auth-service';
import { useAuthStore } from '@/store/auth-store';
import type { User } from '@/types/api';

const schema = z.object({
  name: z.string().min(1)
});

export function ProfileForm({ user }: { user?: User | null }) {
  const setUser = useAuthStore((state) => state.setUser);
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { name: user?.name ?? '' }
  });

  useEffect(() => {
    form.reset({ name: user?.name ?? '' });
  }, [form, user]);

  const mutation = useMutation({
    mutationFn: (values: z.infer<typeof schema>) => authService.updateProfile(values),
    onSuccess: (updatedUser) => {
      setUser(updatedUser);
    }
  });

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit((values) => mutation.mutate(values))}>
      <Field label="Name" error={form.formState.errors.name?.message}>
        <Input {...form.register('name')} />
      </Field>
      <Field label="Email">
        <Input value={user?.email ?? ''} disabled />
      </Field>
      {mutation.error ? <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{mutation.error.message}</p> : null}
      {mutation.isSuccess ? <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">Profile updated.</p> : null}
      <Button disabled={mutation.isPending}>{mutation.isPending ? 'Saving' : 'Save profile'}</Button>
    </form>
  );
}
