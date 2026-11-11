import { Link } from "@tanstack/react-router";

export function NotFoundPage() {
  return (
    <section className="mx-auto flex max-w-7xl flex-col items-start gap-4 px-4 py-20 sm:px-6 lg:px-8">
      <p className="text-sm font-bold uppercase tracking-wide text-primary-600">Lỗi 404</p>
      <h1 className="text-2xl font-bold text-navy-900 sm:text-3xl">Không tìm thấy trang</h1>
      <p className="text-neutral-600">Trang bạn tìm kiếm không tồn tại hoặc đã được di chuyển.</p>
      <Link
        to="/"
        className="mt-2 rounded-md bg-primary-500 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-colors duration-200 hover:bg-primary-600 hover:text-white"
      >
        Về trang chủ
      </Link>
    </section>
  );
}
