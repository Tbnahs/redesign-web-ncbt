# NCBT – Bản dựng giao diện Portal

Chạy `npm ci`, sau đó `npm run dev -- --host 127.0.0.1 --port 5173`. Mở http://127.0.0.1:5173/.

Giao diện dựng theo https://nbc.gov.vn/, dùng logo NCBT do người dùng cung cấp và màu cam/đỏ của logo. Font Roboto (400/500/700), hỗ trợ tiếng Việt; fallback Arial/sans-serif. Logo gốc giữ tại `public/branding/ncbt-logo-original.jpg`.

Nội dung: 678 bài viết công khai, lấy từ 71 trang danh mục ngày 12/11/2026. Giữ tiêu đề, ngày, tóm tắt, nội dung và ảnh gốc. 2.153 ảnh tải được, khoảng 717 MiB; đủ ảnh đại diện của 678 bài và banner. Có 38 ảnh nội dung không truy cập được ở nguồn: dùng hình SVG minh họa và chú thích rõ. Không tái tạo ảnh sự kiện như tư liệu thật.

Carousel: tự chuyển mỗi 2.500ms, chuyển động 2.000ms, không lặp; hỗ trợ nút, kéo chuột và vuốt, tạm dừng khi hover/focus. Thống kê đếm 3.000ms khi vào viewport. Menu/dropdown, popup, hover, back-to-top có chuyển động; hỗ trợ reduced motion. Header cố định phần menu khi cuộn. Banner nguồn hiện chỉ có một ảnh nên giữ nguyên một banner.

Đây là frontend, không có backend. Bình luận, câu hỏi và liên hệ chỉ lưu trên trình duyệt; không gửi đến NBC thật. Tài khoản là mô phỏng. Chọn English đổi nhãn giao diện chính, nội dung bài viết giữ nguyên. Trang sơ đồ tổ chức gốc không có nội dung để sao chép. Các quyết định BA về bỏ đăng ký theo dõi, hỏi đáp công khai và không triển khai quản trị vẫn được giữ.

Chi tiết nguồn, báo cáo và lệnh thu thập tại `scripts/NBC-SOURCE.md`, `src/data/source-import-report.json` và `src/data/source-assets.json`.

Chưa đẩy GitHub hoặc triển khai công khai. Các ảnh gốc lớn; cân nhắc tối ưu trước khi triển khai. Không đưa `scripts/nbc-cache`, các profile trình duyệt, ảnh kiểm thử hoặc `node_modules` vào Git.
