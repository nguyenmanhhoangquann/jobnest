package com.jobnest.config;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jobnest.entity.*;
import com.jobnest.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.io.InputStream;
import java.time.LocalDateTime;
import java.util.*;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final CompanyRepository companyRepository;
    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;
    private final NotificationRepository notificationRepository;
    private final ReportRepository reportRepository;
    private final PasswordEncoder passwordEncoder;
    private final ObjectMapper objectMapper;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        log.info("Checking database initialization...");

        // 1. Seed Users
        User admin = userRepository.findByUsername("admin").orElse(null);
        if (admin == null) {
            admin = userRepository.save(User.builder()
                    .username("admin")
                    .password(passwordEncoder.encode("123456"))
                    .role(Role.ADMIN)
                    .fullName("Ban Quản Trị Hệ Thống")
                    .displayName("Admin JobNest")
                    .email("admin@jobnest.vn")
                    .phone("0900000001")
                    .build());
        }

        User employer = userRepository.findByUsername("tuyendung").orElse(null);
        if (employer == null) {
            employer = User.builder()
                    .username("tuyendung")
                    .password(passwordEncoder.encode("123456"))
                    .role(Role.EMPLOYER)
                    .build();
        }
        employer.setFullName("Ban Tuyển Dụng FPT");
        employer.setDisplayName("FPT Software");
        employer.setCompanyName("TẬP ĐOÀN CÔNG NGHỆ FPT");
        employer.setEmail("tuyendung@fpt.com.vn");
        employer.setPhone("0988668899");
        employer = userRepository.save(employer);

        User candidate = userRepository.findByUsername("ungvien").orElse(null);
        if (candidate == null) {
            candidate = userRepository.save(User.builder()
                    .username("ungvien")
                    .password(passwordEncoder.encode("123456"))
                    .role(Role.CANDIDATE)
                    .fullName("Nguyễn Văn Hùng")
                    .displayName("Nguyễn Văn Hùng")
                    .email("hung.nguyen@gmail.com")
                    .phone("0987654321")
                    .build());
        }

        // 2. Seed Categories
        if (categoryRepository.count() == 0) {
            ClassPathResource catResource = new ClassPathResource("data/categories.json");
            if (catResource.exists()) {
                try (InputStream is = catResource.getInputStream()) {
                    List<JsonNode> catNodes = objectMapper.readValue(is, new TypeReference<List<JsonNode>>() {});
                    for (JsonNode node : catNodes) {
                        List<String> roles = new ArrayList<>();
                        if (node.has("popularRoles") && node.get("popularRoles").isArray()) {
                            node.get("popularRoles").forEach(r -> roles.add(r.asText()));
                        }

                        Category cat = Category.builder()
                                .slug(node.get("slug").asText())
                                .name(node.get("name").asText())
                                .jobCount(node.has("jobCount") ? node.get("jobCount").asInt() : 0)
                                .icon(node.has("icon") ? node.get("icon").asText() : "FaBriefcase")
                                .image(node.has("image") ? node.get("image").asText() : "")
                                .popularRolesJson(objectMapper.writeValueAsString(roles))
                                .build();
                        categoryRepository.save(cat);
                    }
                    log.info("Seeded {} categories", catNodes.size());
                }
            }
        }

        // 3. Seed Companies & Jobs
        if (jobRepository.count() == 0) {
            Map<String, Company> companyCache = new HashMap<>();
            ClassPathResource jobResource = new ClassPathResource("data/jobs.json");
            if (jobResource.exists()) {
                try (InputStream is = jobResource.getInputStream()) {
                    List<JsonNode> jobNodes = objectMapper.readValue(is, new TypeReference<List<JsonNode>>() {});
                    List<Category> allCats = categoryRepository.findAll();

                    for (JsonNode node : jobNodes) {
                        // Company
                        String compName = "Doanh nghiệp đối tác JobNest";
                        String compLogo = "/images/companies/fpt.svg";
                        if (node.has("company") && node.get("company").isObject()) {
                            JsonNode cNode = node.get("company");
                            if (cNode.has("name")) compName = cNode.get("name").asText();
                            if (cNode.has("logoUrl")) compLogo = cNode.get("logoUrl").asText();
                        }

                        Company company = companyCache.get(compName);
                        if (company == null) {
                            company = companyRepository.findByName(compName).orElse(null);
                            if (company == null) {
                                company = companyRepository.save(Company.builder()
                                        .name(compName)
                                        .logoUrl(compLogo)
                                        .location(node.has("location") ? node.get("location").asText() : "Hà Nội")
                                        .build());
                            }
                            companyCache.put(compName, company);
                        }

                        // Category
                        String catSlug = "cntt";
                        if (node.has("category") && node.get("category").isObject()) {
                            JsonNode catNode = node.get("category");
                            if (catNode.has("slug")) catSlug = catNode.get("slug").asText();
                        }
                        final String searchSlug = catSlug;
                        Category category = allCats.stream()
                                .filter(c -> c.getSlug().equalsIgnoreCase(searchSlug))
                                .findFirst()
                                .orElse(allCats.isEmpty() ? null : allCats.get(0));

                        Job job = Job.builder()
                                .title(node.get("title").asText())
                                .salaryText(node.has("salaryText") ? node.get("salaryText").asText() : "Thỏa thuận")
                                .salaryMin(node.has("salaryMin") && !node.get("salaryMin").isNull() ? node.get("salaryMin").asInt() : null)
                                .salaryMax(node.has("salaryMax") && !node.get("salaryMax").isNull() ? node.get("salaryMax").asInt() : null)
                                .location(node.has("location") ? node.get("location").asText() : "Hà Nội")
                                .area(node.has("area") ? node.get("area").asText() : "ha-noi")
                                .region(node.has("region") ? node.get("region").asText() : "Miền Bắc")
                                .jobType(node.has("jobType") ? node.get("jobType").asText() : "FULL_TIME")
                                .experience(node.has("experience") ? node.get("experience").asText() : "1-2")
                                .position(node.has("position") ? node.get("position").asText() : "staff")
                                .category(category)
                                .company(company)
                                .employer(admin)
                                .isHot(node.has("isHot") && node.get("isHot").asBoolean())
                                .isUrgent(node.has("isUrgent") && node.get("isUrgent").asBoolean())
                                .isTop(node.has("isTop") && node.get("isTop").asBoolean())
                                .description(node.has("description") ? node.get("description").asText() : "")
                                .requirements(node.has("requirements") ? node.get("requirements").asText() : "")
                                .benefits(node.has("benefits") ? node.get("benefits").asText() : "")
                                .quantity(node.has("quantity") ? node.get("quantity").asInt() : 2)
                                .deadline(node.has("deadline") ? node.get("deadline").asText() : "2026-12-31")
                                .build();

                        jobRepository.save(job);
                    }
                    log.info("Seeded {} jobs", jobNodes.size());
                }
            }
        }

        // 4. Seed Applications
        if (applicationRepository.count() == 0) {
            ClassPathResource appResource = new ClassPathResource("data/applications.json");
            if (appResource.exists()) {
                try (InputStream is = appResource.getInputStream()) {
                    List<JsonNode> appNodes = objectMapper.readValue(is, new TypeReference<List<JsonNode>>() {});
                    List<Job> jobs = jobRepository.findAll();

                    for (int i = 0; i < appNodes.size(); i++) {
                        JsonNode aNode = appNodes.get(i);
                        Job targetJob = (i < jobs.size()) ? jobs.get(i) : (jobs.isEmpty() ? null : jobs.get(0));
                        if (targetJob == null) continue;

                        String strengthsJson = null;
                        String weaknessesJson = null;
                        String verdict = "SUITABLE";
                        String summary = "Hồ sơ đạt tiêu chuẩn tốt, đáp ứng đa số tiêu chí của vị trí.";
                        Integer score = 82;

                        if (aNode.has("aiReview") && aNode.get("aiReview").isObject()) {
                            JsonNode rNode = aNode.get("aiReview");
                            if (rNode.has("score")) score = rNode.get("score").asInt();
                            if (rNode.has("verdict")) verdict = rNode.get("verdict").asText();
                            if (rNode.has("summary")) summary = rNode.get("summary").asText();
                            if (rNode.has("strengths")) strengthsJson = objectMapper.writeValueAsString(rNode.get("strengths"));
                            if (rNode.has("weaknesses")) weaknessesJson = objectMapper.writeValueAsString(rNode.get("weaknesses"));
                        }

                        Application application = Application.builder()
                                .job(targetJob)
                                .candidate(candidate)
                                .status(aNode.has("status") ? aNode.get("status").asText() : "PENDING")
                                .cvUrl(aNode.has("cvUrl") ? aNode.get("cvUrl").asText() : "/files/cv_sample.pdf")
                                .coverLetter(aNode.has("coverLetter") ? aNode.get("coverLetter").asText() : "Kính gửi quý công ty, tôi mong muốn ứng tuyển vị trí này.")
                                .aiScore(score)
                                .aiVerdict(verdict)
                                .aiSummary(summary)
                                .aiStrengthsJson(strengthsJson)
                                .aiWeaknessesJson(weaknessesJson)
                                .build();

                        applicationRepository.save(application);
                    }
                    log.info("Seeded {} applications", appNodes.size());
                }
            }
        }

        // 5. Seed Notifications
        if (notificationRepository.count() == 0) {
            notificationRepository.save(Notification.builder()
                    .user(candidate)
                    .content("Chào mừng bạn đến với JobNest - Nền tảng kết nối cơ hội việc làm chuyên nghiệp!")
                    .isRead(false)
                    .createdAt(LocalDateTime.now().minusHours(3))
                    .build());

            notificationRepository.save(Notification.builder()
                    .user(candidate)
                    .content("Hồ sơ ứng tuyển của bạn tại Tập đoàn Công nghệ Hoàng Quân đã được chuyển sang trạng thái Đã xem.")
                    .isRead(false)
                    .createdAt(LocalDateTime.now().minusHours(1))
                    .build());
        }

        // 6. Seed Reports
        if (reportRepository.count() == 0) {
            reportRepository.save(Report.builder()
                    .targetType("JOB")
                    .targetId(1L)
                    .targetTitle("Tuyển nhân viên nhập liệu tại nhà lương 50tr/tháng")
                    .companyName("Công ty TNHH Đầu tư Thịnh Vượng 4.0")
                    .reporterName("Nguyễn Văn Hùng")
                    .reporterUsername("ungvien")
                    .reasonId("FEE_EXTORTION")
                    .reasonLabel("Yêu cầu ứng viên nộp tiền / đóng phí bất thường")
                    .description("Yêu cầu chuyển 500.000đ tiền cọc trước khi giao việc.")
                    .createdAt("14/10/2026")
                    .status("PENDING")
                    .build());
        }

        // 7. Đảm bảo các tin đối tác lớn thuộc admin, riêng FPT Software thuộc employer tuyendung
        final User adminOwner = admin;
        final User fptEmployer = employer;
        final Company fptCompany = companyRepository.findByName("TẬP ĐOÀN CÔNG NGHỆ FPT").orElse(null);

        jobRepository.findAll().forEach(j -> {
            if (j.getCompany() != null && j.getCompany().getName().contains("FPT")) {
                j.setEmployer(fptEmployer);
                jobRepository.save(j);
            } else if (j.getEmployer() != null && j.getEmployer().getId().equals(fptEmployer.getId())) {
                j.setEmployer(adminOwner);
                jobRepository.save(j);
            }
        });

        if (jobRepository.findByEmployerId(fptEmployer.getId()).isEmpty()) {
            Category itCat = categoryRepository.findBySlug("cntt")
                    .orElse(categoryRepository.findAll().stream().findFirst().orElse(null));

            Job hqJob1 = jobRepository.save(Job.builder()
                    .title("Senior Fullstack Developer (Java Spring Boot & ReactJS)")
                    .company(fptCompany)
                    .employer(fptEmployer)
                    .category(itCat)
                    .salaryText("25 - 40 triệu")
                    .salaryMin(25)
                    .salaryMax(40)
                    .location("Cầu Giấy, Hà Nội")
                    .area("ha-noi")
                    .region("Miền Bắc")
                    .jobType("FULL_TIME")
                    .experience("2-5")
                    .position("senior")
                    .quantity(3)
                    .deadline("2026-12-31")
                    .isHot(true)
                    .isUrgent(true)
                    .isTop(true)
                    .description("Tham gia thiết kế kiến trúc và phát triển các sản phẩm công nghệ trọng điểm của Tập đoàn Hoàng Quân.")
                    .requirements("Tối thiểu 3 năm kinh nghiệm với Java Spring Boot, ReactJS/TypeScript, hiểu biết sâu về kiến trúc Microservices và Clean Code.")
                    .benefits("Lương 25 - 40 triệu + thưởng hiệu suất quý. Gói bảo hiểm sức khỏe cao cấp và trang thiết bị làm việc hiện đại.")
                    .build());

            Job hqJob2 = jobRepository.save(Job.builder()
                    .title("Frontend Software Engineer (ReactJS / TypeScript / UI-UX)")
                    .company(fptCompany)
                    .employer(fptEmployer)
                    .category(itCat)
                    .salaryText("18 - 28 triệu")
                    .salaryMin(18)
                    .salaryMax(28)
                    .location("Cầu Giấy, Hà Nội")
                    .area("ha-noi")
                    .region("Miền Bắc")
                    .jobType("FULL_TIME")
                    .experience("1-2")
                    .position("staff")
                    .quantity(2)
                    .deadline("2026-12-31")
                    .isHot(true)
                    .isUrgent(false)
                    .isTop(true)
                    .description("Xây dựng giao diện web ứng dụng hiện đại, tối ưu trải nghiệm người dùng theo các chuẩn thiết kế mới nhất.")
                    .requirements("Thành thạo ReactJS, CSS/SCSS, Responsive, RESTful API và tư duy thẩm mỹ giao diện tốt.")
                    .benefits("Thu nhập 18 - 28 triệu, xét tăng lương 2 lần/năm, trang bị máy Mac làm việc.")
                    .build());

            jobRepository.save(Job.builder()
                    .title("Cloud DevOps Specialist (Docker, Kubernetes, AWS/GCP)")
                    .company(fptCompany)
                    .employer(fptEmployer)
                    .category(itCat)
                    .salaryText("22 - 35 triệu")
                    .salaryMin(22)
                    .salaryMax(35)
                    .location("Cầu Giấy, Hà Nội")
                    .area("ha-noi")
                    .region("Miền Bắc")
                    .jobType("FULL_TIME")
                    .experience("2-5")
                    .position("specialist")
                    .quantity(2)
                    .deadline("2026-12-31")
                    .isHot(false)
                    .isUrgent(true)
                    .isTop(false)
                    .description("Quản trị hạ tầng đám mây, tự động hóa quy trình CI/CD và giám sát hệ thống 24/7.")
                    .requirements("Kinh nghiệm thực chiến với Docker, K8s, Linux, CI/CD Pipeline và quản trị bảo mật mạng.")
                    .benefits("Lương thỏa thuận 22 - 35 triệu, chế độ đãi ngộ vượt trội.")
                    .build());

            jobRepository.save(Job.builder()
                    .title("Thực tập sinh Lập trình Web Fullstack (Internship)")
                    .company(fptCompany)
                    .employer(fptEmployer)
                    .category(itCat)
                    .salaryText("6 - 10 triệu")
                    .salaryMin(6)
                    .salaryMax(10)
                    .location("Cầu Giấy, Hà Nội")
                    .area("ha-noi")
                    .region("Miền Bắc")
                    .jobType("INTERN")
                    .experience("none")
                    .position("intern")
                    .quantity(5)
                    .deadline("2026-12-31")
                    .isHot(false)
                    .isUrgent(false)
                    .isTop(false)
                    .description("Được kèm cặp trực tiếp bởi Senior Developer trong các dự án thực chiến tại tập đoàn.")
                    .requirements("Sinh viên năm 3-4 chuyên ngành CNTT, nắm vững kiến thức lập trình cơ bản và có tinh thần cầu tiến.")
                    .benefits("Trợ cấp thực tập 6 - 10 triệu/tháng, cơ hội chuyển lên nhân viên chính thức sau 3 tháng.")
                    .build());

            if (!applicationRepository.existsByCandidateIdAndJobId(candidate.getId(), hqJob1.getId())) {
                List<String> strengths = Arrays.asList(
                        "Kỹ năng Java Spring Boot và ReactJS rất vững chắc, khớp hoàn toàn với JD",
                        "Có sản phẩm thực tế triển khai trên Docker và tư duy Clean Architecture tốt",
                        "CV trình bày mạch lạc, định lượng rõ ràng các kết quả đạt được"
                );
                List<String> weaknesses = Arrays.asList(
                        "Cần trau dồi thêm kỹ năng giao tiếp tiếng Anh chuyên ngành"
                );

                applicationRepository.save(Application.builder()
                        .job(hqJob1)
                        .candidate(candidate)
                        .status("PENDING")
                        .cvUrl("/files/cv_sample.pdf")
                        .coverLetter("Kính gửi Ban Giám đốc Tập đoàn Hoàng Quân, tôi đã theo dõi các dự án công nghệ của tập đoàn và rất mong muốn được cống hiến năng lực Fullstack của mình vào đội ngũ.")
                        .aiScore(94)
                        .aiVerdict("SUITABLE")
                        .aiSummary("Ứng viên Nguyễn Văn Hùng đạt 94/100 điểm tương thích cho vị trí Senior Fullstack Developer tại Tập đoàn Công nghệ Hoàng Quân. Rất phù hợp mời phỏng vấn ngay.")
                        .aiStrengthsJson(objectMapper.writeValueAsString(strengths))
                        .aiWeaknessesJson(objectMapper.writeValueAsString(weaknesses))
                        .build());
            }
        }

        log.info("Database initialization completed successfully!");
    }
}
