import type { ReactNode } from 'react';

export const inputClass =
  'w-full rounded-md border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-800 transition-colors duration-200 placeholder:text-neutral-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100 aria-[invalid=true]:border-error-500';

interface FormFieldProps {
  id: string;
  label: string;
  required?: boolean;
  error?: string | undefined;
  children: ReactNode;
}

export function FormField({ id, label, required = false, error, children }: FormFieldProps) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-bold text-neutral-700">
        {label}
        {required && <span className="text-error-500"> *</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" className="text-sm text-error-600">
          {error}
        </p>
      )}
    </div>
  );
}
