import { Link } from '@tanstack/react-router';
import { ArrowRight, CircleCheck as CheckCircle2 } from 'lucide-react';
import { SectionLayout } from '@/components/common/SectionLayout';
import type { InfoPage } from '@/types/content';

interface ContentPageProps {
  page: InfoPage;
}

export function ContentPage({ page }: ContentPageProps) {
  return (
    <SectionLayout path={page.path} title={page.title}>
      <article className="space-y-10">
        <header className="space-y-4">
          <h1 className="border-l-4 border-primary-500 pl-4 text-2xl font-bold leading-tight text-navy-900 sm:text-3xl lg:text-4xl">
            {page.title}
          </h1>
          <p className="text-lg font-medium leading-relaxed text-navy-800">{page.summary}</p>
        </header>

        <div className="space-y-4 text-[15px] leading-relaxed text-neutral-700">
          {page.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        {page.benefits && page.benefits.length > 0 && (
          <section className="space-y-5">
            <h2 className="text-xl font-bold text-navy-900">Lợi ích</h2>
            <ul className="grid gap-4 sm:grid-cols-2">
              {page.benefits.map((benefit) => (
                <li
                  key={benefit}
                  className="flex items-start gap-3 rounded-xl border border-neutral-200 bg-white p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-md"
                >
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success-500" aria-hidden="true" />
                  <span className="text-sm leading-relaxed text-neutral-700">{benefit}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {page.steps && page.steps.length > 0 && (
          <section className="space-y-5">
            <h2 className="text-xl font-bold text-navy-900">Các bước thực hiện</h2>
            <ol className="space-y-4">
              {page.steps.map((step, index) => (
                <li key={step} className="flex items-start gap-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-500 text-sm font-bold text-white shadow-sm">
                    {index + 1}
                  </span>
                  <span className="pt-1.5 text-[15px] leading-relaxed text-neutral-700">{step}</span>
                </li>
              ))}
            </ol>
          </section>
        )}

        <div className="flex flex-col items-start gap-4 rounded-xl bg-navy-900 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div className="space-y-1">
            <p className="text-lg font-bold text-white">Bạn cần tư vấn về {page.title.toLowerCase()}?</p>
            <p className="text-sm text-navy-200">Liên hệ để được hướng dẫn chi tiết theo nhu cầu của doanh nghiệp.</p>
          </div>
          <Link
            to="/lien-he"
            className="group inline-flex shrink-0 items-center gap-2 rounded-md bg-primary-500 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-colors duration-200 hover:bg-primary-400 hover:text-white"
          >
            Liên hệ tư vấn
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </div>
      </article>
    </SectionLayout>
  );
}
