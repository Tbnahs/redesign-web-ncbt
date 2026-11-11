import { ContentPage } from "@/pages/ContentPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import infoPageSource from "@/data/infoPages.json";
import type { InfoPage } from "@/types/content";
import { siteHead } from "@/lib/site-meta";

const infoPages: InfoPage[] = infoPageSource;

export function getContentPage(path: string) {
  return infoPages.find((page) => page.path === path);
}

export function contentHead(path: string) {
  const page = getContentPage(path);
  return siteHead({
    title: page
      ? `${page.title} | Trung tâm Mã số, Mã vạch Quốc gia`
      : "Thông tin | Trung tâm Mã số, Mã vạch Quốc gia",
    description: page?.summary ?? "Thông tin về hoạt động của Trung tâm Mã số, Mã vạch Quốc gia.",
  });
}

export function ContentRoute({ path }: { path: string }) {
  const page = getContentPage(path);
  return page ? <ContentPage page={page} /> : <NotFoundPage />;
}
