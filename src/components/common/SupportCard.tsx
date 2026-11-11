import { Phone } from 'lucide-react';
import { brand } from '@/config/brand';

export function SupportCard() {
  return (
    <div className="rounded-xl bg-primary-50 p-5">
      <h2 className="text-base font-bold text-navy-900">Cần hỗ trợ thêm?</h2>
      <p className="mt-2 text-sm leading-relaxed text-neutral-600">
        Đội ngũ tư vấn của Trung tâm sẵn sàng giải đáp mọi thắc mắc của bạn.
      </p>
      <a
        href={`tel:${brand.hotlines[0].replace(/\s/g, '')}`}
        className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-primary-600 hover:text-primary-700"
      >
        <Phone className="h-4 w-4" aria-hidden="true" />
        {brand.hotlines[0]}
      </a>
    </div>
  );
}
