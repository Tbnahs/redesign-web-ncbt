export interface NavItem {
  label: string;
  path: string;
  children?: NavItem[];
  megaMenuHidden?: boolean;
}

export const mainNav = [
  { label: "Trang chủ", path: "/" },
  {
    label: "Giới thiệu",
    path: "/gioi-thieu",
    children: [
      { label: "Giới thiệu chung", path: "/gioi-thieu/lich-su-hinh-thanh" },
      { label: "Sơ đồ tổ chức", path: "/gioi-thieu/co-cau-to-chuc" },
    ],
  },
  {
    label: "Tin tức",
    path: "/tin-tuc",
    children: [
      { label: "Tin tức/Sự kiện", path: "/tin-tuc/tin-tuc-su-kien" },
      { label: "Hoạt động MSMV tại địa phương", path: "/hoat-dong-msmv-dia-phuong" },
    ],
  },
  {
    label: "Hoạt động",
    path: "/hoat-dong",
    children: [
      { label: "Mã số mã vạch", path: "/hoat-dong/ma-so-ma-vach" },
      { label: "Truy xuất nguồn gốc", path: "/hoat-dong/truy-xuat-nguon-goc" },
      { label: "Mã LEI", path: "/hoat-dong/ma-lei" },
      { label: "Mã UDI", path: "/hoat-dong/ma-udi" },
      { label: "Đào tạo", path: "/hoat-dong/dao-tao" },
    ],
  },
  {
    label: "Hỏi đáp",
    path: "/hoi-dap",
    children: [
      { label: "Câu hỏi thường gặp", path: "/hoi-dap/cau-hoi-thuong-gap" },
      { label: "Danh sách câu hỏi", path: "/hoi-dap/danh-sach-cau-hoi" },
      { label: "Tạo câu hỏi", path: "/hoi-dap/tao-cau-hoi" },
    ],
  },
  { label: "E-learning", path: "/e-learning", megaMenuHidden: true },
  { label: "Liên hệ", path: "/lien-he" },
] satisfies NavItem[];

export function findParentNavItem(path: string): NavItem | undefined {
  return mainNav.find((item) => item.children?.some((child) => child.path === path));
}

export function flattenNavItems(items: NavItem[]): NavItem[] {
  return items.flatMap((item) => [item, ...(item.children ?? [])]);
}

export const newsCategories: { slug: string; label: string }[] = [
  { slug: "tin-tuc-su-kien", label: "Tin tức sự kiện" },
  { slug: "hoat-dong-msmv-dia-phuong", label: "Hoạt động MSMV địa phương" },
  { slug: "thong-bao", label: "Thông báo" },
  { slug: "tin-hoat-dong", label: "Tin hoạt động" },
];

export function getCategoryLabel(slug: string): string {
  return newsCategories.find((cat) => cat.slug === slug)?.label ?? slug;
}
