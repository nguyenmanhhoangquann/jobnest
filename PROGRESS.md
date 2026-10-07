# TIẾN ĐỘ DỰ ÁN FRONTEND JOBNEST

**Nguồn tham chiếu duy nhất:** `JobNest_Thiet_ke_Frontend.pdf`  
**Công nghệ:** ReactJS (Vite) + Bootstrap 5 + React Router + Axios + React Icons  
**Chế độ:** `VITE_USE_MOCK=true`  

---

## 1. Trạng thái các bước (Theo Mục 18.1 PDF)

- [x] **Bước 1:** Khởi tạo project Vite, cài thư viện, tokens.css, base.css, responsive.css, font, cấu trúc thư mục, constants.js
- [ ] **Bước 2:** MainLayout + Navbar + Footer (chưa cần đăng nhập thật)
- [ ] **Bước 3:** Component dùng chung: JobCard, SaveButton, Pagination, EmptyState, Skeleton, ToastHost
- [ ] **Bước 4:** Mock dữ liệu + src/api (chế độ mock)
- [ ] **Bước 5:** Trang chủ: Hero, HeroSearchBar, CategorySidebar, CategoryGrid, FeaturedJobs
- [ ] **Bước 6:** Jobs, JobSearch (bộ lọc 6 trường + URL search params), JobDetail
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

---

## 3. Checklist nghiệm thu liên quan (Mục 18.2)
- [x] Màu chủ đạo vàng #FBC725 + trắng, nền trắng (Mục 3.1)
- [x] Cấu trúc design tokens, font chữ Be Vietnam Pro và Caveat (Mục 3)
- [x] Biến môi trường VITE_API_URL và VITE_USE_MOCK=true (Mục 2.2)
