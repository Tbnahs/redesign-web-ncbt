import { allArticles } from "@/data/newsRepository";
import { questionItems } from "@/data/qaRepository";
import courses from "@/data/elearning.json";

interface SearchEntry {
  id: string;
  title: string;
  detail: string;
  href: string;
}

export interface SiteSearchGroup {
  key: "news" | "questions" | "courses";
  title: string;
  href: string;
  results: SiteSearchResult[];
}

export interface SiteSearchResult extends SearchEntry {
  slug?: string;
}

interface CourseEntry {
  id: string;
  title: string;
  description: string;
  level: string;
}

const courseEntries = courses as CourseEntry[];

export function normalizeSearchText(value: string) {
  return value
    .toLocaleLowerCase("vi")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/đ/g, "d");
}

function matches(query: string, ...values: string[]) {
  const needle = normalizeSearchText(query);
  return values.some((value) => normalizeSearchText(value).includes(needle));
}

export function searchSite(query: string): SiteSearchGroup[] {
  const keyword = query.trim();
  if (!keyword) return [];

  const news: SiteSearchResult[] = allArticles
    .filter((article) => matches(keyword, article.title, article.summary, article.content.replace(/<[^>]*>/g, " ")))
    .map((article) => ({
      id: article.id,
      slug: article.slug,
      title: article.title,
      detail: article.summary,
      href: `/tin-tuc/${article.slug}`,
    }));

  const questions: SearchEntry[] = questionItems
    .filter((question) => matches(keyword, question.title, question.content, question.answer ?? ""))
    .map((question) => ({
      id: question.id,
      title: question.title,
      detail: question.content,
      href: "/hoi-dap/danh-sach-cau-hoi",
    }));

  const matchingCourses = courseEntries
    .filter((course) => matches(keyword, course.title, course.description, course.level))
    .map((course) => ({
      id: course.id,
      title: course.title,
      detail: course.description,
      href: "/e-learning",
    }));

  return [
    { key: "news", title: "Tin tức", href: "/tin-tuc", results: news },
    { key: "questions", title: "Câu hỏi", href: "/hoi-dap/danh-sach-cau-hoi", results: questions },
    { key: "courses", title: "Khóa học E-learning", href: "/e-learning", results: matchingCourses },
  ];
}