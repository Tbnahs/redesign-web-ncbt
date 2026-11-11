import { Barcode, Facebook, Twitter, Youtube, type LucideIcon } from 'lucide-react';

export interface SocialLink {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const brand = {
  logoIcon: Barcode,
  logoText: 'Trung tâm MSMV',
  siteName: 'Trung tâm Mã số, Mã vạch Quốc gia',
  siteSubtitle: 'Cổng thông tin điện tử',
  sharesCount: '128M',
  sharesLabel: 'Shares',
  address: 'Số 8 Hoàng Quốc Việt, Nghĩa Đô, Cầu Giấy, Hà Nội',
  hotlines: ['1900 636218', '024 3836 1463'],
  email: 'msmv@nbc.gov.vn',
  socialLinks: [
    { label: 'Facebook', href: '#', icon: Facebook },
    { label: 'Twitter', href: '#', icon: Twitter },
    { label: 'YouTube', href: '#', icon: Youtube },
  ] satisfies SocialLink[],
  gs1Badge: 'GS1',
} as const;
