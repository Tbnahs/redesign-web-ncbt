import { useEffect, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { SafeImage } from "@/components/common/SafeImage";
import banners from "@/data/banners.json";
import type { Banner } from "@/types/content";
import { mediaUrl } from "@/data/media";

const slides: Banner[] = banners;
const AUTO_ADVANCE_MS = 6000;

function TraceabilityBackground() {
  const qrCells = Array.from({ length: 5 }, (_, row) =>
    Array.from({ length: 5 }, (_, col) => {
      const active =
        (row + col) % 2 === 0 ||
        (row === 2 && col === 1) ||
        (row === 1 && col === 3) ||
        (row === 3 && col === 4);

      return active ? (
        <rect
          key={`qr-${row}-${col}`}
          x={520 + col * 14}
          y={163 + row * 14}
          width={9}
          height={9}
          rx={1}
          fill="rgba(255,255,255,0.18)"
        />
      ) : null;
    })
  );

  const leaves = Array.from({ length: 12 }, (_, index) => {
    const x = 440 + (index % 3) * 120;
    const y = 170 + Math.floor(index / 3) * 80;
    const scale = 0.9 + (index % 4) * 0.18;

    return (
      <g key={`leaf-${index}`} transform={`translate(${x} ${y}) scale(${scale})`}>
        <path
          d="M0 0 C 30 -30, 78 -62, 110 -18 C 84 8, 34 26, 0 0 Z"
          fill="rgba(155, 214, 170, 0.12)"
          stroke="rgba(255,255,255,0.17)"
          strokeWidth="1.2"
        />
        <path d="M18 0 C 52 -18, 72 -25, 96 -8" stroke="rgba(255,255,255,0.12)" strokeWidth="1.2" fill="none" />
      </g>
    );
  });

  const rows = Array.from({ length: 5 }, (_, index) => (
    <path
      key={`row-${index}`}
      d={`M 0 ${320 + index * 18} C 140 ${308 + index * 10}, 250 ${350 + index * 6}, 430 ${320 + index * 9}`}
      stroke="rgba(147, 213, 170, 0.18)"
      strokeWidth="3"
      fill="none"
      strokeLinecap="round"
    />
  ));

  const dots = Array.from({ length: 10 }, (_, index) => ({
    cx: 70 + index * 70,
    cy: 318 + ((index % 3) - 1) * 13,
    r: 2 + (index % 3),
  }));

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-navy-900/95 via-navy-900/80 to-navy-900/35" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.08),transparent_26%),radial-gradient(circle_at_30%_70%,rgba(150,220,180,0.05),transparent_30%)]" />

      <svg
        viewBox="0 0 760 420"
        className="absolute right-0 top-1/2 h-[360px] w-[520px] -translate-y-1/2 opacity-90"
        aria-hidden="true"
      >
        <g opacity="0.8">
          <path
            d="M500 260 C 570 160, 610 120, 680 90 C 700 90, 715 100, 720 120 C 680 125, 620 152, 560 210 C 520 250, 508 270, 500 260 Z"
            fill="rgba(148,196,160,0.14)"
            stroke="rgba(255,255,255,0.14)"
            strokeWidth="1.5"
          />
          <path
            d="M512 260 C 550 205, 578 185, 598 180 C 632 176, 656 182, 690 154"
            stroke="rgba(255,255,255,0.14)"
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M530 295 C 600 250, 642 215, 700 200"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="1.8"
            fill="none"
          />
          <path
            d="M550 318 C 606 285, 646 266, 704 242"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="1.6"
            fill="none"
          />
          {leaves}
        </g>

        <g opacity="0.8">{rows}</g>

        <g opacity="0.7">
          <path
            d="M 88 315 C 160 272, 205 240, 300 234 C 360 230, 410 240, 500 185"
            fill="none"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="2"
            strokeDasharray="4 8"
            strokeLinecap="round"
          />
          <circle cx="88" cy="315" r="4" fill="rgba(255,255,255,0.4)" />
          <circle cx="210" cy="250" r="4" fill="rgba(255,255,255,0.36)" />
          <circle cx="338" cy="232" r="4" fill="rgba(255,255,255,0.32)" />
          <circle cx="500" cy="185" r="6" fill="rgba(255,255,255,0.52)" />
        </g>

        <g>{qrCells}</g>
        <rect x="512" y="152" width="52" height="52" rx="6" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.12)" />
        <circle cx="610" cy="168" r="10" fill="rgba(255,255,255,0.18)" />
      </svg>

      {dots.map((dot, index) => (
        <span
          key={`dot-${index}`}
          className="absolute rounded-full bg-white/30"
          style={{
            left: `${dot.cx / 7.6}%`,
            top: `${dot.cy / 4.2}%`,
            width: `${dot.r * 2}px`,
            height: `${dot.r * 2}px`,
            opacity: 0.18 + (index % 3) * 0.08,
          }}
        />
      ))}

      <div className="absolute left-[58%] top-1/2 h-20 w-[38%] -translate-y-1/2 rotate-12 bg-gradient-to-r from-transparent via-white/10 to-transparent blur-2xl" />
    </div>
  );
}

