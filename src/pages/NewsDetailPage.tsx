import { useEffect } from 'react';
import { Link } from '@tanstack/react-router';
import { Calendar, ChevronRight, Facebook, Link2, Printer, Twitter } from 'lucide-react';
import { SafeImage } from '@/components/common/SafeImage';
import { getCategoryLabel } from '@/config/navigation';
import { getArticleBySlug, getRecentArticles } from '@/data/newsRepository';
import { formatDate, formatDateLong } from '@/utils/date';

function Breadcrumbs({ category, title }: { category: string; title: string }) {
  return (
    <nav aria-label="Đường dẫn" className="flex flex-wrap items-center gap-1.5 text-sm text-neutral-500">
      <Link to="/" className="hover:text-primary-600">Trang chủ</Link>
      <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
      <Link to="/tin-tuc" className="hover:text-primary-600">Tin tức</Link>
      <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
      <Link to="/tin-tuc/$slug" params={{ slug: category }} className="hover:text-primary-600">
        {getCategoryLabel(category)}
      </Link>
      <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
      <span className="line-clamp-1 text-navy-900">{title}</span>
    </nav>
  );
}

function ShareBar({ title }: { title: string }) {
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = encodeURIComponent(title);

  const links = [
    {
      label: 'Facebook',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      icon: Facebook,
    },
    {
      label: 'Twitter',
      href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${shareText}`,
      icon: Twitter,
    },
  ];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-sm font-bold text-neutral-700">Chia sẻ:</span>
      {links.map(({ label, href, icon: Icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Chia sẻ qua ${label}`}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-50 text-primary-600 transition-colors duration-200 hover:bg-primary-500 hover:text-white"
        >
          <Icon className="h-4 w-4" aria-hidden="true" />
        </a>
      ))}
      <button
        type="button"
        onClick={handleCopy}
        aria-label="Sao chép đường link"
        className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-50 text-primary-600 transition-colors duration-200 hover:bg-primary-500 hover:text-white"
      >
        <Link2 className="h-4 w-4" aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={() => window.print()}
        aria-label="In bài viết"
        className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-50 text-primary-600 transition-colors duration-200 hover:bg-primary-500 hover:text-white"
      >
        <Printer className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}

function RecentArticles() {
  const recent = getRecentArticles(5);

  return (
    <aside className="space-y-4">
      <h2 className="border-l-4 border-primary-500 pl-3 text-lg font-bold text-navy-900">Bài viết mới</h2>
      <ol className="space-y-3">
        {recent.map((article, index) => (
          <li key={article.id}>
            <Link
              to="/tin-tuc/$slug"
              params={{ slug: article.slug }}
              className="group flex items-start gap-3 rounded-lg p-2 transition-colors duration-200 hover:bg-primary-50"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary-500 text-sm font-bold text-white">
                {index + 1}
              </span>
              <span className="min-w-0">
                <span className="line-clamp-2 text-sm font-bold leading-snug text-navy-900 transition-colors duration-200 group-hover:text-primary-600">
                  {article.title}
                </span>
                <span className="mt-1 flex items-center gap-1.5 text-xs text-neutral-500">
                  <Calendar className="h-3 w-3" aria-hidden="true" />
                  {formatDate(article.date)}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </aside>
  );
}

export function NewsDetailPage({ slug }: { slug: string }) {
  const article = getArticleBySlug(slug);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [slug]);

  if (!article) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-navy-900">Không tìm thấy bài viết</h1>
        <p className="mt-3 text-neutral-600">Bài viết bạn tìm kiếm không tồn tại hoặc đã bị di chuyển.</p>
        <Link
          to="/tin-tuc"
          className="mt-6 inline-block rounded-md bg-primary-500 px-5 py-2.5 text-sm font-bold text-white transition-colors duration-200 hover:bg-primary-600"
        >
          Về trang tin tức
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Breadcrumbs category={article.category} title={article.title} />

      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-3">
        <article className="lg:col-span-2">
          <div className="space-y-4">
            <span className="inline-block rounded bg-primary-50 px-3 py-1 text-xs font-bold text-primary-700">
              {getCategoryLabel(article.category)}
            </span>
            <h1 className="text-2xl font-bold leading-tight text-navy-900 sm:text-3xl lg:text-4xl">
              {article.title}
            </h1>
            <p className="flex items-center gap-2 text-sm text-neutral-500">
              <Calendar className="h-4 w-4" aria-hidden="true" />
              {formatDateLong(article.date)}
            </p>
          </div>

          <div className="mt-6 overflow-hidden rounded-xl">
            <SafeImage src={article.thumbnail} alt={article.title} className="w-full object-cover" />
          </div>

          <div className="mt-6 space-y-4">
            <p className="text-lg font-medium leading-relaxed text-navy-800">{article.summary}</p>
            <div
              className="prose-news space-y-4 text-[15px] leading-relaxed text-neutral-700"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </div>

          <div className="mt-8 border-t border-neutral-200 pt-6">
            <ShareBar title={article.title} />
          </div>
        </article>

        <div className="lg:col-span-1">
          <div className="sticky top-28 space-y-6">
            <RecentArticles />
            <div className="rounded-xl bg-primary-50 p-5">
              <h2 className="text-base font-bold text-navy-900">Theo dõi tin tức</h2>
              <p className="mt-2 text-sm text-neutral-600">
                Nhận thông báo khi có bài viết mới về mã số mã vạch và truy xuất nguồn gốc.
              </p>
              <Link
                to="/tin-tuc"
                className="mt-4 inline-flex items-center gap-2 rounded-md bg-primary-500 px-4 py-2 text-sm font-bold text-white transition-colors duration-200 hover:bg-primary-600"
              >
                Xem tất cả tin
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
