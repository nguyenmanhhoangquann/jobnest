export const mockBlogs = [
  {
    id: 1,
    title: "Tối ưu CV chuẩn ATS năm 2026: Bí quyết vượt qua bộ lọc tự động của Big Tech",
    slug: "toi-uu-cv-chuan-ats-2026",
    category: "Kinh nghiệm ứng tuyển",
    cover: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=1200&q=80",
    excerpt: "Hơn 85% doanh nghiệp công nghệ áp dụng hệ thống phân tích ATS và AI để sàng lọc hồ sơ. Nắm vững bí quyết định dạng chuẩn, từ khóa kỹ thuật và định lượng thành tích giúp tăng 3x tỷ lệ phỏng vấn.",
    readTime: "6 phút đọc",
    date: "08/10/2026",
    views: 1420,
    featured: true,
    tags: ["ATS Resume", "Career Tips", "Job Search", "Google / FPT"],
    author: {
      name: "Hoàng Quân",
      role: "Full-Stack Dev & Career Mentor",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80",
    },
    content: `
### 1. ATS (Applicant Tracking System) thực sự hoạt động như thế nào?

Hệ thống ATS là cổng gác đầu tiên giữa bạn và nhà tuyển dụng. Thay vì đọc thủ công từng file PDF hay Word, ATS sẽ bóc tách văn bản (parse text), phân tích cấu trúc phần mục và đối chiếu các từ khóa kỹ năng cốt lõi với bản mô tả công việc (Job Description - JD).

Nếu CV của bạn dùng bảng biểu phức tạp (tables), thanh đo kỹ năng dạng thanh trượt 80%, hoặc hình ảnh thay vì text, ATS sẽ phân tích lỗi và loại bỏ hồ sơ ngay từ vòng đầu.

---

### 2. Tiêu chuẩn vàng: Định dạng Jake's Resume 1 cột

Phong cách đơn giản, tinh gọn 1 cột (Overleaf / LaTeX Single Column) luôn là tiêu chuẩn số một được các kỹ sư tại Google, Microsoft, Meta và FPT khuyến nghị:
- **Font chữ:** Dùng Inter, Arial, Calibri hoặc Helvetica rõ ràng (kích thước 10 - 11.5pt).
- **Phần mục chuẩn:** Education → Technical Skills → Projects → Work Experience → Certifications.
- **Không dùng cột đôi (Two-column):** Một số parser ATS đời cũ đọc từ trái sang phải xuyên qua hai cột, làm đảo lộn nội dung dự án.

---

### 3. Công thức định lượng thành tích: Google XYZ Formula

Thay vì viết mô tả chung chung như *"Phát triển chức năng đăng nhập và quản lý đơn hàng"*, hãy viết theo công thức:
> **Đạt được kết quả [X], đo lường bằng [Y], thông qua giải pháp [Z].**

Ví dụ thực tế:
- *"Xây dựng hệ thống hoàn hủy đơn hàng và đồng bộ kho hàng với Spring Boot + MySQL, giảm 40% xung đột dữ liệu và xử lý 500+ giao dịch đồng thời mỗi phút."*
- *"Tích hợp Google Gemini REST API để phân tích từ khóa CV theo thời gian thực, đạt độ chính xác tương thích 92%."*

---

### 4. Checklist kiểm tra nhanh trước khi bấm Nộp hồ sơ:
1. Đã chèn liên kết GitHub và LinkedIn có thể nhấp được (Clickable hyperlinks).
2. Tên file CV lưu chuẩn: \`[HọTên]_[VịTrí]_[Năm].pdf\` (Ví dụ: \`NguyenManhHoangQuan_FullstackDev_2026.pdf\`).
3. Xuất file PDF dạng văn bản có thể bôi đen và sao chép (Selectable text), không xuất dưới dạng ảnh scan.
    `,
  },
  {
    id: 2,
    title: "Lộ trình Full-Stack Web 2026: Từ Spring Boot, React + TypeScript đến Tích hợp AI",
    slug: "lo-trinh-fullstack-web-2026",
    category: "Công nghệ & Lập trình",
    cover: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80",
    excerpt: "Phân tích trọn vẹn bộ kỹ năng trọng tâm các doanh nghiệp công nghệ đòi hỏi ở một lập trình viên hiện đại: kiến trúc RESTful stateless, Docker, Vite, tối ưu bảo mật và kết nối LLM APIs.",
    readTime: "8 phút đọc",
    date: "06/10/2026",
    views: 2150,
    featured: false,
    tags: ["Spring Boot", "React", "TypeScript", "AI Integration"],
    author: {
      name: "Tech Lead JobNest",
      role: "Senior Solutions Architect",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80",
    },
    content: `
### Xu hướng thị trường tuyển dụng Full-Stack 2026

Thị trường không còn ưu tiên những lập trình viên chỉ biết kéo thả giao diện cơ bản hay viết API CRUD đơn giản. Năm 2026 đòi hỏi ứng viên có tư duy giải quyết trọn vẹn vòng đời sản phẩm:

#### 1. Backend: Java Spring Boot 3.x
- **Bảo mật:** Spring Security 6 với JWT Stateless Authentication và phân quyền RBAC (Role-Based Access Control).
- **Cơ sở dữ liệu:** Tối ưu hóa truy vấn Hibernate/JPA, giải quyết triệt để lỗi N+1 Query và đánh Index khóa ngoại đúng cách.
- **RESTful Design:** Thiết kế API theo chuẩn HTTP Methods (GET, POST, PATCH, DELETE) và trả mã trạng thái chuẩn mực.

#### 2. Frontend: React 19 + TypeScript + Vite
- Quản lý state gọn gàng, tránh re-render thừa thãi.
- Giao diện thân thiện, chuẩn Accessibility (a11y) và Responsive mượt mà trên mọi kích thước màn hình.
- Tư duy component tái sử dụng cao, không lạm dụng thư viện cồng kềnh.

#### 3. Kỹ năng tích hợp AI (AI-native Developer)
- Biết cách kết nối các mô hình AI ngôn ngữ lớn (OpenAI, Google Gemini) qua REST API để tăng tốc xử lý công việc: phân loại hồ sơ, gợi ý văn bản, dịch thuật và phân tích dữ liệu tự động.
    `,
  },
  {
    id: 3,
    title: "10 Câu hỏi phỏng vấn Spring Boot & System Design phổ biến nhất năm 2026",
    slug: "cau-hoi-phong-van-spring-boot-system-design",
    category: "Kỹ năng phỏng vấn",
    cover: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80",
    excerpt: "Tổng hợp các câu hỏi phỏng vấn thực tế từ các ngân hàng và tập đoàn IT: Bean Lifecycle, Transaction Rollback, cơ chế Cache, Connection Pooling và xử lý đồng thời (Concurrency).",
    readTime: "9 phút đọc",
    date: "04/10/2026",
    views: 1890,
    featured: false,
    tags: ["Interview", "Java", "Spring Boot", "System Design"],
    author: {
      name: "Ban Cố vấn Chuyên môn",
      role: "Hội đồng Tuyển dụng IT",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80",
    },
    content: `
### Bộ câu hỏi trọng tâm thường gặp trong phỏng vấn kỹ thuật:

1. **Vòng đời của một Spring Bean diễn ra như thế nào?**
   - Định nghĩa metadata -> Khởi tạo Bean Instance -> Populate Properties -> Aware Interfaces -> BeanPostProcessor (Before) -> InitializingBean / @PostConstruct -> BeanPostProcessor (After) -> Ready for use -> @PreDestroy.

2. **Khi nào @Transactional không hoạt động như mong đợi?**
   - Gọi phương thức nội bộ trong cùng một class (Self-invocation bỏ qua proxy của Spring AOP).
   - Ngoại lệ bắt được là Checked Exception nhưng không khai báo \`rollbackFor = Exception.class\`.
   - Phương thức để private hoặc protected.

3. **Làm sao để ngăn chặn Race Condition khi cập nhật số lượng tồn kho?**
   - Sử dụng **Pessimistic Locking** (\`SELECT ... FOR UPDATE\`) trong database.
   - Sử dụng **Optimistic Locking** với trường \`@Version\` để kiểm tra xung đột thời điểm commit.
   - Sử dụng Redis Distributed Lock (Redlock) nếu chạy microservices đa server.
    `,
  },
  {
    id: 4,
    title: "Trợ lý AI tạo JD và chấm điểm ứng viên: Cách mạng hóa tuyển dụng doanh nghiệp",
    slug: "tro-ly-ai-tao-jd-cham-diem-ung-vien",
    category: "Xu hướng tuyển dụng AI",
    cover: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80",
    excerpt: "Khám phá cách tính năng sinh JD tự động và đối soát kỹ năng bằng AI trên JobNest giúp doanh nghiệp tiết kiệm 80% thời gian đăng tin và sàng lọc chính xác nhân sự phù hợp.",
    readTime: "5 phút đọc",
    date: "02/10/2026",
    views: 980,
    featured: false,
    tags: ["AI Recruiter", "Job Description", "HR Tech", "Automation"],
    author: {
      name: "JobNest AI Lab",
      role: "Nghiên cứu & Ứng dụng AI",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&q=80",
    },
    content: `
### Đột phá từ AI trong tuyển dụng nhân sự

Quy trình tuyển dụng truyền thống thường mất trung bình 3-5 ngày chỉ để soạn thảo một bản mô tả công việc hoàn chỉnh và lọc hàng trăm hồ sơ nộp về.

Với tính năng Trợ lý AI trên nền tảng JobNest:
- **Tạo JD trong 3 giây:** Chỉ cần nhập chức danh công việc, hệ thống tự động chuẩn hóa yêu cầu kỹ năng, trách nhiệm và quyền lợi theo chuẩn ngành công nghệ thông tin.
- **Phân tích độ tương thích CV:** Hệ thống bóc tách kinh nghiệm, số năm làm việc và dự án thực tế để chấm điểm khách quan theo thang 100, giúp nhà tuyển dụng ưu tiên phỏng vấn những ứng viên chất lượng nhất.
    `,
  },
  {
    id: 5,
    title: "Nghệ thuật đàm phán lương Developer: Bí quyết thương lượng gói đãi ngộ mơ ước",
    slug: "nghe-thuat-dam-phan-luong-developer",
    category: "Kinh nghiệm ứng tuyển",
    cover: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=80",
    excerpt: "Cách khảo sát dải lương thị trường, thời điểm vàng để đề cập thu nhập và biến các quyền lợi như thưởng dự án, làm việc từ xa (Remote/Hybrid) thành lợi thế tài chính.",
    readTime: "7 phút đọc",
    date: "28/09/2026",
    views: 1650,
    featured: false,
    tags: ["Salary Negotiation", "Career Growth", "Tech Talent"],
    author: {
      name: "Chuyên gia HR Tech",
      role: "Head of Talent Acquisition",
      avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=160&q=80",
    },
    content: `
### Khi nào là thời điểm vàng để đàm phán lương?

Nguyên tắc bất di bất dịch trong đàm phán: **Chỉ thương lượng lương khi nhà tuyển dụng đã thực sự muốn có bạn trong đội ngũ** (tức là sau khi đã hoàn thành các vòng phỏng vấn kỹ thuật và nhận được tín hiệu chuẩn bị gửi Offer).

#### 3 Bước chuẩn bị:
1. **Khảo sát thị trường:** Sử dụng các báo cáo thị trường tuyển dụng uy tín để nắm rõ mức sàn và trần cho số năm kinh nghiệm của mình.
2. **Đưa ra một dải lương (Salary Range):** Thay vì nói một con số cứng 20 triệu, hãy nói *"Em kỳ vọng mức thu nhập từ 22 - 26 triệu tùy thuộc vào cấu trúc thưởng và cơ hội thăng tiến của dự án"*.
3. **Đàm phán tổng đãi ngộ (Total Compensation):** Đừng chỉ nhìn vào lương cứng hàng tháng. Hãy chú ý đến tháng lương 13, thưởng KPI dự án, bảo hiểm sức khỏe cao cấp và số ngày nghỉ phép có lương.
    `,
  },
  {
    id: 6,
    title: "Xây dựng Profile GitHub chuyên nghiệp: Đòn bẩy giúp Fresher ghi điểm tuyệt đối",
    slug: "xay-dung-profile-github-chuyen-nghiep",
    category: "Công nghệ & Lập trình",
    cover: "https://images.unsplash.com/photo-1618401471353-b98aedd04e11?auto=format&fit=crop&w=1200&q=80",
    excerpt: "Từng bước thiết kế README cá nhân với animated typing banner, bảng công nghệ trực quan và cách tổ chức commit message chuẩn Convention giúp bạn nổi bật trong mắt Tech Lead.",
    readTime: "5 phút đọc",
    date: "25/09/2026",
    views: 1720,
    featured: false,
    tags: ["GitHub", "Portfolio", "Open Source", "Fresher Tips"],
    author: {
      name: "Hoàng Quân",
      role: "Full-Stack Dev & Career Mentor",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80",
    },
    content: `
### Tại sao Tech Lead luôn xem GitHub trước khi gọi phỏng vấn?

Bằng đại học hay chứng chỉ chỉ cho biết bạn đã qua đào tạo; commit trên GitHub chứng minh bạn **thực sự viết code và có kỷ luật lập trình**.

#### 4 Yếu tố cốt lõi của một GitHub Profile ghi điểm:
1. **README Repository cá nhân (\`<username>/<username>\`):** Giới thiệu súc tích về bản thân, tech stack đang dùng (dùng tech badges từ Shields.io) và dự án nổi bật nhất.
2. **Pinned Projects có README chỉn chu:** Mỗi repo ghim lên phải có ảnh chụp màn hình ứng dụng, sơ đồ kiến trúc (Architecture diagram), hướng dẫn cài đặt (\`git clone\`, \`npm run dev\`, \`mvn spring-boot:run\`) và link Live Demo.
3. **Commit Message chuẩn:** Tránh viết commit kiểu \`fix bug\`, \`update code\`. Hãy dùng Conventional Commits: \`feat: add order cancellation logic\`, \`fix: resolve JWT token expiration issue\`.
4. **Biểu đồ xanh đều đặn:** Tính kỷ luật tự học được phản ánh chân thực nhất qua lịch sử commit hàng tuần.
    `,
  },
];

export default mockBlogs;
