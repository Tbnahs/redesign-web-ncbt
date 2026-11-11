import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { AccordionItem } from '@/components/common/AccordionItem';
import { Pagination } from '@/components/common/Pagination';
import { SectionLayout } from '@/components/common/SectionLayout';
import { getTopicLabel, qaTopics, questionItems } from '@/data/qaRepository';
import { formatDate } from '@/utils/date';
import type { QuestionItem, QuestionStatus } from '@/types/content';

const ITEMS_PER_PAGE = 5;

const statusStyles: Record<QuestionStatus, { label: string; className: string }> = {
  answered: { label: 'Đã trả lời', className: 'bg-success-100 text-success-800' },
  pending: { label: 'Chờ trả lời', className: 'bg-warning-100 text-warning-800' },
};

function QuestionHeader({ question }: { question: QuestionItem }) {
  const status = statusStyles[question.status];
  return (
    <span className="flex flex-col gap-2">
      <span className="leading-snug">{question.title}</span>
      <span className="flex flex-wrap items-center gap-2 text-xs font-normal text-neutral-500">
        <span className="rounded bg-primary-50 px-2 py-0.5 font-bold text-primary-700">
          {getTopicLabel(question.topic)}
        </span>
        <span>{formatDate(question.askedAt)}</span>
        <span className={`rounded-full px-2.5 py-0.5 font-bold ${status.className}`}>{status.label}</span>
      </span>
    </span>
  );
}

function QuestionDetail({ question }: { question: QuestionItem }) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-neutral-500">Nội dung câu hỏi</p>
      <p className="text-neutral-700">{question.content}</p>
      <p className="text-sm font-bold text-neutral-500">Trả lời</p>
      {question.answer ? (
        <p className="text-neutral-700">{question.answer}</p>
      ) : (
        <p className="italic text-neutral-500">Câu hỏi đang chờ Trung tâm trả lời.</p>
      )}
    </div>
  );
}

export function QuestionListPage() {
  const [query, setQuery] = useState('');
  const [topic, setTopic] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [openId, setOpenId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    return questionItems.filter(
      (item) =>
        (topic === 'all' || item.topic === topic) &&
        (keyword === '' || item.title.toLowerCase().includes(keyword) || item.content.toLowerCase().includes(keyword)),
    );
  }, [query, topic]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const page = Math.min(currentPage, Math.max(totalPages, 1));
  const pageItems = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleQueryChange = (value: string) => {
    setQuery(value);
    setCurrentPage(1);
    setOpenId(null);
  };

  const handleTopicChange = (value: string) => {
    setTopic(value);
    setCurrentPage(1);
    setOpenId(null);
  };

  const handlePageChange = (next: number) => {
    setCurrentPage(next);
    setOpenId(null);
  };

  return (
    <SectionLayout path="/hoi-dap/danh-sach-cau-hoi" title="Danh sách câu hỏi">
      <header className="space-y-4">
        <h1 className="border-l-4 border-primary-500 pl-4 text-2xl font-bold text-navy-900 sm:text-3xl">
          Danh sách câu hỏi
        </h1>
        <p className="text-neutral-600">Xem các câu hỏi của người dùng và câu trả lời từ Trung tâm.</p>
      </header>

      <div className="mt-8 grid gap-4 sm:grid-cols-[1fr_220px]">
        <label className="flex items-center gap-2 rounded-md border border-neutral-300 bg-white px-3.5 py-2.5 focus-within:border-primary-500">
          <Search className="h-4 w-4 shrink-0 text-neutral-500" aria-hidden="true" />
          <span className="sr-only">Tìm kiếm câu hỏi</span>
          <input
            type="search"
            value={query}
            onChange={(event) => handleQueryChange(event.target.value)}
            placeholder="Tìm theo nội dung câu hỏi"
            className="w-full min-w-0 bg-transparent text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none"
          />
        </label>
        <div>
          <label htmlFor="qa-topic" className="sr-only">
            Lọc theo chủ đề
          </label>
          <select
            id="qa-topic"
            value={topic}
            onChange={(event) => handleTopicChange(event.target.value)}
            className="w-full cursor-pointer rounded-md border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-800 focus:border-primary-500 focus:outline-none"
          >
            <option value="all">Tất cả chủ đề</option>
            {qaTopics.map((item) => (
              <option key={item.slug} value={item.slug}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p className="mt-4 text-sm text-neutral-500">Có {filtered.length} câu hỏi</p>

      {pageItems.length > 0 ? (
        <div className="mt-4 divide-y divide-neutral-200 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
          {pageItems.map((item) => (
            <AccordionItem
              key={item.id}
              id={item.id}
              question={<QuestionHeader question={item} />}
              answer={<QuestionDetail question={item} />}
              isOpen={openId === item.id}
              onToggle={() => setOpenId((current) => (current === item.id ? null : item.id))}
            />
          ))}
        </div>
      ) : (
        <div className="mt-10 rounded-xl border border-dashed border-neutral-300 p-10 text-center">
          <p className="font-bold text-navy-900">Không tìm thấy câu hỏi phù hợp</p>
          <p className="mt-2 text-sm text-neutral-600">Thử từ khóa khác hoặc chọn chủ đề khác.</p>
        </div>
      )}

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />
    </SectionLayout>
  );
}
