import { CircleCheck } from 'lucide-react';

interface FormSuccessProps {
  title: string;
  message: string;
  actionLabel: string;
  onReset: () => void;
}

export function FormSuccess({ title, message, actionLabel, onReset }: FormSuccessProps) {
  return (
    <div role="status" className="flex flex-col items-center gap-4 rounded-xl bg-success-50 p-8 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-success-100 text-success-600">
        <CircleCheck className="h-7 w-7" aria-hidden="true" />
      </span>
      <h2 className="text-xl font-bold text-navy-900">{title}</h2>
      <p className="max-w-md leading-relaxed text-neutral-700">{message}</p>
      <button
        type="button"
        onClick={onReset}
        className="mt-2 rounded-md bg-primary-500 px-5 py-2.5 text-sm font-bold text-white transition-colors duration-200 hover:bg-primary-600"
      >
        {actionLabel}
      </button>
    </div>
  );
}
