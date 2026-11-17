import { useId, useState, type FormEvent } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { siteSearchQuerySchema } from "@/lib/demo-validation";
import { useLocale } from "@/i18n";
export function SearchField({ className = "" }: { className?: string }) {
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const errorId = useId();
  const { locale } = useLocale();
  const vi = locale === "vi";
  const navigate = useNavigate();
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = siteSearchQuerySchema.safeParse(query);
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "Vui lòng nhập từ khóa cần tìm.");
      return;
    }
    setError("");
    void navigate({ to: "/tim-kiem", search: { q: result.data } });
  };
  return (
    <form role="search" onSubmit={submit} className={`source-search-field ${className}`}>
      <button type="submit" aria-label={vi ? "Tìm kiếm" : "Search"}>
        <Search size={15} aria-hidden="true" />
      </button>
      <input
        type="search"
        aria-label={vi ? "Tìm kiếm theo tiêu đề" : "Search by title"}
        value={query}
        maxLength={120}
        onChange={(event) => {
          setQuery(event.target.value.slice(0, 120));
          setError("");
        }}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        placeholder={vi ? "Tìm kiếm" : "Search"}
      />
      {error && (
        <span id={errorId} role="alert" className="sr-only">
          {error}
        </span>
      )}
    </form>
  );
}
