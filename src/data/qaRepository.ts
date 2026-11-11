import activities from '@/data/activities.json';
import faqs from '@/data/faqs.json';
import questions from '@/data/questions.json';
import type { ActivityItem, FaqItem, QuestionItem } from '@/types/content';

export interface QaTopic {
  slug: string;
  label: string;
}

export const qaTopics: QaTopic[] = (activities as ActivityItem[]).map((activity) => ({
  slug: activity.id,
  label: activity.title,
}));

export const faqItems: FaqItem[] = faqs;

export const questionItems: QuestionItem[] = (questions as QuestionItem[])
  .slice()
  .sort((a, b) => b.askedAt.localeCompare(a.askedAt));

export function getTopicLabel(slug: string): string {
  return qaTopics.find((topic) => topic.slug === slug)?.label ?? slug;
}
