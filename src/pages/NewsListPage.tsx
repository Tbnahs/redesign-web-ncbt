import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from '@tanstack/react-router';
import { Calendar, Tag } from 'lucide-react';
import { SafeImage } from '@/components/common/SafeImage';
import { Pagination } from '@/components/common/Pagination';
import { getCategoryLabel, newsCategories } from '@/config/navigation';
import { allArticles } from '@/data/newsRepository';
import { formatDate } from '@/utils/date';
import type { NewsArticle } from '@/types/content';

const ITEMS_PER_PAGE = 6;

function NewsCard({ article }: { article: NewsArticle }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-primary-200 hover:shadow-lg">
      <Link to="/tin-tuc/$slug" params={{ slug: article.slug }} className="relative block aspect-[16/9] overflow-hidden">
        <SafeImage
          src={article.thumbnail}
          alt={article.title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded bg-primary-500 px-2.5 py-1 text-xs font-bold text-white shadow-sm">
          {getCategoryLabel(article.category)}
        </span>
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <p className="flex items-center gap-2 text-sm text-neutral-500">
          <Calendar className="h-4 w-4" aria-hidden="true" />
          {formatDate(article.date)}
        </p>
        <h3 className="text-lg font-bold leading-snug text-navy-900 transition-colors duration-200 group-hover:text-primary-600">
          <Link to="/tin-tuc/$slug" params={{ slug: article.slug }}>{article.title}</Link>
        </h3>
        <p className="line-clamp-3 flex-1 text-sm leading-relaxed text-neutral-600">{article.summary}</p>
        <Link
          to="/tin-tuc/$slug"
          params={{ slug: article.slug }}
          className="mt-1 text-sm font-bold text-primary-500 transition-colors duration-200 hover:text-primary-700"
        >
          Đọc tiếp &rarr;
        </Link>
      </div>
    </article>
  );
}

interface CategoryFilterProps {
  active: string | null;
  onChange: (category: string | null) => void;
}

function CategoryFilter({ active, onChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={() => onChange(null)}
        className={`rounded-full px-4 py-2 text-sm font-bold transition-colors duration-200 ${
          active === null
            ? 'bg-primary-500 text-white shadow-sm'
            : 'bg-white text-neutral-700 hover:bg-primary-50 hover:text-primary-600'
        }`}
      >
        Tất cả
      </button>
      {newsCategories.map((cat) => (
        <button
          key={cat.slug}
          type="button"
          onClick={() => onChange(cat.slug)}
          className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold transition-colors duration-200 ${
            active === cat.slug
              ? 'bg-primary-500 text-white shadow-sm'
              : 'bg-white text-neutral-700 hover:bg-primary-50 hover:text-primary-600'
          }`}
        >
          <Tag className="h-3.5 w-3.5" aria-hidden="true" />
          {cat.label}
        </button>
      ))}
    </div>
  );
}

interface NewsListPageProps {
  title: string;
  fixedCategory?: string;
  initialQuery?: string | undefined;
}

export function NewsListPage({ title, fixedCategory, initialQuery = '' }: NewsListPageProps) {
  const location = useLocation();
  const [query, setQuery] = useState(initialQuery);
  const [activeCategory, setActiveCategory] = useState<string | null>(fixedCategory ?? null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setQuery(initialQuery);
    setActiveCategory(fixedCategory ?? null);
    setCurrentPage(1);
  }, [fixedCategory, initialQuery, location.pathname]);

  const filtered = useMemo(() => {
    const base = fixedCategory
      ? allArticles.filter((a) => a.category === fixedCategory)
      : activeCategory
        ? allArticles.filter((a) => a.category === activeCategory)
        : allArticles;
    const keyword = query.trim().toLocaleLowerCase('vi');
    return [...base]
      .filter((article) => !keyword || `${article.title} ${article.summary}`.toLocaleLowerCase('vi').includes(keyword))
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [activeCategory, fixedCategory, query]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const pageItems = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleCategoryChange = (category: string | null) => {
    setActiveCategory(category);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center gap-2 text-sm text-neutral-500">
        <Link to="/" className="hover:text-primary-600">Trang chủ</Link>
        <span aria-hidden="true">/</span>
        <Link to="/tin-tuc" className="hover:text-primary-600">Tin tức</Link>
        {fixedCategory && (
          <>
            <span aria-hidden="true">/</span>
            <span className="text-navy-900">{getCategoryLabel(fixedCategory)}</span>
          </>
        )}
      </div>

      <h1 className="border-l-4 border-primary-500 pl-4 text-2xl font-bold text-navy-900 sm:text-3xl">{title}</h1>

      {!fixedCategory && (
        <div className="mt-6">
          <CategoryFilter active={activeCategory} onChange={handleCategoryChange} />
        </div>
      )}

      <label className="mt-6 flex max-w-xl items-center gap-3 rounded-md border border-neutral-300 bg-surface px-4 py-3 focus-within:border-primary-500">
        <span className="sr-only">Tìm kiếm bài viết</span>
        <input
          type="search"
          aria-label="Tìm kiếm bài viết"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setCurrentPage(1);
          }}
          placeholder="Tìm theo tiêu đề hoặc nội dung"
          className="min-w-0 flex-1 bg-transparent text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none"
        />
        {query && <button type="button" onClick={() => setQuery('')} className="text-sm font-bold text-primary-600">Xóa</button>}
      </label>

      {pageItems.length > 0 ? (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {pageItems.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <div className="mt-16 flex flex-col items-center gap-4 text-center">
          <p className="text-lg font-bold text-navy-900">Chưa có bài viết trong chuyên mục này</p>
          <p className="text-neutral-600">Vui lòng quay lại sau hoặc chọn chuyên mục khác.</p>
          {!fixedCategory && (
            <button
              type="button"
              onClick={() => handleCategoryChange(null)}
              className="rounded-md bg-primary-500 px-5 py-2.5 text-sm font-bold text-white transition-colors duration-200 hover:bg-primary-600"
            >
              Xem tất cả bài viết
            </button>
          )}
        </div>
      )}

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
    </section>
  );
}
