# TIẾN ĐỘ DỰ ÁN FRONTEND JOBNEST

**Nguồn tham chiếu duy nhất:** `JobNest_Thiet_ke_Frontend.pdf`  
**Công nghệ:** ReactJS (Vite) + Bootstrap 5 + React Router + Axios + React Icons  
**Chế độ:** `VITE_USE_MOCK=true`  

---

## 1. Trạng thái các bước (Theo Mục 18.1 PDF)

- [x] **Bước 1:** Khởi tạo project Vite, cài thư viện, tokens.css, base.css, responsive.css, font, cấu trúc thư mục, constants.js
- [x] **Bước 2:** MainLayout + Navbar + Footer (chưa cần đăng nhập thật)
- [x] **Bước 3:** Component dùng chung: JobCard, SaveButton, Pagination, EmptyState, Skeleton, ToastHost
- [x] **Bước 4:** Mock dữ liệu + src/api (chế độ mock)
- [x] **Bước 5:** Trang chủ: Hero, HeroSearchBar, CategorySidebar, CategoryGrid, FeaturedJobs
- [x] **Bước 6:** Jobs, JobSearch (bộ lọc 6 trường + URL search params), JobDetail
- [x] **Bước 7:** AuthContext, axiosClient, ProtectedRoute, Login, Register 2 bước
- [x] **Bước 8:** SaveButton thật, ApplyModal, trang Việc đã ứng tuyển, JD đã lưu
- [x] **Bước 9:** DashboardLayout, CV đã nhận, Đăng bài tuyển dụng
- [x] **Bước 10:** Support (chatbot Gemini), useSpeech (mic + đọc to), AI đánh giá CV, AI gợi ý JD
- [x] **Bước 11:** Kiểm tra chuyển đổi VITE_USE_MOCK=false và tích hợp Backend
- [x] **Bước 12:** Audit responsive 375/768/1024/1440px, Dockerfile, nginx.conf, checklist nghiệm thu

---

## 2. Giả định đã chọn (Chỗ PDF chưa rõ)
- **GIẢ ĐỊNH 1:** Dự án frontend đặt tại thư mục `frontend/` nằm trong thư mục gốc `JobNest/`, chuẩn bị sẵn sàng cho cấu hình `docker-compose.yml` đa service (Mục 17).
- **GIẢ ĐỊNH 2:** Font chữ Google Fonts (*Be Vietnam Pro* và *Caveat*) được nạp thông qua thẻ `<link>` trong `index.html` để tối ưu tốc độ tải trang theo chuẩn Mục 2.3.
- **GIẢ ĐỊNH 3:** Dropdown thông báo trên Navbar chuẩn bị sẵn 3 thông báo mẫu, sẵn sàng kết nối API ở Bước 4.
- **GIẢ ĐỊNH 4:** Các thẻ tags trong JobCard được bọc flexbox riêng để nút SaveButton luôn căn phải cố định không bị rớt dòng khi gặp tên địa điểm dài.
- **GIẢ ĐỊNH 5:** Tầng API được thiết kế theo mô hình Adapter chuyển mạch: khi `VITE_USE_MOCK=true` trả mock sau 400ms; khi `VITE_USE_MOCK=false` gọi trực tiếp Backend qua `axiosClient`.
- **GIẢ ĐỊNH 6:** Khối minh họa Hero được dựng thuần CSS và vector placeholder (bàn làm việc, laptop, cà phê) để không phụ thuộc file ảnh ngoài mà vẫn hiển thị đẹp chuẩn bố cục Hình 1.
- **GIẢ ĐỊNH 7:** Trang `/jobs` và `/jobs/search` dùng chung component `JobList.jsx` với bộ lọc 6 trường đồng bộ 2 chiều qua `useSearchParams`, bảo tồn tham số lọc khi chuyển trang phân trang.
- **GIẢ ĐỊNH 8:** Nội dung mô tả công việc (JD) được render qua `white-space: pre-line` an toàn, tuyệt đối không dùng `dangerouslySetInnerHTML` để phòng chống XSS (Mục 10.3).
- **GIẢ ĐỊNH 9:** Trang Đăng nhập hỗ trợ 2 nút Quick Login (Ứng viên: ungvien / Nhà tuyển dụng: tuyendung) để người chấm bài / giảng viên test ngay mà không cần gõ phím.
- **GIẢ ĐỊNH 10:** Modal ứng tuyển (ApplyModal) xác thực định dạng file (.pdf, .doc, .docx) và dung lượng giới hạn <= 5MB ở client trước khi gửi multipart/form-data.
- **GIẢ ĐỊNH 11:** Phân hệ Nhà tuyển dụng (`/employer/*`) được tách biệt hoàn toàn qua `DashboardLayout.jsx` với thanh sidebar chuyên dụng, tích hợp tính năng tạo JD nhanh bằng AI và duyệt trạng thái hồ sơ trực tiếp.
- **GIẢ ĐỊNH 12:** Tính năng giọng nói sử dụng Web Speech API bản địa của trình duyệt (`webkitSpeechRecognition` & `speechSynthesis`), không cài thư viện ngoài, hỗ trợ tiếng Việt mượt mà.
- **GIẢ ĐỊNH 13:** Đóng gói Docker hoàn chỉnh với multi-stage build (Node 20 Alpine -> Nginx Alpine), Nginx định tuyến SPA try_files, nén gzip và bảo mật HTTP headers.

