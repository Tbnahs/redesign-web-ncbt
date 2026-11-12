import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import home from "@/data/source-home.json";
import { getArticleBySlug } from "@/data/newsRepository";
import { useLocale } from "@/i18n";
import { ArticleLink, SourcePhoto, SourceHeading, sourceDate } from "./SourceNews";
export function SourceLatest() {
  const { locale } = useLocale();
  const vi = locale === "vi";
  const rail = useRef<HTMLDivElement>(null);
  const paused = useRef(false);
  const frame = useRef(0);
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null);
  function move(d: number) {
    const el = rail.current;
    if (!el) return;
    cancelAnimationFrame(frame.current);
    const gap = 30;
    const step = (el.firstElementChild?.getBoundingClientRect().width ?? 280) + gap;
    const start = el.scrollLeft;
    const end = Math.max(
      0,
      Math.min(el.scrollWidth - el.clientWidth, Math.round(start / step) * step + d * step),
    );
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.scrollLeft = end;
      return;
    }
    const time = performance.now();
    function tick(now: number) {
      if (!rail.current) return;
      const t = Math.min(1, (now - time) / 2000);
      rail.current.scrollLeft = start + (end - start) * (1 - Math.pow(1 - t, 3));
      if (t < 1) frame.current = requestAnimationFrame(tick);
    }
    frame.current = requestAnimationFrame(tick);
  }
  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const timer = setInterval(() => {
      const el = rail.current;
      if (!el || media.matches || paused.current || document.hidden) return;
      const r = el.getBoundingClientRect();
      if (r.top < innerHeight && r.bottom > 0) move(1);
    }, 2500);
    return () => {
      clearInterval(timer);
      cancelAnimationFrame(frame.current);
    };
  }, []);
  return (
    <section
      className="source-latest"
      onMouseEnter={() => (paused.current = true)}
      onMouseLeave={() => (paused.current = false)}
      onFocusCapture={() => (paused.current = true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) paused.current = false;
      }}
    >
      <SourceHeading title={vi ? "Tin mới nhất" : "Latest news"}>
        <div className="source-rail-buttons">
          <button aria-label={vi ? "Tin trước" : "Previous news"} onClick={() => move(-1)}>
            <ChevronLeft size={16} />
          </button>
          <button aria-label={vi ? "Tin tiếp theo" : "Next news"} onClick={() => move(1)}>
            <ChevronRight size={16} />
          </button>
        </div>
      </SourceHeading>
      <div
        className="source-news-rail"
        ref={rail}
        onDragStart={(e) => e.preventDefault()}
        onPointerDown={(e) => {
          if (e.pointerType === "mouse")
            drag.current = { x: e.clientX, left: e.currentTarget.scrollLeft, moved: false };
        }}
        onPointerMove={(e) => {
          const d = drag.current;
          if (!d) return;
          if (Math.abs(e.clientX - d.x) > 5) {
            d.moved = true;
            cancelAnimationFrame(frame.current);
            e.currentTarget.setPointerCapture(e.pointerId);
            e.currentTarget.scrollLeft = d.left - (e.clientX - d.x);
          }
        }}
        onPointerUp={() => {
          if (drag.current) drag.current.x = 0;
        }}
        onPointerCancel={() => (drag.current = null)}
        onClickCapture={(e) => {
          if (drag.current?.moved) {
            e.preventDefault();
            e.stopPropagation();
          }
          drag.current = null;
        }}
      >
        {home.latestSlugs
          .map(getArticleBySlug)
          .filter((a) => !!a)
          .map((a) => (
            <article key={a.slug}>
              <ArticleLink article={a}>
                <SourcePhoto article={a} />
              </ArticleLink>
              <time>{sourceDate(a.date)}</time>
              <h3>
                <ArticleLink article={a} />
              </h3>
            </article>
          ))}
      </div>
    </section>
  );
}
function Counter({ value }: { value: number }) {
  const ref = useRef<HTMLElement>(null);
  const [number, setNumber] = useState(0);
  useEffect(() => {
    let frame = 0;
    let ran = false;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting || ran) return;
        ran = true;
        if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
          setNumber(value);
          return;
        }
        const start = performance.now();
        function tick(now: number) {
          const t = Math.min(1, (now - start) / 3000);
          setNumber(Math.round(value * (0.5 - Math.cos(Math.PI * t) / 2)));
          if (t < 1) frame = requestAnimationFrame(tick);
        }
        frame = requestAnimationFrame(tick);
      },
      { rootMargin: "0px 0px 5% 0px" },
    );
    if (ref.current) observer.observe(ref.current);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value]);
  return <strong ref={ref}>{number.toLocaleString("en-US")} +</strong>;
}
export function SourceCounters() {
  const { locale } = useLocale();
  const labels = [
    "Enterprises assigned barcodes",
    "Products assigned product management codes",
    "Fresh agricultural product traceability chains",
    "Scans per day around the world",
  ];
  return (
    <section className="source-counters">
      <div className="source-container">
        {home.stats.map((s, i) => (
          <div key={s.value}>
            <Counter value={s.value} />
            <span>{locale === "vi" ? s.label : labels[i]}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
