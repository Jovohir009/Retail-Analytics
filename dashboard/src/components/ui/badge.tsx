import { cn } from '@/lib/cn';

const toneClasses = {
  green: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
  amber: 'bg-amber-50 text-amber-700 ring-amber-100',
  slate: 'bg-slate-100 text-slate-700 ring-slate-200',
  blue: 'bg-primary-50 text-primary-700 ring-primary-100',
  rose: 'bg-rose-50 text-rose-700 ring-rose-100'
};

export function Badge({
  children,
  tone = 'slate',
  className
}: {
  children: React.ReactNode;
  tone?: keyof typeof toneClasses;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1',
        toneClasses[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
