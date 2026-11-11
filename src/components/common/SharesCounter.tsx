import { Share2 } from 'lucide-react';
import { brand } from '@/config/brand';

interface SharesCounterProps {
  className?: string;
}

export function SharesCounter({ className = '' }: SharesCounterProps) {
  return (
    <div
      className={`items-center gap-2 rounded-full bg-primary-50 px-3 py-1.5 text-sm whitespace-nowrap ${className}`}
    >
      <Share2 className="h-4 w-4 text-primary-500" aria-hidden="true" />
      <span className="font-bold text-primary-600">{brand.sharesCount}</span>
      <span className="text-neutral-600">{brand.sharesLabel}</span>
    </div>
  );
}
