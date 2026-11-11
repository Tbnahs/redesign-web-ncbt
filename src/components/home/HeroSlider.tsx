import { useEffect, useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { SafeImage } from '@/components/common/SafeImage';
import banners from '@/data/banners.json';
import type { Banner } from '@/types/content';
import { mediaUrl } from '@/data/media';

const slides: Banner[] = banners;
const AUTO_ADVANCE_MS = 6000;

export function HeroSlider() {
  const [active, setActive] = useState(0);
  const total = slides.length;
  const slide = slides[active];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActive((index) => (index + 1) % total);
    }, AUTO_ADVANCE_MS);
    return () => window.clearInterval(timer);
  }, [total, active]);

  const goTo = (index: number) => setActive((index + total) % total);

  if (!slide) return null;

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Banner nổi bật"
      className="relative isolate h-[520px] overflow-hidden bg-navy-900 sm:h-[580px] lg:h-[640px]"
    >
      {slides.map((item, index) => (
        <SafeImage
          key={item.id}
          src={mediaUrl(item.image)}
          alt=""
          aria-hidden="true"
          className={`absolute inset-0 -z-10 h-full w-full object-cover transition-opacity duration-700 ${
            index === active ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-navy-900/95 via-navy-900/75 to-navy-900/30" />

      <div className="relative mx-auto flex h-full max-w-7xl items-center px-4 pb-20 sm:px-6 lg:px-8">
        <div key={slide.id} className="max-w-2xl animate-fade-in space-y-5">
          <p className="inline-block rounded bg-accent-500 px-3 py-1 text-xs font-bold tracking-wider text-navy-900">
            {slide.eyebrow}
          </p>
          <h1 className="text-3xl font-bold leading-tight text-white sm:text-5xl">{slide.title}</h1>
          <p className="text-base leading-relaxed text-white/90 sm:text-lg">{slide.description}</p>
          <a
            href={slide.ctaPath}
            className="group inline-flex items-center gap-2 rounded-md bg-primary-500 px-6 py-3 font-bold text-white shadow-lg transition-colors duration-200 hover:bg-primary-400 hover:text-white"
          >
            {slide.ctaLabel}
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
          </a>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-6 flex items-center justify-center gap-4 sm:justify-between sm:px-10 lg:px-16">
        <button
          type="button"
          onClick={() => goTo(active - 1)}
          aria-label="Banner trước"
          className="hidden h-10 w-10 items-center justify-center rounded-full border border-white/30 text-white transition-colors duration-200 hover:bg-white/15 sm:flex"
        >
          <ChevronLeft className="h-5 w-5" aria-hidden="true" />
        </button>

        <div className="flex items-center gap-2">
          {slides.map((item, index) => (
            <button
              key={item.id}
              type="button"
              onClick={() => goTo(index)}
              aria-label={`Chuyển đến banner ${index + 1}`}
              aria-current={index === active}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                index === active ? 'w-8 bg-accent-400' : 'w-2.5 bg-white/50 hover:bg-white/80'
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => goTo(active + 1)}
          aria-label="Banner tiếp theo"
          className="hidden h-10 w-10 items-center justify-center rounded-full border border-white/30 text-white transition-colors duration-200 hover:bg-white/15 sm:flex"
        >
          <ChevronRight className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}
