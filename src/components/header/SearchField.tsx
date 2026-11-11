import { useState, type FormEvent, type KeyboardEvent } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { siteSearchQuerySchema } from "@/lib/demo-validation";

export function SearchField({ className = "" }: { className?: string }) {
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const submit = (event?: FormEvent<HTMLFormElement> | KeyboardEvent<HTMLInputElement>) => {
    event?.preventDefault();

    const result = siteSearchQuerySchema.safeParse(query);
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "Vui lòng nhập từ khóa cần tìm.");
      return;
    }

    setError("");
    void navigate({ to: "/tim-kiem", search: { q: result.data } });
  };

  return (
    <form
      onSubmit={(event) => submit(event)}
      className={`flex min-w-0 flex-1 items-center gap-2 rounded-md border border-neutral-300 bg-background px-3 py-1 text-sm text-foreground transition-colors duration-200 focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-ring ${className}`}
    >
      <Search className="h-4 w-4 shrink-0 text-neutral-500" aria-hidden="true" />
      <input
        type="search"
        aria-label="Tìm kiếm toàn trang"
        value={query}
        maxLength={120}
        onChange={(event) => {
          setQuery(event.target.value.slice(0, 120));
          setError("");
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            submit(event);
          }
        }}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? "site-search-error" : undefined}
        placeholder="TÌM KIẾM"
        className="hidden w-full min-w-0 flex-1 bg-transparent placeholder:text-muted-foreground placeholder:uppercase focus:outline-none md:block"
      />
      <button
        type="submit"
        aria-label="Tìm kiếm"
        className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-sm text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-primary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
      >
        <Search className="h-4 w-4" aria-hidden="true" />
      </button>
      {error && (
        <span id="site-search-error" role="alert" className="sr-only">
          {error}
        </span>
      )}
    </form>
  );
}
