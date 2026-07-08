'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Field, Input, Select, Textarea } from '@/components/ui/input';
import { TIME_ZONES } from '@/constants/options';
import { queryKeys } from '@/hooks/use-platform-queries';
import { platformService } from '@/services/platform-service';
import type { Store } from '@/types/api';

const schema = z.object({
  name: z.string().min(1),
  address: z.string().optional(),
  timeZone: z.string().min(1)
});

export function StoreSettingsForm({ store }: { store?: Store }) {
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', address: '', timeZone: 'UTC' }
  });

  useEffect(() => {
    if (store) {
      form.reset({ name: store.name, address: store.address ?? '', timeZone: store.timeZone });
    }
  }, [form, store]);

  const mutation = useMutation({
    mutationFn: (values: z.infer<typeof schema>) => platformService.updateStore(values),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.store });
    }
  });

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit((values) => mutation.mutate(values))}>
      <Field label="Store name" error={form.formState.errors.name?.message}>
        <Input {...form.register('name')} />
      </Field>
      <Field label="Address" error={form.formState.errors.address?.message}>
        <Textarea {...form.register('address')} />
      </Field>
      <Field label="Timezone" error={form.formState.errors.timeZone?.message}>
        <Select {...form.register('timeZone')}>
          {TIME_ZONES.map((zone) => (
            <option key={zone} value={zone}>
              {zone}
            </option>
          ))}
        </Select>
      </Field>
      {mutation.error ? <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{mutation.error.message}</p> : null}
      {mutation.isSuccess ? <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">Store settings updated.</p> : null}
      <Button disabled={mutation.isPending || !store}>{mutation.isPending ? 'Saving' : 'Save store'}</Button>
    </form>
  );
}
