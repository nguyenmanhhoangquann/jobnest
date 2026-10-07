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
- [ ] **Bước 7:** AuthContext, axiosClient, ProtectedRoute, Login, Register 2 bước
- [ ] **Bước 8:** SaveButton thật, ApplyModal, trang Việc đã ứng tuyển, JD đã lưu
- [ ] **Bước 9:** DashboardLayout, CV đã nhận, Đăng bài tuyển dụng
- [ ] **Bước 10:** Support (chatbot Gemini), useSpeech (mic + đọc to), AI đánh giá CV, AI gợi ý JD
- [ ] **Bước 11:** Kiểm tra chuyển đổi VITE_USE_MOCK=false và tích hợp Backend
- [ ] **Bước 12:** Audit responsive 375/768/1024/1440px, Dockerfile, nginx.conf, checklist nghiệm thu

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

---

## 3. Checklist nghiệm thu liên quan (Mục 18.2)
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
