# Đưa Portal NCBT lên Vercel

GitHub repository có thể để **Private**, còn website Vercel vẫn có thể công khai để gửi link xem thử.

1. Đăng nhập https://vercel.com bằng tài khoản của bạn, chọn **Add New → Project**.
2. Kết nối GitHub và cấp quyền Vercel đọc repo riêng tư `redesign-web-ncbt`.
3. Import repo, để Root Directory là thư mục gốc. Framework chọn **TanStack Start** nếu chưa tự nhận diện.
4. Build Command `npm run build`, Install Command `npm ci`. Không đặt Output Directory thủ công: Nitro tạo `.vercel/output`.
5. Bấm **Deploy**. Sau khi thành công, Vercel cấp URL `https://<tên-project>.vercel.app` tùy tên còn trống.
6. Mở trang chủ, một bài viết và một chuyên mục để kiểm tra. Những lần push lên nhánh production tiếp theo sẽ kích hoạt deploy mới nếu Git integration được bật.

Đã cấu hình `nitro: { preset: "vercel" }` qua wrapper hiện có, không thêm plugin Nitro trùng lặp. Đầu ra build được tạo tại máy để kiểm tra; việc có URL online còn cần đăng nhập và deploy trên tài khoản Vercel.

Các biểu mẫu trong bản frontend chỉ lưu trên trình duyệt, không gửi dữ liệu đến NBC. Kho ảnh gốc khoảng 717 MiB; repo giữ đầy đủ ảnh. Nếu gói triển khai của tài khoản có giới hạn thấp hơn dung lượng này, cần tối ưu ảnh hoặc dùng kho ảnh riêng trước khi deploy.
