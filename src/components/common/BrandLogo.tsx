import { Link } from "@tanstack/react-router";
export function BrandLogo(_props: { tone?: "light" | "dark"; compact?: boolean }) {
  return (
    <Link to="/" className="source-logo" aria-label="NCBT – Trang chủ">
      <img
        src="/branding/ncbt-logo-original.jpg"
        alt="NCBT – Trung tâm Mã số Mã vạch Truy xuất nguồn gốc Quốc gia"
        width="1932"
        height="550"
      />
    </Link>
  );
}
