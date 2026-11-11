import { ArrowUp, Mail, MapPin, Phone } from 'lucide-react';
import { BrandLogo } from '@/components/common/BrandLogo';
import { brand } from '@/config/brand';

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-navy-900 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3 lg:px-8">
        <div className="space-y-4">
          <BrandLogo tone="dark" />
          <p className="max-w-sm text-sm leading-relaxed text-navy-200">
            Cổng thông tin chính thức của {brand.siteName}.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wide text-white">Liên hệ</h3>
          <ul className="space-y-3 text-sm text-navy-200">
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary-300" aria-hidden="true" />
              <span>{brand.address}</span>
            </li>
            <li className="flex items-start gap-3">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary-300" aria-hidden="true" />
              <span className="flex flex-col">
                {brand.hotlines.map((hotline) => (
                  <a key={hotline} href={`tel:${hotline.replace(/\s/g, '')}`} className="text-white hover:text-primary-300">
                    {hotline}
                  </a>
                ))}
              </span>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="h-4 w-4 shrink-0 text-primary-300" aria-hidden="true" />
              <a href={`mailto:${brand.email}`} className="text-white hover:text-primary-300">
                {brand.email}
              </a>
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wide text-white">Kết nối</h3>
          <div className="flex items-center gap-3">
            {brand.socialLinks.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors duration-200 hover:bg-primary-500"
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 text-sm text-navy-200 sm:px-6 md:flex-row lg:px-8">
          <p>
            © {year} {brand.siteName}. Bản quyền thuộc về {brand.siteName}.
          </p>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="inline-flex items-center gap-2 rounded-md border border-white/20 px-4 py-2 font-medium text-white transition-colors duration-200 hover:border-primary-400 hover:bg-primary-500"
          >
            <ArrowUp className="h-4 w-4" aria-hidden="true" />
            Lên đầu trang
          </button>
        </div>
      </div>
    </footer>
  );
}
