# JobNest - Nền tảng kết nối tuyển dụng việc làm

Dự án Frontend xây dựng bằng ReactJS (Vite) + Bootstrap 5 + React Router + Axios theo đặc tả kỹ thuật đồ án tốt nghiệp.

---

## 1. Công nghệ sử dụng
- **Core:** React 18, Vite 5/6
- **Routing:** React Router DOM v6
- **Giao diện:** Bootstrap 5, React-Bootstrap, React Icons
- **Quản lý Form:** React Hook Form
- **HTTP Client:** Axios (Interceptors gắn JWT)
- **Công nghệ hỗ trợ:** Web Speech API (nhận diện giọng nói tiếng Việt & đọc to tin nhắn), AI Gemini Assistant & Smart JD/CV Evaluation

---

## 2. Hướng dẫn cài đặt & Chạy cục bộ

### Bước 1: Cài đặt thư viện
```bash
cd frontend
npm install
```

### Bước 2: Chạy môi trường phát triển (Dev)
```bash
npm run dev
```
Truy cập: `http://localhost:5173`

### Bước 3: Build đóng gói Production
```bash
npm run build
```

---

## 3. Cấu hình biến môi trường (`frontend/.env`)
- `VITE_API_URL`: Địa chỉ API Backend Spring Boot (mặc định: `http://localhost:8080/api`)
- `VITE_USE_MOCK`: Chế độ Mock dữ liệu
  - `true`: Dùng dữ liệu giả lập có độ trễ 400ms (chạy độc lập không cần bật Backend).
  - `false`: Gọi trực tiếp Backend thật qua `axiosClient`.

---

## 4. Tài khoản kiểm thử nhanh (Quick Login)
Trên màn hình Đăng nhập (`/login`) có sẵn nút bấm tự điền để chấm bài nhanh:
- **Ứng viên:** `ungvien` / Mật khẩu: `123456`
- **Nhà tuyển dụng:** `tuyendung` / Mật khẩu: `123456`

---

## 5. Chạy bằng Docker
```bash
# Chạy toàn bộ hệ thống
docker compose up -d --build
```
- Frontend Nginx: `http://localhost:3000`
- Backend API: `http://localhost:8080`
- MySQL: `localhost:3306`

---

## 6. Cấu trúc thư mục mã nguồn
```text
JobNest/
├── docker-compose.yml
├── README.md
├── PROGRESS.md
└── frontend/
    ├── Dockerfile
    ├── nginx.conf
    ├── src/
    │   ├── api/            # Tầng Axios client & 7 module API
    │   ├── components/     # Layout, common, job, home
    │   ├── context/        # AuthContext quản lý JWT & User
    │   ├── hooks/          # useSpeech hook (Web Speech API)
    │   ├── mock/           # Mock data categories, jobs, applications
    │   ├── pages/          # Home, JobList, JobDetail, Login, Register, Support, candidate/*, employer/*
    │   └── styles/         # tokens.css, base.css, responsive.css, home.css
```
