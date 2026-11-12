# NCBT – Bản dựng giao diện Portal

Chạy `npm ci`, sau đó `npm run dev -- --host 127.0.0.1 --port 5173`. Mở http://127.0.0.1:5173/.

Giao diện dựng theo https://nbc.gov.vn/, dùng logo NCBT do người dùng cung cấp. Màu chủ đạo theo chốt mới nhất là **cam sáng**, không phải đỏ nâu: nền menu `#f18732`, màu chọn `#ffb36b`, màu nhạt `#fff4e7`; footer nền kem sáng. Bảng màu tập trung tại `src/brand.css`. Font Roboto (400/500/700), hỗ trợ tiếng Việt; fallback Arial/sans-serif. Logo gốc giữ tại `public/branding/ncbt-logo-original.jpg`.

Nội dung: 678 bài viết công khai, lấy từ 71 trang danh mục ngày 12/11/2026. Giữ tiêu đề, ngày, tóm tắt, nội dung và ảnh gốc. 2.153 ảnh tải được, khoảng 717 MiB; đủ ảnh đại diện của 678 bài và banner. Có 38 ảnh nội dung không truy cập được ở nguồn: dùng hình SVG minh họa và chú thích rõ. Không tái tạo ảnh sự kiện như tư liệu thật.

Carousel: tự chuyển mỗi 2.500ms, chuyển động 2.000ms, không lặp; hỗ trợ nút, kéo chuột và vuốt, tạm dừng khi hover/focus. Thống kê đếm 3.000ms khi vào viewport. Menu/dropdown, popup, hover, back-to-top có chuyển động; hỗ trợ reduced motion. Header cố định phần menu khi cuộn. Banner nguồn hiện chỉ có một ảnh nên giữ nguyên một banner.

Đây là frontend demo, không có backend. Bài tạo/sửa, bình luận, câu hỏi và liên hệ lưu trên trình duyệt; tệp ảnh/video lưu trong IndexedDB. Thao tác chỉ ảnh hưởng trình duyệt và domain đang dùng, không gửi đến NBC thật và không thay đổi dữ liệu mà người khác nhìn thấy. Các bài nguồn vẫn được giữ làm dữ liệu khởi tạo.

Admin tại `/admin`. Đăng nhập từ nút Đăng nhập trên Portal bằng **admin@ncbt.demo / demo123** sẽ vào Admin. Trong Admin có Xem Web Portal. Đây là đăng nhập mô phỏng trên client, không phải cơ chế bảo mật cho hệ thống thật. Đổi mật khẩu chỉ đổi mật khẩu demo của trình duyệt hiện tại; giá trị lưu dạng SHA-256. Các luồng tài khoản Portal thông thường và Đào tạo/Khóa học/Bài học vẫn để sau theo file BA.

Luồng bài: mới tạo mặc định Không công bố / Không nổi bật; chỉ chọn chuyên mục con. Công bố đưa bài vào chuyên mục và tìm kiếm Portal; ẩn vẫn giữ trong Admin nhưng link Portal không đọc được. Nổi bật xếp theo Ngày tạo, không đổi bởi Ngày đăng hoặc thao tác sửa. Làm mới form Sửa khôi phục dữ liệu khi mở form, form Thêm trở về trống. Xóa có popup, xóa bình luận thuộc bài và tệp riêng; giữ tệp dùng chung. Dashboard tính Bài viết/Tháng, Bình luận/Tuần và Tổng Liên hệ từ dữ liệu demo thật, loại bài ẩn khỏi các thống kê liên quan. Liên hệ chỉ xem; không thêm xóa/phân công/gửi email. Bình luận được xóa từ Admin, không duyệt trước.

Chọn English đổi nhãn giao diện chính, nội dung bài viết giữ nguyên. Trang sơ đồ tổ chức gốc chưa có nội dung nguồn để sao chép. Menu desktop theo cấu trúc sáu cột của mẫu; mobile là drawer bên trái. CAPTCHA trong trang Admin demo chỉ là xác nhận mô phỏng, không phải CAPTCHA đã xác thực ở server.

Chi tiết nguồn, báo cáo và lệnh thu thập tại `scripts/NBC-SOURCE.md`, `src/data/source-import-report.json` và `src/data/source-assets.json`.

Website: https://redesign-web-ncbt.vercel.app/ · Admin: https://redesign-web-ncbt.vercel.app/admin · Repo Private: https://github.com/Tbnahs/redesign-web-ncbt. Nhánh main đã nối Git integration của Vercel; push mới sẽ kích hoạt build. Không đưa tệp `.env*`, `scripts/nbc-cache`, profile trình duyệt, ảnh kiểm thử hoặc `node_modules` vào Git.

Kiểm tra: TypeScript, Vitest, build Nitro/Vercel và các kịch bản trình duyệt tại `scripts/admin-browser-check.mjs`, `scripts/admin-extra-check.mjs`. Kịch bản kiểm tra chỉ dùng dữ liệu trong profile trình duyệt kiểm thử.
