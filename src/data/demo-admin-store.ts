import { useSyncExternalStore, useMemo } from "react";
import source from "./source-articles.json";
import home from "./source-home.json";
import type { NewsArticle } from "@/types/content";
export interface AdminArticle extends NewsArticle {
  published: boolean;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
  kind: "image" | "video";
  video?: string;
  views: number;
}
export const categoryGroups = [
  {
    label: "Tin tức",
    items: [
      { slug: "tin-tuc-su-kien", label: "Tin tức / Sự kiện" },
      { slug: "hoat-dong-tai-dia-phuong", label: "Hoạt động MSMV tại địa phương" },
    ],
  },
  {
    label: "Hoạt động",
    items: [
      { slug: "ma-so-ma-vach", label: "Mã số mã vạch" },
      { slug: "truy-xuat-nguon-goc", label: "Truy xuất nguồn gốc" },
      { slug: "ma-lei", label: "Mã LEI" },
      { slug: "ma-udi", label: "Mã UDI" },
      { slug: "dao-tao", label: "Đào tạo" },
    ],
  },
  { label: "Dữ liệu nguồn", items: [{ slug: "e-learning", label: "E-learning" }] },
];
export const categories = categoryGroups.flatMap((g) => g.items);
export const categoryName = (slug: string) =>
  categories.find((c) => c.slug === slug)?.label ?? slug;
export const seedArticles: AdminArticle[] = source.map((a) => ({
  ...a,
  published: true,
  featured: home.featuredSlugs.includes(a.slug),
  createdAt: a.date + "T00:00:00.000Z",
  updatedAt: a.date + "T00:00:00.000Z",
  kind: "image",
  views: 0,
}));
const KEY = "ncbt.admin.articles.v1",
  EVENT = "ncbt:demo-update";
type Edits = { version: 1; entries: Record<string, AdminArticle>; deleted: string[] };
let lastRaw: string | null | undefined;
let snapshot = seedArticles;
function readEdits(): Edits {
  try {
    const d = JSON.parse(localStorage.getItem(KEY) || "null");
    if (d?.version === 1 && d.entries && Array.isArray(d.deleted)) return d;
  } catch {}
  return { version: 1, entries: {}, deleted: [] };
}
export function notifyDemo() {
  window.dispatchEvent(new Event(EVENT));
}
function subscribe(callback: () => void) {
  window.addEventListener(EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}
function getSnapshot() {
  if (typeof window === "undefined") return seedArticles;
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(KEY);
  } catch {
    return seedArticles;
  }
  if (raw === lastRaw) return snapshot;
  lastRaw = raw;
  const edits = readEdits();
  const deleted = new Set(edits.deleted);
  const rows = new Map(seedArticles.filter((a) => !deleted.has(a.id)).map((a) => [a.id, a]));
  for (const a of Object.values(edits.entries))
    if (a && typeof a.id === "string" && typeof a.title === "string" && !deleted.has(a.id))
      rows.set(a.id, a);
  snapshot = [...rows.values()];
  return snapshot;
}
export function useAdminArticles() {
  return useSyncExternalStore(subscribe, getSnapshot, () => seedArticles);
}
export function usePublicArticles() {
  const rows = useAdminArticles();
  return useMemo(() => rows.filter((a) => a.published), [rows]);
}
export function getAdminArticles() {
  return getSnapshot();
}
export function getPublicArticles() {
  return getSnapshot().filter((a) => a.published);
}
function writeEdits(edits: Edits) {
  try {
    localStorage.setItem(KEY, JSON.stringify(edits));
  } catch {
    throw Error("Không lưu được dữ liệu vào trình duyệt. Vui lòng kiểm tra bộ nhớ và thử lại.");
  }
  lastRaw = undefined;
  notifyDemo();
}
export function toSlug(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 180);
}
export interface DemoEvent {
  id: string;
  action: string;
  title: string;
  createdAt: string;
}
export function addEvent(action: string, title: string) {
  try {
    const rows: DemoEvent[] = JSON.parse(localStorage.getItem("ncbt-admin-events") || "[]");
    rows.unshift({ id: crypto.randomUUID(), action, title, createdAt: new Date().toISOString() });
    localStorage.setItem("ncbt-admin-events", JSON.stringify(rows.slice(0, 50)));
    notifyDemo();
  } catch {}
}
export function getEvents(): DemoEvent[] {
  try {
    return JSON.parse(localStorage.getItem("ncbt-admin-events") || "[]");
  } catch {
    return [];
  }
}
export function saveArticle(article: AdminArticle, log = true) {
  const row = {
    ...article,
    title: article.title.trim(),
    summary: article.summary.trim(),
    slug: toSlug(article.slug),
    updatedAt: new Date().toISOString(),
    categories: [article.category],
  };
  if (!row.title || !row.summary || !row.slug || !categories.some((c) => c.slug === row.category))
    throw Error("Nhập đủ tiêu đề, tóm tắt, đường dẫn và chuyên mục con.");
  if (
    categories.some((c) => c.slug === row.slug) ||
    getSnapshot().some((a) => a.id !== row.id && a.slug === row.slug)
  )
    throw Error("Đường dẫn bài viết đã được sử dụng. Vui lòng chọn đường dẫn khác.");
  const previous = getSnapshot().find((a) => a.id === row.id);
  if (previous) row.createdAt = previous.createdAt;
  const edits = readEdits();
  edits.entries[row.id] = row;
  writeEdits(edits);
  if (log) addEvent(previous ? "Sửa bài" : "Thêm bài", row.title);
  return row;
}
export function toggleArticle(id: string, field: "published" | "featured") {
  const row = getSnapshot().find((a) => a.id === id);
  if (!row) throw Error("Không tìm thấy bài viết.");
  const updated = saveArticle({ ...row, [field]: !row[field] }, false);
  addEvent(
    field === "published"
      ? updated.published
        ? "Công bố"
        : "Ẩn bài"
      : updated.featured
        ? "Nổi bật"
        : "Bỏ nổi bật",
    row.title,
  );
  return updated;
}
export function deleteArticle(id: string) {
  const row = getSnapshot().find((a) => a.id === id);
  if (!row) return;
  const edits = readEdits();
  delete edits.entries[id];
  edits.deleted.push(id);
  writeEdits(edits);
  localStorage.removeItem("ncbt-comments:" + row.slug);
  addEvent("Xóa bài", row.title);
  return row;
}
let revision = 0,
  auxiliary = "";
