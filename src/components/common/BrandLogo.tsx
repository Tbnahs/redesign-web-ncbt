import { Link } from '@tanstack/react-router';
import { brand } from '@/config/brand';

interface BrandLogoProps {
  tone?: 'light' | 'dark';
  compact?: boolean;
}

export function BrandLogo({ tone = 'light', compact = false }: BrandLogoProps) {
  const isDark = tone === 'dark';
  return (
    <Link to="/" className="flex min-w-0 shrink-0 items-center gap-3">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-500 text-white shadow-sm">
        <brand.logoIcon className="h-5 w-5" aria-hidden="true" />
      </span>
      <span className="min-w-0 leading-tight">
        <span className={`block font-bold ${compact ? 'max-w-44 break-words text-[13px] leading-snug sm:max-w-none sm:text-base' : 'text-base'} ${isDark ? 'text-white' : 'text-navy-900'}`}>
          {brand.siteName}
        </span>
        <span className={`block text-xs ${isDark ? 'text-navy-200' : 'text-neutral-500'}`}>
          {brand.siteSubtitle}
        </span>
      </span>
    </Link>
  );
}
