import { useState, type FormEvent } from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { siteSearchQuerySchema } from '@/lib/demo-validation';

export function SearchField({ className = '' }: { className?: string }) {
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = siteSearchQuerySchema.safeParse(query);
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? 'Vui lòng nhập từ khóa cần tìm.');
      return;
    }
    setError('');
    void navigate({ to: '/tim-kiem', search: { q: result.data } });
  };
  return (
    <form
      onSubmit={submit}
      className={`flex w-full items-center gap-2 rounded-md border border-neutral-300 bg-background px-3 py-1 text-sm text-foreground transition-colors duration-200 focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-ring ${className}`}
    >
      <Search className="h-4 w-4 shrink-0 text-neutral-500" aria-hidden="true" />
      <input
        type="search"
        aria-label="Tìm kiếm toàn trang"
        value={query}
        maxLength={120}
        onChange={(event) => { setQuery(event.target.value.slice(0, 120)); setError(''); }}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? 'site-search-error' : undefined}
        placeholder="TÌM KIẾM"
        className="w-full min-w-0 bg-transparent placeholder:text-muted-foreground placeholder:uppercase focus:outline-none"
      />
      <Button type="submit" variant="ghost" size="icon" aria-label="Tìm kiếm" className="size-8 shrink-0">
        <Search className="size-4" aria-hidden="true" />
      </Button>
      {error && <span id="site-search-error" role="alert" className="sr-only">{error}</span>}
    </form>
  );
}
