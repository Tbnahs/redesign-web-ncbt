import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Plus } from 'lucide-react';
import { AccordionItem } from '@/components/common/AccordionItem';
import { SectionHeading } from '@/components/common/SectionHeading';
import { faqItems } from '@/data/qaRepository';

const HOME_FAQ_COUNT = 4;

export function FaqAccordion() {
  const items = faqItems.slice(0, HOME_FAQ_COUNT);
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);

  const toggle = (id: string) => setOpenId((current) => (current === id ? null : id));

  return (
    <section className="bg-neutral-50">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeading title="Hỏi đáp" actionLabel="Xem tất cả" actionTo="/hoi-dap/cau-hoi-thuong-gap" />

        <div className="mx-auto mt-8 max-w-3xl divide-y divide-neutral-200 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
          {items.map((item) => (
            <AccordionItem
              key={item.id}
              id={item.id}
              question={item.question}
              answer={item.answer}
              isOpen={openId === item.id}
              onToggle={() => toggle(item.id)}
            />
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            to="/hoi-dap/tao-cau-hoi"
            className="inline-flex items-center gap-2 rounded-md bg-primary-500 px-6 py-3 font-bold text-white shadow-sm transition-colors duration-200 hover:bg-primary-600 hover:text-white"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Tạo câu hỏi
          </Link>
        </div>
      </div>
    </section>
  );
}
