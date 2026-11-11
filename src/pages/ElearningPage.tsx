import { useMemo, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { ArrowRight, BookOpen, GraduationCap, Layers } from 'lucide-react';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import courses from '@/data/elearning.json';

type Level = 'co-ban' | 'chuyen-sau' | 'nang-cao' | 'theo-yeu-cau';

interface Course {
  id: string;
  order: number;
  title: string;
  level: Level;
  description: string;
}

const courseList: Course[] = courses as Course[];

const levelLabels: Record<Level, string> = {
  'co-ban': 'Cơ bản',
  'chuyen-sau': 'Chuyên sâu',
  'nang-cao': 'Nâng cao',
  'theo-yeu-cau': 'Theo yêu cầu',
};

const levelBadgeStyles: Record<Level, string> = {
  'co-ban': 'bg-primary-50 text-primary-700',
  'chuyen-sau': 'bg-secondary-100 text-secondary-800',
  'nang-cao': 'bg-accent-100 text-accent-800',
  'theo-yeu-cau': 'bg-navy-100 text-navy-800',
};

const groupOrder: Level[] = ['co-ban', 'chuyen-sau', 'nang-cao', 'theo-yeu-cau'];

const groupIcons: Record<Level, typeof BookOpen> = {
  'co-ban': BookOpen,
  'chuyen-sau': Layers,
  'nang-cao': GraduationCap,
  'theo-yeu-cau': GraduationCap,
};

const tabs: { value: Level | 'all'; label: string }[] = [
  { value: 'all', label: 'Tất cả' },
  { value: 'co-ban', label: 'Cơ bản' },
  { value: 'chuyen-sau', label: 'Chuyên sâu' },
  { value: 'nang-cao', label: 'Nâng cao' },
  { value: 'theo-yeu-cau', label: 'Theo yêu cầu' },
];

function CourseCard({ course }: { course: Course }) {
  return (
    <article className="group relative flex flex-col gap-3 overflow-hidden rounded-xl border border-neutral-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary-200 hover:shadow-lg">
      <span className="absolute right-4 top-2 text-5xl font-bold leading-none text-primary-100 transition-colors duration-300 group-hover:text-primary-200">
        {String(course.order).padStart(2, '0')}
      </span>
      <div className="relative space-y-2">
        <h3 className="text-lg font-bold leading-snug text-navy-900 transition-colors duration-200 group-hover:text-primary-600">
          {course.title}
        </h3>
        <span
          className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${levelBadgeStyles[course.level]}`}
        >
          {levelLabels[course.level]}
        </span>
      </div>
      <p className="relative text-sm leading-relaxed text-neutral-600">{course.description}</p>
    </article>
  );
}

function RequestedCourseCard({ course }: { course: Course }) {
  return (
    <article className="group flex flex-col gap-4 rounded-xl border border-primary-200 bg-primary-50 p-6 shadow-sm transition-all duration-300 hover:shadow-lg sm:flex-row sm:items-center sm:justify-between sm:p-8">
      <div className="flex items-start gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-500 text-white">
          <GraduationCap className="h-6 w-6" aria-hidden="true" />
        </span>
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-5xl font-bold leading-none text-primary-200">
              {String(course.order).padStart(2, '0')}
            </span>
            <h3 className="text-lg font-bold leading-snug text-navy-900 sm:text-xl">{course.title}</h3>
            <span className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${levelBadgeStyles[course.level]}`}>
              {levelLabels[course.level]}
            </span>
          </div>
          <p className="text-sm leading-relaxed text-neutral-700">{course.description}</p>
        </div>
      </div>
      <Link
        to="/lien-he"
        className="group/btn inline-flex shrink-0 items-center gap-2 rounded-md bg-primary-500 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-colors duration-200 hover:bg-primary-600"
      >
        Liên hệ tư vấn
        <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover/btn:translate-x-1" aria-hidden="true" />
      </Link>
    </article>
  );
}

export function ElearningPage() {
  const [activeTab, setActiveTab] = useState<Level | 'all'>('all');

  const visibleGroups = useMemo(() => {
    return groupOrder
      .filter((level) => activeTab === 'all' || activeTab === level)
      .map((level) => ({
        level,
        courses: courseList.filter((course) => course.level === level),
      }))
      .filter((group) => group.courses.length > 0);
  }, [activeTab]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: 'Trang chủ', to: '/' }, { label: 'E-learning' }]} />

      <header className="mt-8 space-y-6">
        <div className="space-y-3">
          <h1 className="border-l-4 border-primary-500 pl-4 text-3xl font-bold leading-tight text-navy-900 sm:text-4xl">
            E-LEARNING
          </h1>
          <p className="text-lg leading-relaxed text-neutral-600">
            Các khóa đào tạo do GS1 Việt Nam tổ chức
          </p>
        </div>

        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-primary-50 px-5 py-3">
            <span className="text-2xl font-bold text-primary-600">8</span>
            <span className="text-sm font-medium text-neutral-700">khóa đào tạo</span>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-primary-50 px-5 py-3">
            <span className="text-2xl font-bold text-primary-600">4</span>
            <span className="text-sm font-medium text-neutral-700">cấp độ</span>
          </div>
        </div>
      </header>

      <div className="mt-8" role="tablist" aria-label="Lọc khóa học theo cấp độ">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.value;
            return (
              <button
                key={tab.value}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveTab(tab.value)}
                className={`rounded-full px-5 py-2.5 text-sm font-bold transition-all duration-200 ${
                  isActive
                    ? 'bg-primary-500 text-white shadow-sm'
                    : 'bg-white text-neutral-700 border border-neutral-300 hover:border-primary-300 hover:text-primary-600'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-10 space-y-12">
        {visibleGroups.map((group) => {
          const GroupIcon = groupIcons[group.level];
          const requestedCourses = group.courses.filter((course) => course.level === 'theo-yeu-cau');
          const regularCourses = group.courses.filter((course) => course.level !== 'theo-yeu-cau');

          return (
            <div key={group.level} className="animate-fade-in space-y-6">
              <div className="flex items-center gap-3">
                <GroupIcon className="h-5 w-5 text-primary-500" aria-hidden="true" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-500">
                  {levelLabels[group.level]}
                </h2>
                <span className="h-px flex-1 bg-neutral-200" aria-hidden="true" />
              </div>

              {regularCourses.length > 0 && (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {regularCourses.map((course) => (
                    <CourseCard key={course.id} course={course} />
                  ))}
                </div>
              )}

              {requestedCourses.map((course) => (
                <RequestedCourseCard key={course.id} course={course} />
              ))}
            </div>
          );
        })}
      </div>

      <p className="mt-12 text-right text-xs text-neutral-400">Cập nhật: 14/01/2016</p>
    </section>
  );
}
