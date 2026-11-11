import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Plus } from 'lucide-react';
import { AccordionItem } from '@/components/common/AccordionItem';
import { SectionLayout } from '@/components/common/SectionLayout';
import { faqItems, qaTopics } from '@/data/qaRepository';

export function FaqPage() {
  const [openId, setOpenId] = useState<string | null>(null);
  const toggle = (id: string) => setOpenId((current) => (current === id ? null : id));

  return (
    <SectionLayout path="/hoi-dap/cau-hoi-thuong-gap" title="Câu hỏi thường gặp">
      <header className="space-y-4">
        <h1 className="border-l-4 border-primary-500 pl-4 text-2xl font-bold text-navy-900 sm:text-3xl">
          Câu hỏi thường gặp
        </h1>
        <p className="text-lg leading-relaxed text-neutral-600">
          Tổng hợp câu hỏi được hỏi nhiều nhất theo từng chủ đề về mã số mã vạch và các hoạt động của Trung tâm.
        </p>
      </header>

      <div className="mt-10 space-y-10">
        {qaTopics.map((topic) => {
          const items = faqItems.filter((item) => item.topic === topic.slug);
          if (items.length === 0) return null;
          return (
            <section key={topic.slug} className="space-y-4">
              <h2 className="text-lg font-bold text-primary-700">{topic.label}</h2>
              <div className="divide-y divide-neutral-200 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
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
            </section>
          );
        })}
      </div>

      <div className="mt-10 flex flex-col items-start gap-4 rounded-xl bg-primary-50 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-bold text-navy-900">Chưa tìm thấy câu trả lời?</p>
          <p className="text-sm text-neutral-600">Gửi câu hỏi của bạn, Trung tâm sẽ phản hồi sớm nhất.</p>
        </div>
        <Link
          to="/hoi-dap/tao-cau-hoi"
          className="inline-flex items-center gap-2 rounded-md bg-primary-500 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-colors duration-200 hover:bg-primary-600 hover:text-white"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Tạo câu hỏi
        </Link>
      </div>
    </SectionLayout>
  );
}
