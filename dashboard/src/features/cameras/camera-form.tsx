'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Field, Input, Select } from '@/components/ui/input';
import { queryKeys } from '@/hooks/use-platform-queries';
import { platformService } from '@/services/platform-service';
import type { Camera } from '@/types/api';

const schema = z.object({
  name: z.string().min(1),
  type: z.enum(['WEBCAM', 'RTSP', 'VIDEO_FILE'])
});

type CameraFormValues = z.infer<typeof schema>;

export function CameraForm({ camera }: { camera?: Camera }) {
  const queryClient = useQueryClient();
  const form = useForm<CameraFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: camera?.name ?? '', type: camera?.type ?? 'WEBCAM' }
  });

  useEffect(() => {
    form.reset({ name: camera?.name ?? '', type: camera?.type ?? 'WEBCAM' });
  }, [camera, form]);

  const mutation = useMutation({
    mutationFn: (values: CameraFormValues) =>
      camera ? platformService.updateCamera(camera.id, values) : platformService.createCamera(values),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.cameras });
    }
  });

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit((values) => mutation.mutate(values))}>
      <Field label="Camera name" error={form.formState.errors.name?.message}>
        <Input placeholder="Main Entrance Camera" {...form.register('name')} />
      </Field>
      <Field label="Camera type" error={form.formState.errors.type?.message}>
        <Select {...form.register('type')}>
          <option value="WEBCAM">Webcam</option>
          <option value="RTSP">RTSP camera</option>
          <option value="VIDEO_FILE">Video file</option>
        </Select>
      </Field>
      {mutation.error ? <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{mutation.error.message}</p> : null}
      {mutation.isSuccess ? <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">Camera saved successfully.</p> : null}
      <Button disabled={mutation.isPending}>{mutation.isPending ? 'Saving' : camera ? 'Save camera' : 'Create camera'}</Button>
    </form>
  );
}
