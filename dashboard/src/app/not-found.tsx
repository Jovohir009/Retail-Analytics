import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="max-w-md rounded-[1.5rem] bg-white p-10 text-center shadow-soft">
        <p className="text-sm font-medium text-primary-600">404</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-ink">Page not found</h1>
        <p className="mt-3 text-sm leading-6 text-muted">
          The page you opened is not part of this workspace or has moved.
        </p>
        <Button asChild href="/" className="mt-7">
            <ArrowLeft className="h-4 w-4" />
            Back to dashboard
        </Button>
      </div>
    </main>
  );
}
