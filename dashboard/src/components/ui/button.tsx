import Link from 'next/link';
import { ButtonHTMLAttributes, ComponentPropsWithoutRef } from 'react';
import { cn } from '@/lib/cn';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-primary-600 text-white shadow-sm hover:bg-primary-700',
  secondary: 'bg-white text-ink shadow-sm ring-1 ring-line hover:bg-slate-50',
  ghost: 'bg-transparent text-slate-600 hover:bg-slate-100 hover:text-ink',
  danger: 'bg-rose-600 text-white shadow-sm hover:bg-rose-700'
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  asChild?: false;
}

interface LinkButtonProps extends ComponentPropsWithoutRef<typeof Link> {
  variant?: ButtonVariant;
  asChild: true;
}

export function Button(props: ButtonProps | LinkButtonProps) {
  const className = cn(
    'inline-flex h-10 items-center justify-center gap-2 rounded-xl px-4 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60',
    variants[props.variant ?? 'primary'],
    props.className
  );

  if ('asChild' in props && props.asChild) {
    const { asChild: _asChild, variant: _variant, className: _className, ...linkProps } = props;
    return <Link className={className} {...linkProps} />;
  }

  const { variant: _variant, className: _className, ...buttonProps } = props;
  return <button className={className} {...buttonProps} />;
}
