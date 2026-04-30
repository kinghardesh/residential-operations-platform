import { clsx } from '@/lib/cn';

export function FormInput({ label, error, className = '', id, ...props }) {
  const inputId = id || (label && `field-${label.replace(/\s+/g, '-').toLowerCase()}`);
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={clsx(
          'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-brand-500 focus:border-brand-300 focus:ring-2',
          error && 'border-red-300 focus:border-red-400 focus:ring-red-200',
          className
        )}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

export function FormTextarea({ label, error, className = '', id, ...props }) {
  const inputId = id || (label && `field-${label.replace(/\s+/g, '-').toLowerCase()}`);
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        className={clsx(
          'min-h-[100px] w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-brand-500 focus:border-brand-300 focus:ring-2',
          error && 'border-red-300',
          className
        )}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