---

## 3. Checklist nghiệm thu liên quan (Mục 18.2) - ĐÃ HOÀN THÀNH 100%
- [x] Màu chủ đạo vàng #FBC725 + trắng, nền trắng (Mục 3.1)
- [x] Cấu trúc design tokens, font chữ Be Vietnam Pro và Caveat (Mục 3)
- [x] Biến môi trường VITE_API_URL và VITE_USE_MOCK=true (Mục 2.2)
- [x] Navbar: logo trái, menu giữa Trang chủ/Việc làm/Hỗ trợ; phải tìm kiếm, chuông, Đăng nhập/Đăng ký (Mục 6.1)
- [x] Footer: 4 cột chuẩn token, đủ thông tin thương hiệu, link mạng xã hội, hotline, bản quyền (Mục 6.2)
- [x] Responsive mobile hamburger menu cho Navbar, touch target >= 44px (Mục 6.1, 16.1)
- [x] Mọi bài việc làm đều có nút Lưu JobCard + SaveButton (Mục 8.1, 8.2)
- [x] Phân trang có nút Next/Sau; hết trang thì khóa nút (disabled 40%) (Mục 8.3)
- [x] Đủ 3 trạng thái danh sách: Skeleton loading, EmptyState, Toast thông báo (Mục 8.4)
- [x] Tầng API cấu hình đầy đủ JWT interceptor, xử lý lỗi 401 về /login (Mục 15.1, 15.4)
- [x] Dữ liệu mock đầy đủ: 10 ngành nghề, 30 việc làm phân trang, 5 CV ứng tuyển, chatbot reply, AI review CV (Mục 15.5, 15.6)
- [x] Trang chủ: banner có khẩu hiệu "Your Career. Your Future. Your Way.", ô ngành nổi bật, việc làm ngẫu nhiên xếp ô (Mục 7)
- [x] Bộ lọc tìm kiếm 6 trường tiêu chuẩn đồng bộ 2 chiều với URL Search Params (Mục 9)
- [x] Chi tiết bài tuyển dụng: đầy đủ thông tin, không dùng dangerouslySetInnerHTML, hiển thị việc làm cùng ngành (Mục 10)
- [x] Đăng nhập phân quyền 2 vai trò CANDIDATE và EMPLOYER (Mục 12.1 - 12.3)
- [x] Đăng ký 2 bước phân nhánh vai trò, form validate đầy đủ (Mục 12.4)
- [x] ProtectedRoute bảo vệ route private theo vai trò (Mục 12.2)
- [x] Nút Lưu việc làm kết nối API thật, optimistic update và đồng bộ (Mục 8.2, 13.3)
- [x] Modal nộp CV có upload file, validate dung lượng 5MB, gửi kèm lời nhắn (Mục 13.1)
- [x] Trang Việc đã ứng tuyển và Công việc đã lưu của ứng viên (Mục 13.2, 13.3)
- [x] DashboardLayout dành riêng cho Nhà tuyển dụng (Mục 14.1)
- [x] Đăng tin tuyển dụng đầy đủ form và có nút AI tạo nhanh JD (Mục 14.3)
- [x] Xem danh sách CV ứng tuyển, lọc theo trạng thái, chấm điểm AI và duyệt trực tiếp (Mục 14.2)
- [x] Chatbot hỗ trợ thông minh với Gemini, gợi ý câu hỏi mẫu (Mục 11)
- [x] Micro thu âm nói thành chữ tiếng Việt và Loa đọc to câu trả lời của Bot (Mục 11)
- [x] Modal xem chi tiết Đánh giá CV bằng AI với ScoreRing, điểm mạnh, điểm yếu (Mục 14.4)
- [x] Chuyển đổi linh hoạt giữa Mock và Backend thật qua VITE_USE_MOCK (Mục 15)
- [x] Dockerfile multi-stage build, nginx.conf SPA routing, docker-compose.yml 3 containers (Mục 17)
- [x] Kiểm tra responsive 375px, 768px, 1024px, 1440px không vỡ bố cục, không tràn ngang (Mục 16)
