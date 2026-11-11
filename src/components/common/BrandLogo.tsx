import { Link } from '@tanstack/react-router';
import { brand } from '@/config/brand';

interface BrandLogoProps {
  tone?: 'light' | 'dark';
}

export function BrandLogo({ tone = 'light' }: BrandLogoProps) {
  const isDark = tone === 'dark';
  return (
    <Link to="/" className="flex shrink-0 items-center gap-3">
      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-500 text-white shadow-sm">
        <brand.logoIcon className="h-5 w-5" aria-hidden="true" />
      </span>
      <span className="leading-tight">
        <span className={`block text-base font-bold ${isDark ? 'text-white' : 'text-navy-900'}`}>
          {brand.siteName}
        </span>
        <span className={`block text-xs ${isDark ? 'text-navy-200' : 'text-neutral-500'}`}>
          {brand.siteSubtitle}
        </span>
      </span>
    </Link>
  );
}
