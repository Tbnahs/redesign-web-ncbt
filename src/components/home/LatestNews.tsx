import { Link } from "@tanstack/react-router";
import { Calendar } from "lucide-react";
import { SafeImage } from "@/components/common/SafeImage";
import { SectionHeading } from "@/components/common/SectionHeading";
import { formatDate } from "@/utils/date";
import { featuredArticle, allArticles } from "@/data/newsRepository";
import type { NewsArticle } from "@/types/content";

function FeaturedArticle({ article }: { article: NewsArticle }) {
  return (
    <Link
      to="/tin-tuc/$slug"
      params={{ slug: article.slug }}
      className="group relative block h-full min-h-[320px] overflow-hidden rounded-xl bg-navy-900 shadow-md sm:min-h-[420px]"
    >
      <SafeImage
        src={article.thumbnail}
        alt=""
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/70 to-navy-900/10" />
      <div className="absolute inset-x-0 bottom-0 space-y-3 p-6 sm:p-8">
        <p className="flex items-center gap-2 text-sm text-white/85">
          <Calendar className="h-4 w-4" aria-hidden="true" />
          {formatDate(article.date)}
        </p>
        <h3 className="text-xl font-bold leading-snug text-white transition-colors duration-200 group-hover:text-primary-200 sm:text-3xl">
          {article.title}
        </h3>
        <p className="line-clamp-2 text-sm leading-relaxed text-white/85 sm:text-base">
          {article.summary}
        </p>
      </div>
    </Link>
  );
}

function CompactArticle({ article }: { article: NewsArticle }) {
  return (
    <Link
      to="/tin-tuc/$slug"
      params={{ slug: article.slug }}
      className="group flex items-center gap-4 rounded-xl border border-neutral-200 bg-white p-3 transition-all duration-200 hover:border-primary-200 hover:shadow-md"
    >
      <SafeImage
        src={article.thumbnail}
        alt=""
        className="h-24 w-28 shrink-0 rounded-lg object-cover sm:w-36"
      />
      <div className="min-w-0 space-y-2">
        <h3 className="line-clamp-2 font-bold leading-snug text-navy-900 transition-colors duration-200 group-hover:text-primary-600">
          {article.title}
        </h3>
        <p className="flex items-center gap-2 text-sm text-neutral-500">
          <Calendar className="h-4 w-4" aria-hidden="true" />
          {formatDate(article.date)}
        </p>
      </div>
    </Link>
  );
}

export function LatestNews() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading title="Tin mới nhất" actionLabel="Xem tất cả" actionTo="/tin-tuc" />
      <div className="mt-8 grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <FeaturedArticle article={featuredArticle} />
        </div>
        <div className="flex flex-col gap-4 lg:col-span-2">
          {allArticles
            .filter((article) => article.id !== featuredArticle.id)
            .slice(0, 5)
            .map((article) => (
              <CompactArticle key={article.id} article={article} />
            ))}
        </div>
      </div>
    </section>
  );
}
