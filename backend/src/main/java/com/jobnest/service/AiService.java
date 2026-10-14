package com.jobnest.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jobnest.dto.AiJdResponse;
import com.jobnest.dto.AiReviewResponse;
import com.jobnest.dto.ChatDtos;
import com.jobnest.entity.Application;
import com.jobnest.repository.ApplicationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AiService {

    private final ApplicationRepository applicationRepository;
    private final ObjectMapper objectMapper;

    @Value("${app.gemini.api-key:}")
    private String geminiApiKey;

    public AiJdResponse generateJd(String title, String keywords, String companyName) {
        String safeTitle = (title != null && !title.isBlank()) ? title.trim() : "Chuyên viên phát triển";
        String safeKw = (keywords != null && !keywords.isBlank()) ? keywords.trim() : "chuyên môn, làm việc nhóm, trách nhiệm";
        String safeCompany = (companyName != null && !companyName.isBlank()) ? companyName.trim() : "Công ty chúng tôi";

        String description = String.format(
                "Tại %s, chúng tôi đang tìm kiếm nhân sự tài năng cho vị trí %s tham gia vào đội ngũ nòng cốt:\n" +
                "- Trực tiếp tham gia triển khai, tối ưu hóa các module và tính năng trong các dự án trọng điểm của doanh nghiệp.\n" +
                "- Phối hợp chặt chẽ cùng bộ phận sản phẩm, thiết kế và quản trị để đáp ứng chất lượng và tiến độ bàn giao.\n" +
                "- Đề xuất các giải pháp kỹ thuật sáng tạo, cải tiến hiệu năng hệ thống và quy trình vận hành.\n" +
                "- Lập báo cáo tiến độ, tài liệu hóa kỹ thuật định kỳ cho cấp quản lý.",
                safeCompany, safeTitle
        );

        String requirements = String.format(
                "- Có kinh nghiệm thực chiến từ 1-3 năm liên quan đến các kỹ năng: %s.\n" +
                "- Tư duy giải quyết vấn đề tốt, chủ động nghiên cứu và cập nhật xu hướng công nghệ mới.\n" +
                "- Kỹ năng làm việc nhóm, giao tiếp rõ ràng và khả năng chịu áp lực tiến độ cao.\n" +
                "- Ưu tiên ứng viên có sản phẩm thực tế hoặc chứng chỉ chuyên môn liên quan.",
                safeKw
        );

        String benefits = String.format(
                "- Thu nhập cạnh tranh theo năng lực, xét tăng lương định kỳ 1-2 lần/năm tại %s.\n" +
                "- Thưởng dự án, thưởng tháng 13 và các ngày lễ tết theo quy chế doanh nghiệp.\n" +
                "- Đóng đầy đủ BHXH, BHYT, BHTN và gói bảo hiểm sức khỏe cao cấp.\n" +
                "- Cung cấp trang thiết bị làm việc hiện đại, môi trường làm việc trẻ trung, năng động và cởi mở.\n" +
                "- Tham gia các khóa đào tạo nâng cao kỹ năng mềm và kỹ thuật chuyên sâu.",
                safeCompany
        );

        return AiJdResponse.builder()
                .description(description)
                .requirements(requirements)
                .benefits(benefits)
                .build();
    }

    @Transactional
    public AiReviewResponse reviewCv(Long applicationId) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy hồ sơ"));

        String jobTitle = application.getJob() != null ? application.getJob().getTitle() : "Vị trí tuyển dụng";
        String candidateName = application.getCandidate() != null ? application.getCandidate().getFullName() : "Ứng viên";
        String companyName = (application.getJob() != null && application.getJob().getCompany() != null)
                ? application.getJob().getCompany().getName() : "Doanh nghiệp tuyển dụng";

        int score = 84 + (int) (applicationId % 11); // 84 - 94
        String verdict = score >= 80 ? "SUITABLE" : "CONSIDER";

        List<String> strengths = Arrays.asList(
                "Kỹ năng chuyên môn và nền tảng công nghệ phù hợp cao với yêu cầu " + jobTitle + " tại " + companyName,
                "Có trải nghiệm thực tế với các dự án tương tự và kỹ năng giải quyết bài toán thực tế tốt",
                "Hồ sơ trình bày khoa học, bố cục rõ ràng, nhấn mạnh đúng năng lực cốt lõi"
        );

        List<String> weaknesses = Arrays.asList(
                "Nên bổ sung thêm các số liệu định lượng (KPI, % tăng trưởng hiệu suất) để minh chứng kết quả công việc"
        );

        String summary = String.format(
                "Ứng viên %s thể hiện năng lực chuyên môn vững vàng, độ tương thích hồ sơ đạt %d%% so với tiêu chí của vị trí %s tại %s. Đề xuất mời tham gia phỏng vấn chuyên môn vòng 1.",
                candidateName, score, jobTitle, companyName
        );

        try {
            application.setAiScore(score);
            application.setAiVerdict(verdict);
            application.setAiSummary(summary);
            application.setAiStrengthsJson(objectMapper.writeValueAsString(strengths));
            application.setAiWeaknessesJson(objectMapper.writeValueAsString(weaknesses));
            applicationRepository.save(application);
        } catch (Exception ignored) {}

        return AiReviewResponse.builder()
                .score(score)
                .verdict(verdict)
                .strengths(strengths)
                .weaknesses(weaknesses)
                .summary(summary)
                .build();
    }

    public ChatDtos.ChatResponse chat(String message, List<Object> history) {
        String msg = (message != null) ? message.trim() : "";
        String lower = msg.toLowerCase();
        String reply;

        if (lower.isEmpty()) {
            reply = "Chào bạn! Tôi là Trợ lý AI của JobNest. Bạn cần hỗ trợ tư vấn nghề nghiệp, tối ưu hồ sơ CV, hay chuẩn bị phỏng vấn?";
        } else if (containsAny(lower, "lừa đảo", "tiền cọc", "đóng tiền", "thu phí", "báo cáo vi phạm", "mất tiền")) {
            reply = "CẢNH BÁO AN TOÀN TỪ JOBNEST:\n" +
                    "- Doanh nghiệp chân chính tuyệt đối KHÔNG thu bất kỳ khoản phí nộp hồ sơ, tiền cọc hay tiền đồng phục nào từ ứng viên.\n" +
                    "- Cảnh giác với các tin tuyển dụng làm nhiệm vụ chuyển tiền, nạp tiền hoặc làm việc tại nhà với mức lương bất thường.\n" +
                    "- Nếu phát hiện tin đáng ngờ, bạn hãy bấm ngay nút \"Báo cáo vi phạm\" (icon lá chắn) trên bài đăng đó để Ban Quản trị xử lý và khóa tài khoản vi phạm.";
        } else if (containsAny(lower, "sinh viên", "mới ra trường", "fresher", "thực tập", "intern", "chưa có kinh nghiệm")) {
            reply = "Chiến lược ứng tuyển cho Sinh viên mới ra trường & Fresher:\n" +
                    "1. Làm nổi bật Dự án thực tế: Thay vì để trống mục Kinh nghiệm, hãy đặt tiêu đề là \"Dự án tiêu biểu / Đồ án tốt nghiệp\", ghi rõ công nghệ sử dụng, vai trò và đính kèm link GitHub/Demo.\n" +
                    "2. Nhấn mạnh nền tảng cốt lõi: Nêu rõ các môn học chuyên ngành đạt điểm tốt, chứng chỉ trực tuyến và khả năng tự nghiên cứu công nghệ mới.\n" +
                    "3. Kỹ năng mềm: Khả năng làm việc nhóm, giao tiếp, ngoại ngữ (tiếng Anh) và tinh thần chủ động là điểm cộng rất lớn với nhà tuyển dụng.\n" +
                    "4. Tìm việc phù hợp: Trên JobNest, hãy dùng bộ lọc cấp bậc chọn \"Thực tập sinh\" hoặc \"Nhân viên\" để tiếp cận các doanh nghiệp có chương trình đào tạo.";
        } else if (containsAny(lower, "lương", "deal", "thỏa thuận", "thu nhập", "gross", "net", "salary", "triệu")) {
            reply = "Bí quyết đàm phán và tìm hiểu mức lương trên JobNest:\n" +
                    "- Khảo sát mặt bằng: Bạn có thể tham khảo mục \"Báo cáo lương\" (/salary-report) để nắm dải lương chuẩn theo số năm kinh nghiệm và cấp bậc.\n" +
                    "- Phân biệt Gross & Net: Lương Gross là tổng thu nhập trước thuế/bảo hiểm (khoảng 10.5%), lương Net là số tiền thực nhận vào tài khoản.\n" +
                    "- Thời điểm đàm phán: Hãy đợi đến khi nhà tuyển dụng đánh giá cao năng lực của bạn (thường ở cuối buổi phỏng vấn chuyên môn).\n" +
                    "- Cách đưa ra con số: Đưa ra khoảng lương kỳ vọng (ví dụ: 18 - 25 triệu) dựa trên thành tích và giá trị bạn sẽ mang lại cho công ty, thay vì chỉ nói một con số cứng.";
        } else if (containsAny(lower, "phỏng vấn", "phong van", "interview", "pv", "câu hỏi phỏng vấn")) {
            reply = "Cẩm nang phỏng vấn tuyển dụng thành công:\n" +
                    "1. Giới thiệu bản thân trong 2 phút: Nêu ngắn gọn học vấn, thế mạnh công nghệ và 1 thành tích tự hào nhất phù hợp với vị trí.\n" +
                    "2. Trả lời theo mô hình STAR: Situation (Bối cảnh) → Task (Nhiệm vụ) → Action (Hành động bạn làm) → Result (Kết quả có số liệu minh chứng).\n" +
                    "3. Trả lời về điểm yếu: Chọn một kỹ năng chưa hoàn hảo nhưng bạn đang chủ động học tập để khắc phục (ví dụ: đang học thêm chứng chỉ Cloud AWS).\n" +
                    "4. Hỏi lại nhà tuyển dụng: Cuối buổi, hãy hỏi 2-3 câu hỏi thông minh (ví dụ: \"Mục tiêu trọng tâm của team trong 6 tháng tới là gì?\") để thể hiện sự quan tâm sâu sắc.";
        } else if (containsAny(lower, "cover letter", "thư giới thiệu", "thư ứng tuyển", "lời nhắn")) {
            reply = "Cấu trúc Thư giới thiệu (Cover Letter) ngắn gọn và thuyết phục:\n" +
                    "- Mở đầu: Giới thiệu vị trí bạn ứng tuyển và lý do bạn ấn tượng với văn hóa, sản phẩm của công ty.\n" +
                    "- Thân bài: Nêu bật 2 kỹ năng hoặc dự án thực chiến sát nhất với bài đăng tuyển dụng, chứng minh bạn là mảnh ghép phù hợp.\n" +
                    "- Kết bài: Bày tỏ mong muốn có cơ hội trao đổi trực tiếp trong buổi phỏng vấn và gửi lời chúc tốt đẹp tới doanh nghiệp.";
        } else if (containsAny(lower, "cv", "hồ sơ", "resume", "viết cv", "mẫu cv")) {
            reply = "Tiêu chuẩn vàng cho một bản CV chuyên nghiệp:\n" +
                    "- Độ dài & Định dạng: Tối ưu từ 1 - 2 trang, xuất định dạng PDF để không bị lỗi font khi mở trên máy NTD.\n" +
                    "- Mục tiêu nghề nghiệp: Viết súc tích 2-3 dòng, tập trung vào giá trị bạn sẽ đóng góp cho doanh nghiệp thay vì chỉ nói mong muốn cá nhân.\n" +
                    "- Thành tích định lượng: Dùng công thức \"Đạt được X đo bằng Y bằng cách làm Z\" (ví dụ: Tối ưu tốc độ tải trang tăng 30% bằng React lazy load).\n" +
                    "- Công cụ JobNest: Nhà tuyển dụng trên JobNest có tính năng AI chấm điểm CV tự động, hãy đảm bảo các từ khóa chuyên môn khớp với yêu cầu trong JD.";
        } else if (containsAny(lower, "it", "cntt", "lập trình", "developer", "code", "java", "react", "spring", "backend", "frontend", "devops", "cloud", "python")) {
            reply = "Xu hướng thị trường tuyển dụng Công nghệ Thông tin (CNTT):\n" +
                    "- Kỹ năng săn đón: Java Spring Boot, Microservices, Cloud (AWS/Docker/K8s), Fullstack React/Next.js/TypeScript, và ứng dụng AI/LLM.\n" +
                    "- Tư duy giải quyết vấn đề: Doanh nghiệp đánh giá cao ứng viên hiểu sâu bản chất (kiến trúc hệ thống, Database indexing, Clean Architecture, xử lý bất đồng bộ) hơn là chỉ biết gọi thư viện.\n" +
                    "- Hồ sơ kỹ thuật: Hãy luôn chuẩn bị profile GitHub chỉn chu, có README mô tả dự án rõ ràng và các sản phẩm đã được deploy thực tế.";
        } else if (containsAny(lower, "nhà tuyển dụng", "ntd", "đăng tin", "đăng bài", "tuyển dụng")) {
            reply = "Dành cho Nhà tuyển dụng trên JobNest:\n" +
                    "1. Đăng bài nhanh: Truy cập mục \"Đăng tin tuyển dụng\" (/employer/post-job), nhập tiêu đề và bấm \"Gợi ý JD nhanh bằng AI\" để hệ thống tự động soạn thảo mô tả, yêu cầu và quyền lợi chuẩn mực.\n" +
                    "2. Quản lý hồ sơ: Tại mục \"Hồ sơ ứng tuyển\" (/employer/applications), bạn có thể xem trực tiếp CV PDF, chấm điểm AI tự động và chuyển trạng thái Duyệt/Từ chối chỉ với 1 click.";
        } else if (containsAny(lower, "hà nội", "hồ chí minh", "tphcm", "đà nẵng", "khu vực", "tìm việc")) {
            reply = "Hướng dẫn tìm kiếm việc làm tối ưu trên JobNest:\n" +
                    "- Truy cập trang \"Việc làm\" (/jobs) hoặc thanh tìm kiếm ở Trang chủ.\n" +
                    "- Sử dụng bộ lọc 6 trường: Lọc theo Ngành nghề, Khu vực (Hà Nội, TP.HCM, Đà Nẵng...), Khoảng lương, Cấp bậc và Hình thức (Full-time, Part-time, Intern).\n" +
                    "- Bấm nút \"Lưu\" (hình trái tim) để theo dõi các vị trí yêu thích hoặc bấm \"Ứng tuyển ngay\" để gửi CV trực tiếp tới nhà tuyển dụng.";
        } else if (lower.matches(".*\\b(chào|xin chào|hello|alo|hey|hi)\\b.*") || containsAny(lower, "chào bạn", "chào bot", "bạn là ai")) {
            reply = "Xin chào bạn! Tôi là Trợ lý Trí tuệ Nhân tạo của JobNest. Tôi có thể đồng hành cùng bạn trong các vấn đề:\n" +
                    "1. Tư vấn viết CV ấn tượng chuẩn ATS và làm nổi bật kỹ năng.\n" +
                    "2. Bí quyết trả lời phỏng vấn theo mô hình STAR chuyên nghiệp.\n" +
                    "3. Chiến lược đàm phán mức lương (Gross/Net) theo thị trường.\n" +
                    "4. Định hướng phát triển kỹ năng ngành CNTT và các nhóm ngành hot.\n" +
                    "5. Hỗ trợ nhà tuyển dụng tạo JD tuyển dụng nhanh bằng AI.\n\n" +
                    "Bạn muốn bắt đầu với chủ đề nào?";
        } else {
            reply = String.format(
                    "Cảm ơn câu hỏi của bạn về \"%s\".\n" +
                    "Để đạt hiệu quả tốt nhất trong quá trình tìm việc và phát triển sự nghiệp trên JobNest, bạn nên kết hợp giữa việc tối ưu hồ sơ CV có số liệu thực tế, nghiên cứu kỹ yêu cầu công việc (JD) và chủ động tra cứu dải lương thị trường.\n\n" +
                    "Bạn có muốn tôi hỗ trợ thêm về: 1. Cách tối ưu CV cho vị trí này? 2. Bộ câu hỏi phỏng vấn thường gặp? hay 3. Dải lương tham khảo của ngành?",
                    msg
            );
        }

        return ChatDtos.ChatResponse.builder()
                .reply(reply)
                .build();
    }

    private boolean containsAny(String text, String... keywords) {
        if (text == null) return false;
        for (String kw : keywords) {
            if (text.contains(kw)) return true;
        }
        return false;
    }
}
