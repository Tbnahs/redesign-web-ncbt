import { Link } from "@tanstack/react-router";
import { ArrowUp, MapPin, Phone, Mail } from "lucide-react";
import { BrandLogo } from "@/components/common/BrandLogo";
import { useLocale } from "@/i18n";
export function SiteFooter() {
  const { locale } = useLocale();
  const vi = locale === "vi";
  return (
    <>
      <div className="source-prefooter source-container">
        <span>NCBT · GS1 Vietnam</span>
        <button
          onClick={() =>
            window.scrollTo({
              top: 0,
              behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
                ? "instant"
                : "smooth",
            })
          }
        >
          <ArrowUp size={17} />
          {vi ? "Về đầu trang" : "Back to top"}
        </button>
      </div>
      <footer className="source-footer">
        <div className="source-container source-footer-grid">
          <div>
            <BrandLogo />
            <p>{vi ? "Cổng thông tin điện tử" : "Information portal"}</p>
            <p>
              {vi
                ? "Mã số mã vạch · Truy xuất nguồn gốc · Chuyển đổi số"
                : "Barcodes · Traceability · Digital transformation"}
            </p>
          </div>
          <div>
            <h2>
              {vi
                ? "TRUNG TÂM MÃ SỐ MÃ VẠCH TRUY XUẤT NGUỒN GỐC QUỐC GIA"
                : "NATIONAL CENTER FOR CODES, BARCODES AND TRACEABILITY"}
            </h2>
            <p>
              <MapPin size={16} />{" "}
              {vi ? "Số 8 Hoàng Quốc Việt, Nghĩa Đô, Hà Nội" : "8 Hoang Quoc Viet, Nghia Do, Hanoi"}
            </p>
            <p>
              <Phone size={16} /> <a href="tel:1900636218">1900 636218</a> ·{" "}
              <a href="tel:02438361463">024 3836 1463</a>
            </p>
            <p>
              <Mail size={16} /> <a href="mailto:msmv@nbc.gov.vn">msmv@nbc.gov.vn</a>
            </p>
            <div className="source-footer-links">
              <Link to="/gioi-thieu/lich-su-hinh-thanh">{vi ? "Giới thiệu" : "About us"}</Link>
              <Link to="/lien-he">{vi ? "Liên hệ" : "Contact"}</Link>
              <Link to="/hoi-dap/cau-hoi-thuong-gap">{vi ? "Hỏi đáp" : "FAQ"}</Link>
            </div>
          </div>
          <div>
            <h2>SCAN & CHECK</h2>
            <p>{vi ? "Ứng dụng quét mã số mã vạch" : "Barcode scanning application"}</p>
            <a
              className="source-store"
              href="https://play.google.com/store/search?q=scan%20and%20check%20gs1&c=apps"
              target="_blank"
              rel="noreferrer"
            >
              ▶ Google Play
            </a>
            <a
              className="source-store"
              href="https://apps.apple.com/vn/search?term=scan%20and%20check"
              target="_blank"
              rel="noreferrer"
            >
              ● App Store
            </a>
          </div>
        </div>
        <div className="source-copyright">
          © NCBT ·{" "}
          {vi
            ? "Trung tâm Mã số Mã vạch Truy xuất nguồn gốc Quốc gia"
            : "National Center for Codes, Barcodes and Traceability"}
        </div>
      </footer>
    </>
  );
}
