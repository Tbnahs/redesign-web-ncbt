import { useState, type FormEvent } from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';

export function SearchField({ className = '' }: { className?: string }) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = query.trim();
    if (!value) return;
    void navigate({ to: '/tin-tuc', search: { q: value } });
  };
  return (
    <form
      onSubmit={submit}
      className={`flex w-full items-center gap-2 rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-700 transition-colors duration-200 focus-within:border-primary-500 ${className}`}
    >
      <Search className="h-4 w-4 shrink-0 text-neutral-500" aria-hidden="true" />
      <input
        type="search"
        aria-label="Tìm kiếm tin tức"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="TÌM KIẾM"
        className="w-full min-w-0 bg-transparent placeholder:text-neutral-400 placeholder:uppercase focus:outline-none"
      />
    </form>
  );
}
