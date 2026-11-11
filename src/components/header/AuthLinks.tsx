import { useState } from 'react';

export function AuthLinks({ className = '' }: { className?: string }) {
  const [message, setMessage] = useState<string | null>(null);
  return (
    <div className={`flex items-center gap-2 text-sm font-medium text-neutral-700 whitespace-nowrap ${className}`}>
      <button
        type="button"
        onClick={() => setMessage('Đăng nhập chưa được kết nối trong bản dựng nguồn.')}
        className="rounded px-1 py-0.5 transition-colors duration-200 hover:text-primary-500"
      >
        ĐĂNG NHẬP
      </button>
      <span className="h-4 w-px bg-neutral-300" aria-hidden="true" />
      <button
        type="button"
        onClick={() => setMessage('Đăng ký chưa được kết nối trong bản dựng nguồn.')}
        className="rounded px-1 py-0.5 transition-colors duration-200 hover:text-primary-500"
      >
        ĐĂNG KÍ
      </button>
      {message && <span role="status" className="sr-only">{message}</span>}
    </div>
  );
}
