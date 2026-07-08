import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="rounded-2xl bg-white p-8 text-center shadow-card ring-1 ring-rose-100">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
        <AlertCircle className="h-5 w-5" />
      </div>
      <h3 className="mt-4 text-sm font-semibold text-ink">Unable to load this data</h3>
      <p className="mt-2 text-sm text-muted">{message}</p>
      {onRetry ? (
        <Button className="mt-5" variant="secondary" onClick={onRetry}>
          Retry
        </Button>
      ) : null}
    </div>
  );
}
