import { Badge } from '@/components/ui/badge';
import { statusLabel } from '@/lib/format';

export function StatusPill({ status }: { status: string | null | undefined }) {
  const tone =
    status === 'ONLINE' ? 'green' : status === 'SYNCHRONIZING' ? 'blue' : status ? 'amber' : 'slate';
  return <Badge tone={tone}>{statusLabel(status)}</Badge>;
}
