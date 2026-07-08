'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Field, Input } from '@/components/ui/input';
import { authService } from '@/services/auth-service';

const schema = z
  .object({
    currentPassword: z.string().min(8),
    newPassword: z.string().min(8),
    confirmPassword: z.string().min(8)
  })
  .refine((value) => value.newPassword === value.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword']
  });

export function PasswordForm() {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' }
  });

  const mutation = useMutation({
    mutationFn: (values: z.infer<typeof schema>) =>
      authService.changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword
      }),
    onSuccess: () => form.reset()
  });

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit((values) => mutation.mutate(values))}>
      <Field label="Current password" error={form.formState.errors.currentPassword?.message}>
        <Input type="password" autoComplete="current-password" {...form.register('currentPassword')} />
      </Field>
      <Field label="New password" error={form.formState.errors.newPassword?.message}>
        <Input type="password" autoComplete="new-password" {...form.register('newPassword')} />
      </Field>
      <Field label="Confirm password" error={form.formState.errors.confirmPassword?.message}>
        <Input type="password" autoComplete="new-password" {...form.register('confirmPassword')} />
      </Field>
      {mutation.error ? <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{mutation.error.message}</p> : null}
      {mutation.isSuccess ? <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">Password updated.</p> : null}
      <Button disabled={mutation.isPending}>{mutation.isPending ? 'Updating' : 'Update password'}</Button>
    </form>
  );
}
