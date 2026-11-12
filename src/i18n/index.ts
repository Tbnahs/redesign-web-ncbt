import { useEffect, useMemo, useState } from "react";

export type Locale = "vi" | "en";

export const DEFAULT_LOCALE: Locale = "vi";
const STORAGE_KEY = "nbc.locale";

export const translations = {
  nav: {
    home: { vi: "Trang chủ", en: "Home" },
    about: { vi: "Giới thiệu", en: "About" },
    "about.general": { vi: "Giới thiệu chung", en: "Overview" },
    "about.organization": { vi: "Sơ đồ tổ chức", en: "Organization" },
    "about.partners": { vi: "Đối tác quốc tế", en: "International Partners" },
    news: { vi: "Tin tức", en: "News" },
    "news.events": { vi: "Tin tức/Sự kiện", en: "News & Events" },
    "news.local": { vi: "Hoạt động MSMV tại địa phương", en: "Local GS1 Activities" },
    activities: { vi: "Hoạt động", en: "Activities" },
    "activities.barcode": { vi: "Mã số mã vạch", en: "Barcode & GS1" },
    "activities.traceability": { vi: "Truy xuất nguồn gốc", en: "Traceability" },
    "activities.lei": { vi: "Mã LEI", en: "LEI Code" },
    "activities.udi": { vi: "Mã UDI", en: "UDI Code" },
    "activities.training": { vi: "Đào tạo", en: "Training" },
    faq: { vi: "Hỏi đáp", en: "FAQs" },
    "faq.common": { vi: "Câu hỏi thường gặp", en: "Common Questions" },
    "faq.list": { vi: "Danh sách câu hỏi", en: "Question List" },
    "faq.ask": { vi: "Tạo câu hỏi", en: "Ask a Question" },
    elearning: { vi: "E-learning", en: "E-learning" },
    contact: { vi: "Liên hệ", en: "Contact" },
  },
  common: {
    loginRegister: { vi: "ĐĂNG NHẬP / ĐĂNG KÍ", en: "LOG IN / SIGN UP" },
    follow: { vi: "THEO DÕI", en: "FOLLOW" },
    searchPlaceholder: { vi: "TÌM KIẾM", en: "SEARCH" },
    searchAria: { vi: "Tìm kiếm toàn trang", en: "Search the website" },
    searchError: { vi: "Vui lòng nhập từ khóa cần tìm.", en: "Please enter a keyword to search." },
    viewMore: { vi: "Xem tin tức", en: "View news" },
    contactConsult: { vi: "Liên hệ tư vấn", en: "Contact for advice" },
    back: { vi: "Back", en: "Back" },
    toTop: { vi: "TO TOP", en: "TO TOP" },
    weatherLabel: { vi: "Chọn tỉnh thành", en: "Choose a province" },
    weatherLoading: { vi: "Đang tải...", en: "Loading..." },
    weatherNoData: { vi: "Không có dữ liệu", en: "No data" },
    socialPlaceholder: {
      vi: "Chưa có liên kết mạng xã hội trong thông tin được cung cấp.",
      en: "No social media links are provided in the available information.",
    },
    languageLabel: { vi: "Chọn ngôn ngữ", en: "Select language" },
    languageNotice: { vi: "Chưa có bản tiếng Anh", en: "English version is available soon" },
    contactTitle: { vi: "Liên hệ", en: "Contact" },
    connectTitle: { vi: "Kết nối", en: "Connect" },
    backToTop: { vi: "Lên đầu trang", en: "Back to top" },
    noResults: { vi: "Không có kết quả phù hợp", en: "No matching results" },
    footerIntro: {
      vi: "Cổng thông tin chính thức của",
      en: "Official information portal of",
    },
  },
  pages: {
    home: { vi: "Trang chủ", en: "Home" },
    news: { vi: "Tin tức", en: "News" },
    faq: { vi: "Câu hỏi thường gặp", en: "Frequently asked questions" },
    contact: { vi: "Liên hệ", en: "Contact" },
    search: { vi: "Tìm kiếm", en: "Search" },
    eLearning: { vi: "E-learning", en: "E-learning" },
    notFound: { vi: "Không tìm thấy trang", en: "Page not found" },
  },
};

export function getStoredLocale(): Locale {
  if (typeof window === "undefined") return DEFAULT_LOCALE;

  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return value === "en" ? "en" : "vi";
  } catch {
    return DEFAULT_LOCALE;
  }
}

export function getTranslation(key: string, locale: Locale = DEFAULT_LOCALE): string {
  const value = key.split(".").reduce<Record<string, any> | undefined>(
    (acc, part) => {
      if (!acc) return undefined;
      return acc[part];
    },
    translations as Record<string, any>,
  );

  if (value && typeof value === "object" && "vi" in value && "en" in value) {
    return value[locale] ?? value["vi"] ?? "";
  }

  return typeof value === "string" ? value : "";
}

export function useLocale() {
  const [locale, setState] = useState<Locale>(DEFAULT_LOCALE);
  useEffect(() => {
    const sync = () => {
      const next = getStoredLocale();
      setState(next);
      document.documentElement.lang = next;
    };
    sync();
    window.addEventListener("ncbt:locale", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("ncbt:locale", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  const setLocale = (next: Locale) => {
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {}
    setState(next);
    window.dispatchEvent(new Event("ncbt:locale"));
  };
  const t = (key: string) => getTranslation(key, locale);
  return useMemo(() => ({ locale, setLocale, t }), [locale]);
}
const navEnglish: Record<string, string> = {
  "Trang chủ": "Home",
  "Giới thiệu": "About us",
  "Giới thiệu chung": "Overview",
  "Sơ đồ tổ chức": "Organization",
  "Tin tức": "News",
  "Tin tức/Sự kiện": "News / Events",
  "Hoạt động MSMV tại địa phương": "Local GS1 activities",
  "Hoạt động": "Activities",
  "Mã số mã vạch": "Barcodes",
  "Truy xuất nguồn gốc": "Traceability",
  "Mã LEI": "LEI",
  "Mã UDI": "UDI",
  "Đào tạo": "Training",
  "Hỏi đáp": "Q&A",
  "Câu hỏi thường gặp": "Frequently asked questions",
  "Danh sách câu hỏi": "Questions",
  "Tạo câu hỏi": "Ask a question",
  "Liên hệ": "Contact",
};
export function translateNavLabel(label: string, locale: Locale) {
  return locale === "en" ? (navEnglish[label] ?? label) : label;
}
