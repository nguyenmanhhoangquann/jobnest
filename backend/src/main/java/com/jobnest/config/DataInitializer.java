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
            employer = userRepository.save(User.builder()
                    .username("tuyendung")
                    .password(passwordEncoder.encode("123456"))
                    .role(Role.EMPLOYER)
                    .fullName("Nguyễn Quản Lý")
                    .displayName("Công ty TNHH Ánh Dương")
                    .companyName("Công ty TNHH Ánh Dương")
                    .email("tuyendung@anhduong.vn")
                    .phone("0900000002")
                    .build());
        }

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
                                .employer(employer)
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
                    .content("Hồ sơ ứng tuyển của bạn tại Công ty TNHH Ánh Dương đã được chuyển sang trạng thái Đã xem.")
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

        log.info("Database initialization completed successfully!");
    }
}