function SupplyChainBackground() {
  const nodes = [
    { x: 420, y: 330, r: 26, active: true, type: "factory" },
    { x: 560, y: 280, r: 20, active: true, type: "warehouse" },
    { x: 660, y: 190, r: 18, active: true, type: "truck" },
    { x: 515, y: 160, r: 15, active: true, type: "shop" },
    { x: 360, y: 230, r: 16, active: false, type: "node" },
    { x: 470, y: 250, r: 14, active: false, type: "node" },
    { x: 600, y: 240, r: 12, active: false, type: "node" },
    { x: 700, y: 250, r: 10, active: false, type: "node" },
  ] as const;

  const connections = [
    [0, 1],
    [1, 2],
    [2, 3],
    [0, 4],
    [4, 5],
    [5, 1],
    [1, 6],
    [6, 7],
    [3, 7],
  ] as const;

  const renderNodeIcon = (type: (typeof nodes)[number]["type"]) => {
    const common = "stroke-white/70 fill-none stroke-[1.8]";

    switch (type) {
      case "factory":
        return (
          <g className={common}>
            <path d="M-8 -4 L-8 10 H8 V-4 L0 -10 Z" />
            <path d="M-4 -4 H4" />
            <path d="M-2 2 H2" />
          </g>
        );
      case "warehouse":
        return (
          <g className={common}>
            <path d="M-9 -2 L0 -10 L9 -2 V10 H-9 Z" />
            <path d="M-9 1 H9" />
            <path d="M0 1 V10" />
          </g>
        );
      case "truck":
        return (
          <g className={common}>
            <path d="M-9 2 H5 L9 -4 V10 H-9 Z" />
            <path d="M-3 10 V2" />
            <path d="M5 10 V2" />
            <circle cx="-5" cy="10" r="2" />
            <circle cx="5" cy="10" r="2" />
          </g>
        );
      case "shop":
        return (
          <g className={common}>
            <path d="M-8 7 V-5 H8 V7" />
            <path d="M-4 -5 L0 -9 L4 -5" />
            <path d="M-2 7 V0 H2 V7" />
          </g>
        );
      default:
        return null;
    }
  };

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-navy-900/95 via-navy-900/80 to-navy-900/35" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_25%,rgba(255,255,255,0.07),transparent_24%),radial-gradient(circle_at_20%_60%,rgba(116,176,255,0.06),transparent_30%)]" />

      <svg
        viewBox="0 0 760 420"
        className="absolute right-0 top-1/2 h-[360px] w-[620px] -translate-y-1/2 opacity-90"
        aria-hidden="true"
      >
        <g>
          {connections.map(([from, to], index) => {
            const a = nodes[from];
            const b = nodes[to];
            return (
              <line
                key={`line-${index}`}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke="rgba(255,255,255,0.20)"
                strokeWidth="1.5"
              />
            );
          })}

          {nodes.map((node, index) => (
            <g key={`node-${index}`}>
              <circle
                cx={node.x}
                cy={node.y}
                r={node.r}
                fill={node.active ? "rgba(114,184,255,0.18)" : "rgba(255,255,255,0.08)"}
                stroke="rgba(255,255,255,0.22)"
                strokeWidth="1.2"
              />
              {node.active && (
                <g transform={`translate(${node.x} ${node.y}) scale(${node.type === "factory" ? 1.15 : 0.9})`}>
                  {renderNodeIcon(node.type)}
                </g>
              )}
            </g>
          ))}

          <g opacity="0.8">
            <path
              d="M 130 310 C 190 268, 250 282, 330 246 C 382 220, 430 196, 500 190"
              fill="none"
              stroke="rgba(255,255,255,0.22)"
              strokeWidth="2"
              strokeDasharray="4 12"
              strokeLinecap="round"
            />
            <circle cx="130" cy="310" r="4" fill="rgba(255,255,255,0.4)" />
            <circle cx="255" cy="285" r="4" fill="rgba(255,255,255,0.35)" />
            <circle cx="390" cy="212" r="5" fill="rgba(255,255,255,0.32)" />
            <circle cx="500" cy="190" r="6" fill="rgba(255,255,255,0.48)" />
          </g>

          <g opacity="0.7">
            <rect x="540" y="118" width="72" height="52" rx="8" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.14)" />
            <rect x="551" y="128" width="32" height="32" rx="4" fill="rgba(255,255,255,0.08)" />
            <path d="M564 144 H580 M572 136 V152" stroke="rgba(255,255,255,0.3)" strokeWidth="1.4" />
          </g>

          <g opacity="0.18">
            <path d="M 0 330 C 140 295, 255 340, 520 348" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" fill="none" />
            <path d="M 12 350 C 150 318, 280 360, 540 330" stroke="rgba(255,255,255,0.16)" strokeWidth="1.5" fill="none" />
          </g>

          <g opacity="0.10">
            {Array.from({ length: 30 }, (_, index) => {
              const x = 15 + index * 22;
              const y = 290 + (index % 3) * 20;
              const width = 10 + (index % 4) * 5;
              return (
                <rect key={`barcode-${index}`} x={x} y={y} width={width} height={80} rx={1} fill="rgba(255,255,255,0.45)" />
              );
            })}
          </g>
        </g>
      </svg>

      <div className="absolute bottom-0 left-0 right-0 h-20 bg-[radial-gradient(circle_at_50%_20%,rgba(255,255,255,0.05),transparent_50%)]" />

      <div className="absolute inset-0">
        <style>
          {`
            @media (prefers-reduced-motion: no-preference) {
              .data-flow-dot {
                animation: flow 8s linear infinite;
              }
            }

            @keyframes flow {
              0% { opacity: 0; transform: translateY(0); }
              15% { opacity: 0.35; }
              50% { opacity: 0.75; }
              100% { opacity: 0; transform: translateY(-14px); }
            }
          `}
        </style>
      </div>

      {[
        { left: 37, top: 34 },
        { left: 52, top: 45 },
        { left: 68, top: 52 },
        { left: 70, top: 68 },
        { left: 78, top: 44 },
        { left: 86, top: 58 },
      ].map((item, index) => (
        <span
          key={`spark-${index}`}
          className="data-flow-dot absolute h-1.5 w-1.5 rounded-full bg-white/60"
          style={{ left: `${item.left}%`, top: `${item.top}%`, opacity: 0.14 + index * 0.06 }}
        />
      ))}

      <div className="absolute left-[58%] top-1/2 h-20 w-[38%] -translate-y-1/2 rotate-12 bg-gradient-to-r from-transparent via-white/10 to-transparent blur-2xl" />
    </div>
  );
}

export function HeroSlider() {
  const [active, setActive] = useState(0);
  const total = slides.length;
  const slide = slides[active];
  const isTraceabilitySlide = slide?.id === "traceability";
  const isSupplyChainSlide = slide?.id === "supply-chain";

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
      {slides.map((item, index) => {
        if ((index === active && isTraceabilitySlide) || (index === active && isSupplyChainSlide)) {
          return null;
        }

        return (
          <SafeImage
            key={item.id}
            src={mediaUrl(item.image)}
            alt=""
            aria-hidden="true"
            className={`absolute inset-0 -z-10 h-full w-full object-cover transition-opacity duration-700 ${
              index === active ? "opacity-100" : "opacity-0"
            }`}
          />
        );
      })}

      {isTraceabilitySlide && <TraceabilityBackground />}
      {isSupplyChainSlide && <SupplyChainBackground />}
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
            <ArrowRight
              className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
              aria-hidden="true"
            />
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
                index === active ? "w-8 bg-accent-400" : "w-2.5 bg-white/50 hover:bg-white/80"
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
