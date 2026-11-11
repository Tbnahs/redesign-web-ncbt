import { HeroSlider } from '@/components/home/HeroSlider';
import { LatestNews } from '@/components/home/LatestNews';
import { StatsCounter } from '@/components/home/StatsCounter';
import { ActivityCards } from '@/components/home/ActivityCards';
import { FaqAccordion } from '@/components/home/FaqAccordion';

export function HomePage() {
  return (
    <>
      <HeroSlider />
      <LatestNews />
      <StatsCounter />
      <ActivityCards />
      <FaqAccordion />
    </>
  );
}
