'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Copy, KeyRound } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Field, Input } from '@/components/ui/input';
import { queryKeys } from '@/hooks/use-platform-queries';
import { platformService } from '@/services/platform-service';
import type { Camera } from '@/types/api';

const schema = z.object({
  name: z.string().min(1)
});

export function AgentRegistration({ camera }: { camera?: Camera }) {
  const [token, setToken] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { name: 'Local AI Agent' }
  });

  const mutation = useMutation({
    mutationFn: (values: z.infer<typeof schema>) => {
      if (!camera) throw new Error('Create a camera before registering an AI Agent.');
      return platformService.registerAgent({ cameraId: camera.id, name: values.name });
    },
    onSuccess: async (data) => {
      setToken(data.token);
      await queryClient.invalidateQueries({ queryKey: queryKeys.agents });
    }
  });

  return (
    <div className="space-y-4">
      <form className="space-y-4" onSubmit={form.handleSubmit((values) => mutation.mutate(values))}>
        <Field label="Agent name" error={form.formState.errors.name?.message}>
          <Input disabled={!camera} {...form.register('name')} />
        </Field>
        {mutation.error ? <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{mutation.error.message}</p> : null}
        <Button disabled={!camera || mutation.isPending}>
          <KeyRound className="h-4 w-4" />
          {mutation.isPending ? 'Registering' : 'Register AI Agent'}
        </Button>
      </form>

      {token ? (
        <div className="rounded-2xl bg-slate-950 p-4 text-white">
          <p className="text-sm font-medium">Agent token</p>
          <p className="mt-1 text-xs text-slate-400">This token is shown once. Store it in the local AI Agent configuration.</p>
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-white/10 p-3">
            <code className="min-w-0 flex-1 truncate text-xs">{token}</code>
            <button
              className="rounded-lg bg-white/10 p-2 text-white transition hover:bg-white/20"
              onClick={() => navigator.clipboard.writeText(token)}
            >
              <Copy className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
