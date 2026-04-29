import { clsx } from '@/lib/cn';

const variants = {
  primary: 'bg-brand-600 text-white hover:bg-brand-700 shadow-sm',
  secondary: 'bg-white border border-slate-200 text-slate-800 hover:bg-slate-50',
  danger: 'bg-red-600 text-white hover:bg-red-700',
  ghost: 'text-slate-700 hover:bg-slate-100',
};

export function Button({ children, variant = 'primary', className = '', type = 'button', ...props }) {
  return (
    <button
      type={type}
      className={clsx(
        'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50',
        variants[variant] || variants.primary,
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