function revisionSnapshot() {
  if (typeof window === "undefined") return 0;
  let raw = "";
  try {
    raw = Object.keys(localStorage)
      .filter((k) => k.startsWith("ncbt-"))
      .sort()
      .map((k) => k + localStorage.getItem(k))
      .join("|");
  } catch {}
  if (raw !== auxiliary) {
    auxiliary = raw;
    revision++;
  }
  return revision;
}
export function useDemoRevision() {
  return useSyncExternalStore(subscribe, revisionSnapshot, () => 0);
}
export interface DemoComment {
  id?: string;
  name: string;
  text: string;
  createdAt?: string;
  slug: string;
  articleTitle: string;
  index: number;
}
export function getComments(): DemoComment[] {
  if (typeof window === "undefined") return [];
  return getSnapshot().flatMap((a) => {
    try {
      const rows = JSON.parse(localStorage.getItem("ncbt-comments:" + a.slug) || "[]");
      return Array.isArray(rows)
        ? rows.map((c, index) => ({
            ...c,
            name: c.name || "Khách",
            text: c.text || "",
            slug: a.slug,
            articleTitle: a.title,
            index,
          }))
        : [];
    } catch {
      return [];
    }
  });
}
export function removeComment(slug: string, index: number) {
  const key = "ncbt-comments:" + slug;
  const rows = JSON.parse(localStorage.getItem(key) || "[]");
  rows.splice(index, 1);
  localStorage.setItem(key, JSON.stringify(rows));
  addEvent("Xóa bình luận", getSnapshot().find((a) => a.slug === slug)?.title ?? slug);
}
export interface DemoContact {
  name: string;
  email: string;
  purpose: string;
  message: string;
  createdAt: string;
}
export function getContacts(): DemoContact[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem("ncbt-contacts") || "[]");
  } catch {
    return [];
  }
}
export function recordArticleView(slug: string) {
  try {
    if (sessionStorage.getItem("ncbt-view:" + slug)) return;
    const row = getSnapshot().find((a) => a.slug === slug && a.published);
    if (!row) return;
    sessionStorage.setItem("ncbt-view:" + slug, "1");
    saveArticle({ ...row, views: row.views + 1 }, false);
  } catch {}
}
