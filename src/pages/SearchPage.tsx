import { useMemo } from 'react';
import { Link } from '@tanstack/react-router';
import { ArrowRight, SearchX } from 'lucide-react';
import { searchSite } from '@/lib/site-search';
import { Route } from '@/routes/tim-kiem';

export function SearchPage() {
  const { q } = Route.useSearch();

  const groups = useMemo(() => searchSite(q ?? ''), [q]);
  const totalResults = groups.reduce((sum, group) => sum + group.results.length, 0);
  const hasResults = groups.some((group) => group.results.length > 0);

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary-600">Tìm kiếm</p>
        <h1 className="mt-3 text-2xl font-bold text-navy-900 sm:text-3xl">
          Kết quả cho: “{q || 'tất cả'}”
        </h1>
        <p className="mt-3 text-sm text-neutral-600">
          {hasResults
            ? `Tìm thấy ${totalResults} kết quả phù hợp trong ${groups.filter((group) => group.results.length > 0).length} nhóm.`
            : 'Không tìm thấy kết quả phù hợp với từ khóa này.'}
        </p>
      </div>

      {!hasResults ? (
        <div className="mt-8 rounded-2xl border border-dashed border-neutral-300 bg-white p-10 text-center">
          <SearchX className="mx-auto h-12 w-12 text-neutral-400" aria-hidden="true" />
          <h2 className="mt-4 text-xl font-bold text-navy-900">Không có kết quả phù hợp</h2>
          <p className="mt-2 text-neutral-600">
            Hãy thử từ khóa khác hoặc quay lại trang tin tức để xem các bài mới nhất.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link
              to="/tin-tuc"
              className="inline-flex items-center gap-2 rounded-md bg-primary-500 px-5 py-2.5 text-sm font-bold text-white transition-colors duration-200 hover:bg-primary-600"
            >
              Xem tin tức
            </Link>
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-md border border-neutral-300 bg-white px-5 py-2.5 text-sm font-bold text-navy-900 transition-colors duration-200 hover:bg-primary-50"
            >
              Về trang chủ
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {groups
            .filter((group) => group.results.length > 0)
            .map((group) => (
              <div key={group.key} className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center justify-between gap-3 border-b border-neutral-200 pb-3">
                  <h2 className="text-lg font-bold text-navy-900">{group.title}</h2>
                  <span className="inline-flex min-w-8 items-center justify-center rounded-full bg-primary-50 px-2 py-1 text-xs font-bold text-primary-700">
                    {group.results.length}
                  </span>
                </div>

                <ul className="space-y-3">
                  {group.results.map((result) => {
                    const content = (
                      <>
                        <p className="font-bold text-navy-900 hover:text-primary-600">{result.title}</p>
                        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-neutral-600">{result.detail}</p>
                        <span className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-primary-600">
                          Xem chi tiết
                          <ArrowRight className="h-4 w-4" aria-hidden="true" />
                        </span>
                      </>
                    );

                    if (group.key === 'news' && result.slug) {
                      return (
                        <li key={result.id} className="rounded-lg border border-neutral-200 bg-neutral-50 p-3 transition-colors duration-200 hover:border-primary-200 hover:bg-primary-50/30">
                          <Link to="/tin-tuc/$slug" params={{ slug: result.slug }} className="block">
                            {content}
                          </Link>
                        </li>
                      );
                    }

                    return (
                      <li key={result.id} className="rounded-lg border border-neutral-200 bg-neutral-50 p-3 transition-colors duration-200 hover:border-primary-200 hover:bg-primary-50/30">
                        <Link to={group.href} className="block">
                          {content}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
        </div>
      )}
    </section>
  );
}
